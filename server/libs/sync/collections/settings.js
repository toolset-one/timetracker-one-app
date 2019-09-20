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
	'language',
	'stopwatchEntryId',
	'stopwatchStartTime'
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

		console.log('############')
		console.log('############')
		console.log('############')
		console.log('############')
		console.log(obj)

		if(obj.id != user.id) {
			resolve(false)
		}

		// TODO: Maybe control type of every attribute?

		resolve(true)
	})