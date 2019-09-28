import { writable, get } from 'svelte/store'
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { teamStore } from '../stores/team-store.js'
import { sws } from '../helpers/sws-client.js'
import { dateToDatabaseDate, dateStringToDate } from '../helpers/helpers.js'

export const timesStore = writable({
	times: [],
	dayIndex: {}
})


let listener,
	monthListener = {},
	teamId = null


export function timesStoreInit() {
	routerStore.subscribe(routerData => {
		try {
			let dbDate = dateToDatabaseDate(dateStringToDate(routerData.subview))
			if(dbDate) {
				setListener(dbDate, teamId)
			}
		} catch(err) {}
	})

	teamStore.subscribe(teamData => {
		const routerData = get(routerStore)
		try {
			let dbDate = dateToDatabaseDate(dateStringToDate(routerData.subview))
			if(dbDate && teamData.active && teamData.active.id != teamId) {
				teamId = teamData.active.id
				setListener(dbDate, teamId)
			}
		} catch(err) {}		
	})
}


function setListener(dbDate, teamId) {

	const authData = get(authStore)

	if(teamId) {

		sws.db.query({
			col: 'times',
			query: {
				day: dbDate,
				team: teamId
			}
		}).then(res => {
			timesStore.update(data => {
				data.times = res
				return data
			})
		})

		sws.db.hook({
			hook: 'times',
			col: 'times',
			query: {
				day: dbDate,
				team: teamId
			},
			fn: obj => {
				timesStore.update(data => {

					if(obj.__deleted) {
						data.times = data.times.filter(val => val.id != obj.id)
					} else {
						let found = false
						data.times = data.times.map(val => {
							if(val.id === obj.id) {
								found = true
								return obj
							} 
							return val
						})

						if(!found) {
							data.times.push(obj)
						}
					}

					return data
				})
			}
		})
	}
}


export function timesStoreNewTime(day, cb) {

	const { user } = get(authStore)

	sws.db.new({
		col: 'times',
		data: {
			user: user.id,
			team: teamId,
			day: day,
		}
	}).then(() => {
		cb(true)
	}).catch(err => {
		cb(false)
	})
}


export function timesStoreGetEntry(id, cb) {
	sws.db.get({
		col: 'times',
		id
	}).then(obj => {
		cb(obj)
	}).catch(err => {
		cb(null)
	})
}


export function timesStoreChangeComment(id, comment) {
	sws.db.update({
		col: 'times',
		id,
		data: {
			comment
		}
	})
}


export function timesStoreChangeDuration(id, duration) {
	sws.db.update({
		col: 'times',
		id,
		data: {
			duration
		}
	})
}


export function timesStoreChangeTask(id, task) {
	sws.db.update({
		col: 'times',
		id,
		data: {
			task
		}
	})
}


export function timesStoreDeleteEntry(id) {
	sws.db.delete({
		col: 'times',
		id
	})
}