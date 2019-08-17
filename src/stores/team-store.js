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

	const teamActive = localStorage.getItem('teamActive')
	if(teamActive) {

		teamStore.update(data => {
			data.active = JSON.parse(teamActive)
			return data
		})
	}

	setListener()
}

function setListener() {
	authStore.subscribe(authData => {
		if(listener) {
			listener()
		}

		if(authData.hasAuth) {
			const ref = firebase.db.collection('teams').where('admins', 'array-contains', authData.user.id)

			ref.get().then(snapshot => {
				if (snapshot.empty) {
					teamStoreNewTeam((err, teamData) => {
						teamStore.update(data => {
							data.teams = [teamData]
							data.active = teamData
							localStorage.setItem('teamActive', JSON.stringify(teamData))
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
						localStorage.setItem('teamActive', JSON.stringify(teamData))
					})
					return data
				})
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
			admins: [ auth.user.id ],
			members: [],
			memberData: {},
			created: new Date(),
			updated: new Date()
		}

		teamData.memberData[auth.user.id] = {
			email: auth.user.email,
			name: auth.user.name,
			picture: null
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


export function teamStoreChangeTitle(id, title) {
	firebase.db.collection('teams').doc(id).update({
		title,
		updated: new Date()
	})	

	teamStore.update(data => {
		data.active.title = title

		data.teams = data.teams.map(val => {
			val.title = val.id === id ? title : val.title
			return val
		})

		return data
	})
}

