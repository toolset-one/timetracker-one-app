export let swsServer = {}



let sws
export const setSWS = swsToSet => sws = swsToSet



swsServer.init = async json => {

	await swsServer.db.init(json.models)
	await swsServer.store.init()
	swsServer.gateway.init(json.server)
	swsServer.auth.init()

	swsServer.bridge.answer({
		promiseId: json.promiseId,
		answer: {}
	})

	// Unhandled Promise Bla
}



swsServer.auth = {

	serverKnowsAuth: false,

	init: async () => {
		const authData = await swsServer.store.get('authData')
		if(authData) {
			swsServer.auth.updateAuth(authData.user, authData.jwt, false)
		} else {
			swsServer.auth.updateAuth(null, null, false)
		}
	},

	newConnection: async () => {
		const authData = await swsServer.store.get('authData')
		if(authData) {

			console.log('AUTH DATA', authData)

			swsServer.gateway.send({
				action: 'signInWithToken',
				jwt: authData.jwt
			}).then(res => {
				swsServer.auth.serverKnowsAuth = true
				swsServer.db.__sync()
			}).catch(err => {
				// TODO: Re-Sign In? Sign Out?
			})

		}
	},

	signUp: json => {
		swsServer.gateway.send({
			action: 'signUp',
			email: json.email,
			password: json.password
		}).then(res => {
			swsServer.bridge.answer({
				promiseId: json.promiseId,
				answer: res
			})
		}).catch(err => {
			swsServer.bridge.answer({
				promiseId: json.promiseId,
				err
			})
		})
	},


	signIn: json => {
		swsServer.gateway.send({
			action: 'signIn',
			email: json.email,
			password: json.password
		}).then(res => {
			swsServer.bridge.answer({
				promiseId: json.promiseId,
				answer: res
			})
		}).catch(err => {
			swsServer.bridge.answer({
				promiseId: json.promiseId,
				err
			})
		})
	},

	signOut: async json => {
		await swsServer.store.set('authData', null)
		swsServer.bridge.answer({
			promiseId: json.promiseId
		})
	},

	updateAuth: (user, jwt, shouldSet) => {

		const authData = {
			user,
			jwt
		}

		if(shouldSet) {
			swsServer.store.set('authData', authData)
		}

		swsServer.bridge.answer({
			action: 'updateAuth',
			answer: authData
		})
	}
}


