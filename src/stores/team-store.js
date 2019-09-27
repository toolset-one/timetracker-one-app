import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { sws } from '../helpers/sws-client.js'

export const teamStore = writable({
	teams: {},
	active: null
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
	sws.auth.hookIntoTeamState(teams => {
		teams = teams ? teams : {}
		teamStore.update(data => {
			data.teams = teams
			data.active = Object.values(teams)[0]
			return data
		})
	})
}

export function teamStoreChangeTitle(id, title) {
	sws.auth.setTeamTitle({
		id,
		title
	})
}


function setInvitationListener() {
	// TODO
}


export function teamStoreInvite(email, name) {
	const teamData = get(teamStore)

	sws.auth.inviteMember({
		teamId: teamData.active.id,
		email,
		name
	})
}
