const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./timetracker-one-app-firebase-adminsdk.json')

const { newUserTrigger } = require('./user.new.js')

try {
	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: 'https://timetracker-one-app.firebaseio.com'
	})
} catch(err) {
	admin.initializeApp()
}

exports.newUserTrigger = newUserTrigger