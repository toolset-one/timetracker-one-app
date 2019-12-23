import { writable, get } from 'svelte/store'
import { authStore } from '../stores/auth-store.js'
import { teamStore } from '../stores/team-store.js'
import { COLORS } from '../helpers/helpers.js'
import { sws } from '../helpers/sws-client.js'

export const tasksStore = writable({
	json: {},
	array: []
})

let listener,
teamId


export function tasksStoreInit() {
	teamStore.subscribe(teamData => {
		if(teamData.active && teamData.active.id != teamId) {
			teamId = teamData.active.id
			setListener(teamId)
		}
	})
}

function setListener(teamId) {

	sws.db.query({
		col: 'tasks',
		query: {
			team: teamId
		}
	}).then(res => {
		tasksStore.update(data => {
			data.json = {}
			data.array = res
			res.forEach(val => {
				data.json[val.id] = val
			})
			return data
		})
	})

	sws.db.hook({
		hook: 'tasks',
		col: 'tasks',
		query: {
			team: teamId
		},
		fn: obj => {
			tasksStore.update(data => {
				data.json[obj.id] = obj
				data.array = Object.values(data.json)
				return data
			})
		}
	})
}


export function tasksStoreNewTask(cb) {


	const { user } = get(authStore),
		teamData = get(teamStore)

	sws.db.new({
		col: 'tasks',
		data: {
			user: user.id,
			team: teamData.active.id,
			color: COLORS[Math.floor(Math.random() * COLORS.length)]
		}
	}).then(() => {
		cb(true)
	}).catch(err => {
		cb(false)
	})
}


export function tasksStoreChangeTitle(id, title) {
	sws.db.update({
		col: 'tasks',
		id,
		data: {
			title
		}
	})
}


export function tasksStoreChangeColor(id, color) {
	sws.db.update({
		col: 'tasks',
		id,
		data: {
			color
		}
	})
}


export function tasksStoreDeleteEntry(id) {
	sws.db.delete({
		col: 'tasks',
		id
	})
}