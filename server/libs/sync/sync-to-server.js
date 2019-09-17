const jwt = require('jsonwebtoken')
const { db } = require('../../libs/db.js')

let collections = {}


exports.syncToServer = async (ws, sockets, { col, data }) =>
	new Promise(async (resolve, reject) => {

		console.log('BLU')

		if(!collections[col]) {
			collections[col] = require('./collections/'+ col +'.js')
		}

		const shouldBeSynced = await collections[col].shouldBeSynced(data, ws.userData)

		// console.log('SYNC', shouldBeSynced, col, data, ws.userData)

		resolve(true)
	})