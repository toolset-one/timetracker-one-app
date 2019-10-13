const jwt = require('jsonwebtoken'),
	{ db } = require('../../libs/db.js'),
	{ socketsTeams } = require('../../libs/sockets.js'),
	{ syncToUserClient } = require('../../libs/sync/sync-to-client.js')

let collections = {}


exports.syncToServer = async (ws, sockets, { col, data }) =>
	new Promise(async (resolve, reject) => {

		if(!collections[col]) {
			collections[col] = require('./collections/'+ col +'.js')
		}

		const shouldBeSynced = await collections[col].shouldBeSynced(data, ws.userData)

		if(!shouldBeSynced) {
			reject({
				code: 'should-not-be-synced'
			})
		}

		let dataInDb = await db.get({
			collection: col,
			id: data.id
		}).catch(err => {
			console.log(err)
			reject({
				code: 'should-not-be-synced'
			})
		})


		let newObj = null

		if(dataInDb) {

			collections[col].ATTRIBUTES.forEach(attr => {
				if((new Date(data.__updates[attr])) > (new Date(dataInDb.__updates[attr]))) {
					dataInDb[attr] = data[attr]
					dataInDb.__updates[attr] = new Date(data.__updates[attr])

					if(new Date(data.__updates[attr]) > new Date(dataInDb.updatedAt)) {
						dataInDb.updatedAt = new Date(data.__updates[attr])
					}
				}
			})

			dataInDb.createdAt = new Date(dataInDb.createdAt)
			dataInDb.updatedAt = new Date(dataInDb.updatedAt)
			Object.keys(dataInDb.__updates).forEach(key => dataInDb.__updates[key] = new Date(dataInDb.__updates[key]))

			const success = await db.update({
				collection: col,
				id: data.id,
				obj: dataInDb
			}).catch(err => {
				console.log(err)
				reject({
					code: 'update-failed'
				})
			})

			newObj = dataInDb

		} else {
	
			const id = data.id
			delete data.id

			data.createdAt = new Date(data.createdAt)
			data.updatedAt = new Date(data.updatedAt)
			Object.keys(data.__updates).forEach(key => data.__updates[key] = new Date(data.__updates[key]))

			newObj = await db.create({
				collection: col,
				object: data,
				id: id
			}).catch(err => {
				reject({
					code: 'new-database-object-failed'
				})
			})
		}

		const shouldBeSyncedOutTo = collections[col].shouldBeSyncedOut(ws, socketsTeams, newObj)

		shouldBeSyncedOutTo.forEach(clientSocket => syncToUserClient(clientSocket))

		resolve(true)
	})