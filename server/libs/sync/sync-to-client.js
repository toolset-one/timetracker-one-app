const jwt = require('jsonwebtoken')
const { db } = require('../../libs/db.js')

let collections = {}


exports.syncToClient = async (ws, sockets, {}) => 
	syncToUserClient(ws.userData)


const syncToUserClient = async ws =>
	new Promise(async (resolve, reject) => {

		let found = false

		console.log('### FIRST ###', ws.userData)

		const objs = await Promise.all(
			Object.keys(ws.userData.syncDate).map(async col => {
				objects = await getObjectsToSync(col, ws.userData.syncDate[col].date)

				return {
					col,
					objects
				}
			})
		)

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
	console.log('DATE DATE', date)
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

	console.log(objectsToSync.length)

	return objectsToSync
}



exports.verifySyncToClient = async(ws, sockets, { col, id, date }) => {
	new Promise(async (resolve, reject) => {
		console.log(ws.userData.safetyToken)

		let safetyToken = await db.get({
			collection: 'tokens',
			id: ws.userData.safetyToken
		}).catch(err => {
			console.log('ERR', err)
		})

		if(!safetyToken) {
			reject({
				code: 'no-safety-token'
			})
			return
		}

		safetyToken.sync[col].lastId = id
		safetyToken.sync[col].date = new Date(date)

		const success = await db.update({
			collection: 'tokens',
			id: ws.userData.safetyToken,
			obj: safetyToken
		}).catch(err => {
			reject({
				code: 'update-failed'
			})
			return
		})

		ws.userData.syncDate = safetyToken.sync

		syncToUserClient(ws)
		
		resolve(true)
	})
}