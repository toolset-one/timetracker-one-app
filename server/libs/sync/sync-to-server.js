const jwt = require('jsonwebtoken')
const { db } = require('../../libs/db.js')

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

		} else {
	
			const id = data.id
			delete data.id

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

		resolve(true)
	})