swsServer.db = {

	models: {},
	objectStores: {},
	hooks: {},

	createIndex: (objStore, index) => {
		index = index.sort()
		const objStoreIndex = index.length === 1 ? index[0] : index
		objStore.createIndex(index.join(','), objStoreIndex, {
			unique: false
		})
	},

	getNewId: () => {
	    var timestamp = (new Date().getTime() / 1000 | 0).toString(16)
	    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
	        return (Math.random() * 16 | 0).toString(16)
	    }).toLowerCase()
	},

	init: models => {
		return new Promise((resolve, reject) => {
			swsServer.db.models = models

			const req = indexedDB.open('database', 2)

			req.onsuccess = e => {
				swsServer.db.db = e.target.result
				swsServer.db.__sync()
				resolve()
			}

			req.onerror = err => reject(err)

			req.onupgradeneeded = e => {
				swsServer.db.db = e.target.result

				Object.values(swsServer.db.models).forEach(model => {
					swsServer.db.objectStores[model.col] = swsServer.db.db.createObjectStore(model.col, { keyPath: 'id' })
					swsServer.db.createIndex(swsServer.db.objectStores[model.col], ['__sync'])

					model.indexes.forEach(val => {
						swsServer.db.createIndex(swsServer.db.objectStores[model.col], val)
					})
				})

				resolve()
			}
		})
	},

	__sync: () => {
		if(swsServer.auth.serverKnowsAuth) {
			Object.keys(swsServer.db.models).forEach(col => {
				const req = swsServer.db.db.transaction(col, 'readonly').objectStore(col).index('__sync').get(1)
				req.onsuccess = e => {
					if(req.result) {
						swsServer.gateway.send({
							action: 'syncToServer',
							col,
							data: req.result
						}).then(res => {
							console.log('RES', res)
							const req2 = swsServer.db.db.transaction(col).objectStore(col).get(req.result.id)
							req2.onsuccess = e => {
								req2.result.__sync = 0
								const req3 = swsServer.db.db.transaction(col, 'readwrite').objectStore(col).put(req2.result)
								req3.onsuccess = e => {
									setTimeout(() => {
										swsServer.db.__sync()
									}, 1000)
								}
							}
						}).catch(err => {
							console.log(err)
							setTimeout(() => {
								swsServer.db.__sync()
							}, 1000)
						})
					}
				}

			})
		}
	},


	new: ({ promiseId, col, data, id = swsServer.db.getNewId() }) => {


		const date = new Date()

		let obj = {
			id: id,
			createdAt: date,
			updatedAt: date,
			__deleted: false,
			__updates: {
				__deleted: date
			},
			__sync: 1
		}

		Object.keys(swsServer.db.models[col].attributes).forEach(attr => {
			obj[attr] = data[attr] ? data[attr] : swsServer.db.models[col].attributes[attr]
			obj.__updates[attr] = date
		})

		const req = swsServer.db.db.transaction(col, 'readwrite').objectStore(col).put(obj)

		req.onerror = err => {
			swsServer.bridge.answer({
				promiseId,
				err
			})
		}

		req.onsuccess = e => {
			swsServer.bridge.answer({
				promiseId,
				answer: obj
			})

			swsServer.db.__processHooks(col, obj)
			swsServer.db.__sync()
		}

	},


	update: ({ promiseId, col, id, data }) => {

		const date = new Date(),
			req = swsServer.db.db.transaction(col).objectStore(col).get(id)

		req.onerror = err => {
			swsServer.bridge.answer({
				promiseId,
				err
			})
		}

		req.onsuccess = e => {
			if (!req.result) {
				swsServer.bridge.answer({
					promiseId,
					err: {
						code: 'obj-not-found'
					}
				})
			}

			let obj = req.result

			Object.keys(data).forEach(key => {
				if (swsServer.db.models[col].attributes.hasOwnProperty(key) || key === '__deleted') {
					obj[key] = data[key]
					obj.__updates[key] = date
					obj.updatedAt = date
					obj.__sync = 1
				}
			})

			const req2 = swsServer.db.db.transaction(col, 'readwrite').objectStore(col).put(obj)

			req2.onerror = err => {
				swsServer.bridge.answer({
					promiseId,
					err
				})
			}

			req2.onsuccess = e => {
				swsServer.bridge.answer({
					promiseId,
					answer: obj
				})

				swsServer.db.__processHooks(col, obj)
				swsServer.db.__sync()
			}
		}

	},


	query: ({ promiseId, col, query }) => {

		const index = (Object.keys(query).sort()).join(','),
			values = (Object.keys(query).sort()).map(key => query[key]),
			req = swsServer.db.db.transaction(col, 'readonly').objectStore(col).index(index).getAll(values.length === 1 ? values[0] : values)
	
		req.onerror = err => {
			swsServer.bridge.answer({
				promiseId,
				err
			})
		}

		req.onsuccess = e => {
			swsServer.bridge.answer({
				promiseId,
				answer: req.result.filter(val => !val.__deleted)
			})
		}
	},




	get: ({ promiseId, col, id }) => {
		const req = swsServer.db.db.transaction(col, 'readonly').objectStore(col).get(id)

		req.onerror = err => {
			swsServer.bridge.answer({
				promiseId,
				err
			})
		}

		req.onsuccess = e => {
			if (req.result) {
				if(!req.result.__deleted) {
					delete req.result.__deleted
					delete req.result.__updates
					delete req.result.__sync

					swsServer.bridge.answer({
						promiseId,
						answer: req.result
					})
				} else {
					swsServer.bridge.answer({
						promiseId,
						answer: null
					})
				}
			} else {
				swsServer.bridge.answer({
					promiseId,
					answer: null
				})
			}
		}
	},


	hook: ({ col, query, hook }) => {
		swsServer.db.hooks[hook] = {
			col,
			query
		}
	},

	unhook: ({ hook }) => {
		delete swsServer.db.hooks[hook]
	},

	__processHooks: (col, obj) => {
		Object.keys(swsServer.db.hooks).forEach(key => {
			const hook = swsServer.db.hooks[key]
			if(hook.col === col) {

				let matches = true
				Object.keys(hook.query).forEach(key => {
					if(obj[key] != hook.query[key]) {
						matches = false
					}
				})

				if(matches) {
					swsServer.bridge.answer({
						action: 'processHook',
						answer: {
							hook: key,
							obj
						}
					})
				}
			}
		})
	}
}



