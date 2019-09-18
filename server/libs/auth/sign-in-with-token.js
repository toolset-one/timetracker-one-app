const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { db } = require('../../libs/db.js')
const { sendMail } = require('../../libs/mail.js')

const SECRET = '5oF79a0z8zsbTyn61IJjPX2y7XDGlyOmDeyL2YrRIUHCOl2cxFP3RlljYLQQv2tZUnX3UGEoJ4xzTztv'


const promisify = async (fn, args) =>
	new Promise((resolve, reject) => 
		fn(args, resolve, reject)
	)


const bcryptCompare = ({ password, hash }, resolve, reject) =>
	bcrypt.compare(
		password, hash,
		(err, val) =>
		!err
			? resolve(val)
			: reject('wrong-password')
	)


const bcryptPasswordCompare = (password, hash) => promisify(bcryptCompare, { password, hash })


const isEmailValid = email => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase())
}


const getTokenForData = data => jwt.sign(data, SECRET, { expiresIn: '168h' })


exports.signInWithToken = async (ws, sockets, { promiseId, jwt }) =>
	new Promise(async (resolve, reject) => {

		let decodedWebToken = {}
		try {
			decodedWebToken = jsonwebtoken.verify(jwt, SECRET)
		} catch(err) {
			reject({
				err: 'token-cant-be-decoded'
			})
			return
		}

		console.log(decodedWebToken.safetyToken)

		const safetyToken = await db.get({
			collection: 'tokens',
			id: decodedWebToken.safetyToken
		}).catch(err => {
			reject({
				code: 'safety-token-not-found'
			})
			return
		})

		if(!safetyToken || safetyToken.user != decodedWebToken.id) {
			reject({
				code: 'safety-token-not-equal'
			})
		}

		ws.userData = decodedWebToken
		ws.userData.syncDate = safetyToken.sync

		resolve(true)
	})