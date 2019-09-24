const jwt = require('jsonwebtoken')
const { db } = require('../../../libs/db.js')

const STANDARD_ATTRIBUTES = [
	'id',
	'createdAt',
	'updatedAt',
	'__deleted',
	'__updates',
	'__sync'
]


const ATTRIBUTES = [
	'title',
	'project',
	'color',
	'archived',
	'user',
	'team'
]
exports.ATTRIBUTES = ATTRIBUTES



const DB_SEARCH = {
	team: '$TEAM'
}
exports.DB_SEARCH = DB_SEARCH


exports.shouldBeSynced = async (obj, user) =>
	new Promise(async (resolve, reject) => {

		if(Object.keys(obj).length != (ATTRIBUTES.length + STANDARD_ATTRIBUTES.length)) {
			console.log(Object.keys(obj).length, (ATTRIBUTES.length + STANDARD_ATTRIBUTES.length))
			resolve(false)
		}

		ATTRIBUTES.forEach(attr => {
			if(!obj.hasOwnProperty(attr)) {
				resolve(false)
			}
		})

		STANDARD_ATTRIBUTES.forEach(attr => {
			if(!obj.hasOwnProperty(attr)) {
				resolve(false)
			}
		})

		if(obj.user != user.id) {
			resolve(false)
		}
				
		if(!user.teams[obj.team]) {
			resolve(false)
		}

		// TODO: Maybe control type of every attribute?

		resolve(true)
	})


exports.shouldBeSyncedOut = (ws, socketsTeams, newObj) => {
	if(socketsTeams[newObj.team]) {
		return (socketsTeams[newObj.team]).filter(client => client.clientId != ws.clientId)
	}

	return []
}