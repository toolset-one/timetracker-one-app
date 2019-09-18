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
	'duration',
	'day',
	'task',
	'comment',
	'user',
	'team'
]
exports.ATTRIBUTES = ATTRIBUTES


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