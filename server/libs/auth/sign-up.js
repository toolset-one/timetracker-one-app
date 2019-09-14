const bcrypt = require('bcrypt')
const { db } = require('../../libs/db.js')
const { sendMail } = require('../../libs/mail.js')


const promisify = async (fn, args) =>
	new Promise((resolve, reject) => 
		fn(args, resolve, reject)
	)


const bcryptString = ({ password }, resolve, reject) =>
  bcrypt.hash(
    password, 10,
    (err, val) =>
    !err 
    	? resolve(val) 
    	: reject('system-error (hash-algorithm)')
  )


const bcryptPassword = password => promisify(bcryptString, { password })


const isEmailValid = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}


exports.signUp = async (ws, sockets, { promiseId, email, password, inviteToken }) =>
	new Promise(async (resolve, reject) => {

		if(!isEmailValid(email.toLowerCase())) {
			throw {
				code: 'email-not-valid'
			}
		}

		let teams = {}

		if(inviteToken) {
			const inviteObject = await db.findOne({
				collection: 'invites',
				object: {
					token: inviteToken
				}
			})

			if(inviteObject) {
				teams[inviteObject.team] = 'USER'
			}
		}

		if(Object.keys(teams).length === 0) {
			teams[db.getNewId()] = 'ADMIN'
		}

		db.create({
			collection: 'users',
			object: {
				email: email.toLowerCase(),
				password: await bcryptPassword(password),
				emailVerified: false,
				teams
			}
		}).then(user => {
			
			/*sendMail({
				from: 'no-reply@timetracker.one',
				to: email,
				subject: 'Your New Account',
				body: 'Welcome to Timetracker.One, please have fun using it!'
			}).then(() => {
				resolve(true)
			}).catch(err => {
				reject(err)
			})*/


			resolve(true)
		}).catch(err => {
			reject(err.code === 11000
        		? 'duplicate-key'
        		: err
        	)
		})
	})
