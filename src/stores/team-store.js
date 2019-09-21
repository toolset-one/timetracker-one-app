import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { sws } from '../helpers/sws-client.js'

export const teamStore = writable({
	teams: {},
	activeId: null,
	active: null,
	invitations: {}
})

let listenerMember,
	listenerAdmin,
	listener = {},
	invitationListener,
	interval

export function teamStoreInit() {
	setListener()
}

export function teamGetActiveId() {
	const authData = get(authStore)
	return authData.hasAuth ? Object.keys(authData.user.teams)[0] : null
}


function setListener() {

	authStore.subscribe(authData => {

		if(authData.hasAuth) {

			teamStore.update(data => {
				data.activeId = Object.keys(authData.user.teams)[0]
				return data
			})
		
			Object.keys(authData.user.teams).forEach(teamId => {
				sws.db.get({
					col: 'teams',
					id: teamId
				}).then(res => {
					teamStore.update(data => {
						data.teams[teamId] = res
						return data
					})
				})

				sws.db.hook({
					hook: 'teams-'+ teamId,
					col: 'teams',
					query: {
						id: teamId
					},
					fn: obj => {
						teamStore.update(data => {
							data.teams[teamId] = obj
							return data
						})
					}
				})
			})
		}
	})
}

export function teamStoreChangeTitle(id, title) {
	// TODO
}


function setInvitationListener() {
	// TODO
}


export function teamStoreInvite(email, name, cb) {
	// TODO
	console.log('INVITE', email, name, cb)
}
