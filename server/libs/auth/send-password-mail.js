const { db } = require('../../libs/db.js'),
	{ sendMail } = require('../../libs/mail.js')

exports.sendPasswordMail = async (ws, sockets, { promiseId, email }) =>
	new Promise(async (resolve, reject) => {
		resolve(true)
	})