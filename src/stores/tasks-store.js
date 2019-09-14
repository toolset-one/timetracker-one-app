import { writable, get } from 'svelte/store'
import { authStore } from '../stores/auth-store.js'
import { teamStore, teamGetActiveId } from '../stores/team-store.js'
import { COLORS } from '../helpers/helpers.js'
import { sws } from '../helpers/sws-client.js'

export const tasksStore = writable({
	json: {},
	array: []
})

let listener


export function tasksStoreInit() {
	setListener()

}

function setListener(dbDate) {

	sws.db.query({
		col: 'tasks',
		query: {
			team: teamGetActiveId()
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
			team: teamGetActiveId()
		},
		fn: obj => {
			console.log('OBJ', obj)
			tasksStore.update(data => {
				data.json[obj.id] = obj
				data.array = Object.values(data.json)
				return data
			})
		}
	})
}


export function tasksStoreNewTask(cb) {


	const { user } = get(authStore)

	sws.db.new({
		col: 'tasks',
		data: {
			user: user.id,
			team: teamGetActiveId(),
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