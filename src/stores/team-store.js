import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'

export const teamStore = writable({
	teams: [],
	active: null,
	invitations: {}
})

let listener,
	invitationListener,
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
			console.log(authData)
			const ref = firebase.db.collection('teams').where('admins', 'array-contains', authData.user.id)

			ref.get().then(snapshot => {
				if (snapshot.empty) {


					const { key, email } = get(routerStore)
					console.log('YA', key, email)

					const ref = firebase.db.collection('invitations').doc(key).get().then(snapshot => {
						console.log('YU', snapshot.data().team)

						firebase.db.collection('teams').doc(snapshot.data().team).update({
							members: firebase.firestore.FieldValue.arrayUnion(authData.user.id),
							invitation: key
						})


					}) // resource.data.members.hasAny([request.auth.uid])
					// request.resource.data.arrayField.hasAll(resource.data.arrayField)

					/*teamStoreNewTeam((err, teamData) => {
						teamStore.update(data => {
							data.teams = [teamData]
							data.active = teamData
							localStorage.setItem('teamActive', JSON.stringify(teamData))
							return data
						})
					})
					setInvitationListener()*/
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
				setInvitationListener()
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
