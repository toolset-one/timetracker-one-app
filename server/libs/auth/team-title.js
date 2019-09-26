const { db } = require('../../libs/db.js'),
	{ teamSyncOut } = require('../../libs/auth/team-sync.js')


exports.setTeamTitle = async (ws, sockets, { id, title }) =>
	new Promise(async (resolve, reject) => {
		console.log('TEAM NEW TITLE', ws.userData.teams[id], id, title)

		if(!ws.userData.teams[id] || ws.userData.teams[id] != 'ADMIN') {
			reject({
				code: 'no-rights-for-team'
			})
			return
		}

		const team = await db.get({
			collection: 'teams',
			id
		}).catch(err => {
			reject({
				code: 'db-error'
			})
		})


		if(!team) {
			let newTeam = {
				id,
				title,
				users: [{
					id: ws.userData.id,
					title: '',
					role: 'ADMIN'
				}],
				invitations: []
			}

			const newTeamSuccess = await db.create({
				collection: 'teams',
				id,
				object: newTeam
			}).catch(err => reject({
				code: 'db-error'
			}))

			teamSyncOut(ws, id)
			resolve(true)
		}
	})