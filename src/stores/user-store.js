import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { timesStoreChangeDuration } from '../stores/times-store.js'
import { sws } from '../helpers/sws-client.js'

export const userStore = writable({
	language: 'EN',
	stopwatchEntryId: null,
	stopwatchStartTime: 0,
})

export const userStopwatchStore = writable(0)

let listenerUserId,
	listener,
	interval,
	userStoreInited = false

export function userStoreInit() {
	setListener()
}

function setListener() {
	authStore.subscribe(authData => {
		if(authData.hasAuth) {
			console.log('USER ID', authData.user.id)

			sws.db.get({
				col: 'settings',
				id: authData.user.id
			}).then(res => {
				userStore.update(data => {
					return res ? res : data
				})
			})

			sws.db.hook({
				hook: 'settings',
				col: 'settings',
				query: {
					id: authData.user.id
				},
				fn: obj => {
					userStore.update(data => {
						return obj ? obj : data
					})
				}
			})
		}
	})
}

// TODO: Let's do everythin async
// TODO: Invitation
export function updateUser(cb) {
	const authData = get(authStore)

	if(authData.hasAuth) {

		const userData = get(userStore)

		sws.db.new({
			col: 'settings',
			id: authData.user.id,
			data: userData
		}).then(res => {
			if(cb) {
				cb(true)
			}
		}).catch(err => {
			if(cb) {
				cb(false)
			}
		})
	}
}


export function userSetStopwatch(id, startTime) {

	userStore.update(data => {
		if(data.stopwatchEntryId) {
			timesStoreChangeDuration(data.stopwatchEntryId, (Math.floor((Date.now()  - data.stopwatchStartTime) / 1000)))
		}
		
		if(data.stopwatchEntryId != id || !data.stopwatchEntryId) {
			data.stopwatchEntryId = id
			data.stopwatchStartTime = startTime
		} else {
			data.stopwatchEntryId = null
			data.stopwatchStartTime = 0
		}


		return data
	})

	updateUser()
}


export function userStoreSetUsername(username, cb) {
	userStore.update(data => {
		data.username = username
		return data
	})

	updateUser(cb)
}


userStore.subscribe(userStoreData => {
	if(userStoreData.stopwatchEntryId) {
		interval = setInterval(() => {
			userStopwatchStore.update(data =>
				Math.floor((Date.now() - userStoreData.stopwatchStartTime) / 1000)
			)
		}, 1000)
		
		userStopwatchStore.update(data =>
			Math.floor((Date.now() - userStoreData.stopwatchStartTime) / 1000)
		)
	} else {
		clearInterval(interval)
			userStopwatchStore.update(data => 0)
	}
})
