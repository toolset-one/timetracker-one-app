import { writable, get } from 'svelte/store';
import { i18n } from '../stores/i18n-store.js'
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { sws } from '../helpers/sws-client.js'

export const teamStore = writable({
	teams: {},
	active: null,
	members: {}
})

let teamId,
	listenerMember,
	listenerAdmin,
	listener = {},
	invitationListener,
	interval

export function teamStoreInit() {
	setListener()

	teamStore.subscribe(teamData => {
		if(teamData.active && teamData.active.id != teamId) {
			teamId = teamData.active.id
			setMembersListener(teamId)
		}
	})
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

function setMembersListener(teamId) {
	sws.db.query({
		col: 'members',
		query: {
			team: teamId
		}
	}).then(res => {
		teamStore.update(data => {
			data.members = {}
			res.forEach(val => {
				data.members[val.id] = val
			})
			return data
		})
	})

	sws.db.hook({
		hook: 'members',
		col: 'members',
		query: {
			team: teamId
		},
		fn: obj => {
			teamStore.update(data => {
				data.members[obj.id] = obj
				return data
			})
		}
	})
}


export function teamStoreGetUsername() {
	const { members } = get(teamStore),
		authData = get(authStore),
		i18nObj = get(i18n)

	if(!authData.hasAuth) {
		return ''
	} 

	if(members[authData.user.id]) {
		return members[authData.user.id].name.length > 0 ? members[authData.user.id].name : i18nObj.NO_NAME
	} else {
		return i18nObj.NO_NAME
	}
}


export function teamStoreSetUsername(name) {
	
	const teamData = get(teamStore),
		authData = get(authStore)

	if(authData.hasAuth) {
		if(teamData.members[authData.user.id]) {
			return sws.db.update({
				col: 'members',
				id: authData.user.id,
				data: {
					name
				}
			})
		} else {
			return sws.db.new({
				col: 'members',
				id: authData.user.id,
				data: {
					name,
					user: authData.user.id,
					team: teamData.active.id
				}
			})
		}
	}
}


export function teamStoreChangeTitle(id, title) {
	sws.auth.setTeamTitle({
		id,
		title
	})
}


export function teamStoreInvite(email, name) {
	const teamData = get(teamStore)

	sws.auth.inviteMember({
		teamId: teamData.active.id,
		email,
		name
	})
}
