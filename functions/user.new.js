const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.newUser = async (queueId, user, team) => {
	if(!team) {

		const userRecord = await admin.auth().getUser(user)

		const isAdmin = userRecord.customClaims.admin && Object.keys(userRecord.customClaims.admin).length > 0,
			isMember = userRecord.customClaims.member && Object.keys(userRecord.customClaims.member).length > 0
	
		if(!isAdmin && !isMember) {

			const teamData = {
				title: '',
				admins: [ user ],
				members: [],
				memberData: {},
				created: new Date(),
				updated: new Date()
			}

			const ref = admin.firestore().collection('teams').doc()

			await ref.set(teamData)

			let claims = {
				admin: {}
			}
			claims.admin[ref.id] = true

			await admin.auth().setCustomUserClaims(user, claims)
	
			await admin.firestore().collection('users').doc(user).set({
				firstTeam: ref.id,
				language: 'EN',
				termsAccepted: 0,
				stopwatchEntryId: null,
				stopwatchStartTime: 0,
			})

			await admin.firestore().collection('queue').doc(queueId).update({
				done: true
			})

		} else {
			console.log('HUBBA')
		}
	}
}

exports.setClaims = functions.https.onRequest((req, res) => {
	admin.auth().setCustomUserClaims('SsmjhJiN6pbT4InSCuZwiFYMMrW2', {
		admin: {
			'T5AbK1DyC9krl7t1LWWO': true
		}
	}).then(() => {
		console.log('SUCCESS SET CLAIMS')
		return
	}).catch(err => {
		console.log(err)
	})
	res.end('OK')
})


exports.unsetClaims = functions.https.onRequest((req, res) => {
	admin.auth().setCustomUserClaims('SsmjhJiN6pbT4InSCuZwiFYMMrW2', {
		admin: {
			
		}
	}).then(() => {
		console.log('SUCCESS UNSET CLAIMS')
		return
	}).catch(err => {
		console.log(err)
	})
	res.end('OK')
})