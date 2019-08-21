const functions = require('firebase-functions')
const admin = require('firebase-admin')


exports.newUserTrigger = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
	newUser(snap._ref, snap._ref._path.segments[1], snap.data().team, snap.data().invitation)
	return
})


const newUser = async (userRef, user, team, invitation) => {
	if(!invitation) {

		try {
			const userRecord = await admin.auth().getUser(user),
				isAdmin = userRecord.customClaims.admin && Object.keys(userRecord.customClaims.admin).length > 0,
				isMember = userRecord.customClaims.member && Object.keys(userRecord.customClaims.member).length > 0
		

			if(!isAdmin && !isMember) {



				// SET TEAM DATA
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



				// SET CUSTOM CLAIMS
				let claims = {
					admin: {}
				}
				claims.admin[ref.id] = true

				await admin.auth().setCustomUserClaims(user, claims)
		


				// UPDATE USER DOC
				await userRef.update({
					firstTeam: ref.id
				})

				console.log('EVERYTHING DONE?')

			} else {
				console.log('HUBBA')
			}
		} catch(err) {
			console.log('ERR', err)
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