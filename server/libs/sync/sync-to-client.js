const jwt = require('jsonwebtoken'),
	ObjectID = require('mongodb').ObjectID,
	{ db } = require('../../libs/db.js')

const collections = {
	times: require('./collections/times.js'),
	tasks: require('./collections/tasks.js'),
	settings: require('./collections/settings.js')
}


exports.syncToClient = async (ws, sockets, {}) => 
	syncToUserClient(ws.userData)


const syncToUserClient = async ws =>
	new Promise(async (resolve, reject) => {

		let i = 0,
			found = false,
			objs = []
		while(!found && Object.keys(ws.userData.syncDate)[i]) {
			const col = Object.keys(ws.userData.syncDate)[i],
				objects = await getObjectsToSync(ws.userData.id, Object.keys(ws.userData.teams), col, ws.userData.syncDate[col].date)

			i++

			if(objects.length > 0) {
				found = true
				objs.push({
					col,
					objects
				})
			}
		}

		objs.forEach(val => {
			ws.send(
				JSON.stringify({
					action: 'syncToClient',
					col: val.col,
					objects: val.objects
				})
			)
		})

		resolve(true)
	})

exports.syncToUserClient = syncToUserClient



const getObjectsToSync = async (userId, teams, col, date) => {

	let searchObject = {
		...collections[col].DB_SEARCH, 
		...{
			updatedAt: {
				$gt: new Date(date)
			}
		}
	}

	Object.keys(searchObject).forEach(key => {
		if(searchObject[key] === '$TEAM') {
			searchObject[key] = {
				$in: teams
			}
		} 

		if(searchObject[key] === '$USER') {
			searchObject[key] = new ObjectID(userId)
		} 
	})

	const objectsToSync = await db.find({
		collection: col,
		object: searchObject
	}).catch(err => {
		reject({
			code: ''
		})
		return []
	})

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

		// setTimeout(() => {
			syncToUserClient(ws)
		// }, 5000)
		
		resolve(true)
	})
}