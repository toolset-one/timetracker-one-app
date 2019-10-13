const jwt = require('jsonwebtoken')
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


exports.signIn = async (ws, sockets, { promiseId, email, password }) =>
	new Promise(async (resolve, reject) => {

		if(!isEmailValid(email.toLowerCase())) {
			reject({
				code: 'email-not-valid'
			})
			return
		}

		const user = await db.findOne({
			collection: 'users',
			object: {
				email: email.toLowerCase()
			}
		}).catch(err => {
			reject({
				code: 'user-not-found'
			})
		})


		if(!user) {
			reject({
				code: 'user-not-found'
			})
			return
		}


		const isPasswordCorrect = await bcryptPasswordCompare(password, user.password).catch(err => {
			reject({
				code: 'password-not-correct'
			})
		})

		if(!isPasswordCorrect) {
			reject({
				code: 'password-not-correct'
			})
			return
		}

		const safetyToken = await db.create({
			collection: 'tokens',
			object: {
				user: user._id,
				sync: {
					times: { 
							lastId: null,
							date: new Date(2000, 0, 0),
					},
					tasks: { 
							lastId: null,
							date: new Date(2000, 0, 0),
					},
					settings: { 
							lastId: null,
							date: new Date(2000, 0, 0)
						}
				}
			}
		}).catch(err => {
			reject({
				code: 'token-was-not-created'
			})
		})

		//
		ws.send(
			JSON.stringify({
				action: 'updateAuth',
				user: {
					id: user._id,
					email: user.email,
					emailVerified: user.emailVerified,
					teams: user.teams
				},
				jwt: getTokenForData({
					id: user._id,
					email: user.email,
					emailVerified: user.emailVerified,
					teams: user.teams,
					safetyToken: safetyToken._id
				})
			})
		)

		resolve(true)
	})