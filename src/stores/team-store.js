import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { timesStoreChangeDuration } from '../stores/times-store.js'

export const teamStore = writable({
	teams: [],
	active: null
})

let listener,
	interval

export function teamStoreInit() {
	setListener()
}

function setListener() {
	authStore.subscribe(authData => {
		if(listener) {
			listener()
		}

		if(authData.hasAuth) {
			const ref = firebase.db.collection('teams').where('members', 'array-contains', authData.user.id)

			ref.get().then(snapshot => {
				if (snapshot.empty) {
					teamStoreNewTeam((err, team) => {
						teamStore.update(data => {
							data.teams = [team]
							data.active = team
							return data
						})
					})
					return
				}	


				teamStore.update(data => {
					
					snapshot.forEach(doc => {
						const teamData = Object.assign({ 
							id: doc.id 
						}, doc.data())
						data.teams.push(teamData)
						data.active = teamData
					})
					return data
				})
			})
			.catch(err => {
				console.log('Error getting documents', err)
			})



			/*listener = ref.onSnapshot(snapshot => {
		
				if(snapshot.data()) {
					let userStoreUnsubscribe = userStore.subscribe(userData => {
						if(JSON.stringify(snapshot.data()) != JSON.stringify(userData)) {
							userStore.update(data => snapshot.data())
						}
					})
					userStoreUnsubscribe()
				} else {
					updateUser()
				}
			})*/
		}
	})
}


export function teamStoreNewTeam(cb) {

	const auth = get(authStore)
	if(auth.user) {

		let teamData = {
			title: '',
			members: [ auth.user.id ],
			memberData: {},
			created: new Date(),
			updated: new Date()
		}

		teamData.memberData[auth.user.id] = {
			role: 'ADMIN',
			email: auth.user.email,
			name: auth.user.name
		}

		const ref = firebase.db.collection('teams').doc()
		ref.set(teamData).then(() => {
			teamData.id = ref.id
			cb(null, teamData)
		}).catch(err => {
			console.error('error: ', err);
			cb(err, null)
		})
	}
}