swsServer.gateway = {
	promises: {},
	ws: null,
	init: serverUrl => {

		swsServer.gateway.serverUrl = serverUrl

		try {
			swsServer.gateway.ws = new WebSocket(swsServer.gateway.serverUrl)
		} catch(err) {
			console.log('ERR', err)
		}

		swsServer.gateway.ws.onopen = () => {
			swsServer.gateway.connected = true

			swsServer.auth.newConnection()
		}

		swsServer.gateway.ws.onclose = () => {
			swsServer.gateway.connected = false

			setTimeout(() => {
				swsServer.gateway.init(swsServer.gateway.serverUrl)
			}, 1000)
		}

		swsServer.gateway.ws.onmessage = message => {

			const json = JSON.parse(message.data)

			if(json && swsServer.gateway.promises[json.promiseId]) {
				swsServer.gateway.promises[json.promiseId][json.err ? 'reject' : 'resolve'](json.err ? json.err :json.answer)
			} else {
				switch(json.action) {
					case 'updateAuth':
						swsServer.auth.updateAuth(json.user, json.jwt, true)
						break;
				}
			}
		} 
	},

	send: json => {
		json.promiseId = Math.floor(Math.random() * 1000000000000)

		return new Promise((resolve, reject) => {
			swsServer.gateway.promises[json.promiseId] = {
				resolve,
				reject
			}
			swsServer.gateway.ws.send(JSON.stringify(json))
		})
	}
}



swsServer.bridge = {

	functionMap: {
		init: swsServer.init,

		signUp: swsServer.auth.signUp,
		signIn: swsServer.auth.signIn,
		signOut: swsServer.auth.signOut,

		new: swsServer.db.new,
		query: swsServer.db.query,
		hook: swsServer.db.hook,
		unhook: swsServer.db.unhook,
		get: swsServer.db.get,
		update: swsServer.db.update
	},

	postMessage: jsonString => {
		const json = JSON.parse(jsonString)
		swsServer.bridge.functionMap[json.action](json)
	},

	answer: json => {
		sws.bridge.postMessage(JSON.stringify(json))
	}
}



swsServer.store = {

	init: () => {
		return new Promise((resolve, reject) => {
			const createIndex = (objStore, index) => objStore.createIndex(index, index, { unique: false })

			const req = indexedDB.open('keyvalue', 1)

			req.onsuccess = e => {
				swsServer.store.db = e.target.result
				resolve()
			}

			req.onerror = err => reject(err)

			req.onupgradeneeded = e => {
				swsServer.store.db = e.target.result
				swsServer.store.db.createObjectStore('keyvalue')
				resolve()
			}
		})
	},

	set: (key, val) => {
		return new Promise((resolve, reject) => {
			const req = swsServer.store.db.transaction('keyvalue', 'readwrite').objectStore('keyvalue').put(val, key)
			req.onerror = e => reject(e)
			req.onsuccess = e => resolve(e)
		})
	},

	get: key => {
		return new Promise((resolve, reject) => {
			const req = swsServer.store.db.transaction('keyvalue', 'readonly').objectStore('keyvalue').get(key)
			req.onerror = e => reject(e)
			req.onsuccess = e => resolve(req.result)
		})
	}
}








/*

queryOld: ({ promiseId, col, query }) => {

		console.log(query)

		const answer = objs => {
			swsServer.bridge.answer({
				promiseId,
				answer: objs
			})
		}

		values = (typeof values === 'object' ? values : [values]).sort()

		let objs = [],
			i = 0

		const req = swsServer.db.db.transaction(col, 'readonly').objectStore(col).index(index).openCursor()

		req.onerror = err => {
			swsServer.bridge.answer({
				promiseId,
				err
			})
		}

		req.onsuccess = e => {
			let cursor = e.target.result

			if (!cursor) {
				answer(objs)
				return
			}

			let key = cursor.key
			while (key > values[i]) {
				i++
				if (i === values.length) {
					answer(objs)
					return
				}
			}

			if (key === values[i]) {
				let cursorValue = cursor.value
				if (!cursorValue.__deleted) {
					delete cursorValue.__deleted
					delete cursorValue.__updates
					delete cursorValue.__sync
					objs.push(cursorValue)
				}
				cursor.continue()
			} else {
				cursor.continue(values[i])
			}
		}
	},

*/