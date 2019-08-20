const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./timetracker-one-app-firebase-adminsdk.json')

const { newUser, setClaims, unsetClaims } = require('./user.new.js')

try {
	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: 'https://timetracker-one-app.firebaseio.com'
	})
} catch(err) {
	admin.initializeApp()
}

exports.setClaims = setClaims
exports.unsetClaims = unsetClaims


exports.queue = functions.firestore.document('queue/{queueId}').onWrite((change, context) => {
	queue(change.after.data())
})


const queue = (queueId, data) => {
	switch(data.action) {
		case 'newUser':
			newUser(queueId, data.user, data.team)
		break;
	}
}


exports.test = functions.https.onRequest((req, res) => {
	newUser('something', 'SsmjhJiN6pbT4InSCuZwiFYMMrW2')
})