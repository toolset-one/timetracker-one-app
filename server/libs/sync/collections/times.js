const jwt = require('jsonwebtoken')
const { db } = require('../../../libs/db.js')

const ATTRIBUTES = [
	'id',
	'createdAt',
	'updatedAt',
	'__deleted',
	'__updates',
	'__sync',
	'duration',
	'day',
	'task',
	'comment',
	'user',
	'team'
]


exports.shouldBeSynced = async (obj, user) =>
	new Promise(async (resolve, reject) => {

		if(Object.keys(obj).length != ATTRIBUTES.length) {
			resolve(false)
		}

		ATTRIBUTES.forEach(attr => {
			if(obj.hasOwnProperty(attr)) {
				resolve(false)
			}
		})

		if(obj.user != user.id) {
			resolve(false)
		}
				
		if(!user.teams[obj.team]) {
			resolve(false)
		}


		console.log('##############')
		console.log('shouldBeSynced')
		console.log('##############')
		console.log(obj)
		console.log(Object.keys(obj).length)
		console.log(user)

		resolve(true)

	})