const { db } = require('../../libs/db.js'),
	{ teamSyncOut } = require('../../libs/auth/team-sync.js')


const getNewId = () => {
	var timestamp = (new Date().getTime() / 1000 | 0).toString(16)
	return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
		return (Math.random() * 16 | 0).toString(16)
	}).toLowerCase()
}

exports.inviteMember = async (ws, sockets, { teamId, email, name }) =>
	new Promise(async (resolve, reject) => {
		console.log('INVITE', teamId, email, name)

		email = email.toLowerCase()

		if(!ws.userData.teams[teamId] || ws.userData.teams[teamId] != 'ADMIN') {
			reject({
				code: 'no-rights-for-team'
			})
			return
		}

		const team = await db.get({
			collection: 'teams',
			id: teamId
		}).catch(err => {
			reject({
				code: 'db-error'
			})
		})

		if(!team) {
			reject({
				code: 'team-not-found'
			})
			return
		}

		if(team.invitations.includes(email)) {
			reject({
				code: 'already-invited'
			})
			return
		}

		// TODO MAIL

		team.invitations.push({
			email,
			name,
			code: getNewId()
		})

		const success = await db.update({
			collection: 'teams',
			id: teamId,
			obj: team
		}).catch(err => {
			reject({
				code: 'update-failed'
			})
		})

		teamSyncOut(ws, teamId)
		resolve(true)
	})