const jwt = require('jsonwebtoken')
const { db } = require('../../libs/db.js')




exports.syncToServer = async (ws, sockets, { col, data }) =>
	new Promise(async (resolve, reject) => {

		console.log(col, data)

		resolve(true)
	})