const jwt = require('jsonwebtoken')
const { db } = require('../../libs/db.js')

let collections = {}


exports.syncToClient = async (ws, sockets, {}) => 
	syncToUserClient(ws.userData)


const syncToUserClient = async ws =>
	new Promise(async (resolve, reject) => {

		let found = false

		const objs = await Promise.all(
			Object.keys(ws.userData.syncDate).map(async col => {
				let objects = []
				if(!found) {
					objects = await getObjectsToSync(col, ws.userData.syncDate[col].date)

					if(objects.length >= 1) {
						found = true
					}
				}

				return {
					col,
					objects
				}
			})
		)

		console.log(objs)

		objs.forEach(val => {
			if(val.objects.length >= 1) {
				ws.send(
					JSON.stringify({
						action: 'syncToClient',
						col: val.col,
						objects: val.objects
					})
				)
			}
		})

		resolve(true)
	})

exports.syncToUserClient = syncToUserClient


const getObjectsToSync = async (col, date) => {
	const objectsToSync = await db.find({
		collection: col,
		object: {
			updatedAt: {
				$gt: new Date(date)
			}
		}
	}).catch(err => {
		reject({
			code: ''
		})
		return []
	})

	return objectsToSync
}