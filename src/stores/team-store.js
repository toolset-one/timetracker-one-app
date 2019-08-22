import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'

export const teamStore = writable({
	teams: [],
	active: null,
	invitations: {}
})

let listenerMember,
	listenerAdmin,
	listener = {},
	invitationListener,
	interval

export function teamStoreInit() {

	// Get team faster = set entry listener faster
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

		if((authData.user && JSON.stringify(authData.user.member) != listenerMember ) || (authData.user && JSON.stringify(authData.user.admin) != listenerAdmin)) {
			listenerMember = JSON.stringify(authData.user.member)
			listenerAdmin = JSON.stringify(authData.user.admin)
		

			Object.keys(listener).forEach(key => {
				listener[key]()
				delete listener[key]
			})

			if(authData.hasAuth) {

				// TODO: Also with member
				if(authData.user.admin) {

					Object.keys(authData.user.admin).forEach(teamId => {
						const ref = firebase.db.collection('teams').doc(teamId).onSnapshot(snapshot => {

							teamStore.update(data => {

								data.teams.filter(val => val.id != snapshot.id)

								const teamData = Object.assign({ 
									id: snapshot.id 
								}, snapshot.data())
								data.teams.push(teamData)

								data.active = teamData
								localStorage.setItem('teamActive', JSON.stringify(teamData))
								return data
							})

						})
					})
				}

			}
		}
	})
}


function setInvitationListener() {
	if(invitationListener) {
		invitationListener()
		teamStore.update(data => {
			data.invitations = {}
			return data
		})
	}

	const { active } = get(teamStore)

	listener = firebase.db.collection('invitations').where('team', '==', active.id).onSnapshot(snapshot =>
		snapshot.docChanges().forEach(change => {

			if (change.type === 'added' || change.type === 'modified') {

				const invitationData = Object.assign({ 
					id: change.doc.id 
				}, change.doc.data())

				teamStore.update(data => {
					data.invitations[change.doc.id] = invitationData
					return data
				})
			} else if (change.type === 'removed') {
				teamStore.update(data => {
					delete data.invitations[change.doc.id]
					return data
				})
			}
		})
	)
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


export function teamStoreInvite(email, name, cb) {

	const { active } = get(teamStore)

	const ref = firebase.db.collection('invitations').doc().set({
		team: active.id,
		email,
		name
	}).then(() => {
		cb(null)
	}).catch(err => {
		console.error('error: ', err);
		cb(err)
	})
}
