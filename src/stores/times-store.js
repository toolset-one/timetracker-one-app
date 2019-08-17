import { writable, get } from 'svelte/store'
import { authStore } from '../stores/auth-store.js'
import { teamStore } from '../stores/team-store.js'

export const timesStore = writable({
	times: {},
	dayIndex: {}
})

// data.array = (Object.keys(data.times).map(el => data.times[el])).sort((a, b) => b.created.seconds - a.created.seconds)

let listener,
	userId = null,
	monthListener = {}


export function timesStoreInit() {
	authStore.subscribe(authData => {
		if(authData.hasAuth) {
			userId = authData.user.id
		} else {
			userId = null
		}

		Object.keys(monthListener).forEach(monthId => {
			setListener(userId, monthId)
		})
	})
}

function setListener(userId, monthId) {

	if(monthListener[monthId] && monthListener[monthId].listener) {
		monthListener[monthId].listener()
	}

	const { active } = get(teamStore)

	if(active && userId) {
		monthListener[monthId].listener = firebase.db.collection('times').where('team', '==', active.id).onSnapshot(snapshot =>
			snapshot.docChanges().forEach(change => {
									
				if (change.type === 'added' || change.type === 'modified') {

					const entryData = Object.assign({ 
						id: change.doc.id 
					}, change.doc.data())

					timesStore.update(data => {
						data.times[entryData.id] = entryData
						if(!data.dayIndex[entryData.day]) {
							data.dayIndex[entryData.day] = {}
						}

						data.dayIndex[entryData.day][entryData.id] = true
						return data
					})
				} else if (change.type === 'removed') {
					timesStore.update(data => {
						delete data.times[change.doc.id]
						delete data.dayIndex[change.doc.data().day][change.doc.id]
						return data
					})
				}
			})
		)
	}
}


export function timesStoreControlDate(databaseDate) {
	const monthId = Math.floor(databaseDate / 100) * 100
	if( !monthListener[monthId] ) {
		monthListener[monthId] = {}
		setListener(userId, monthId)
	}
	return true
}


export function timesStoreNewTime(day, cb) {

	const { user } = get(authStore),
		{ active } = get(teamStore)

	firebase.db.collection('times').doc().set({
		user: user.id,
		team: active.id,
		day: day,
		duration: 0,
		task: null,
		comment: '',
		updated: new Date(),
		created: new Date()
	}).then(() => {
		cb(true)
	}).catch(err => {
		cb(false)
	})
}


export function timesStoreGetEntry(id, cb) {
	firebase.db.collection('times').doc(id).get().then(doc => cb(doc.data())).catch(err =>
		console.log(err)
	)
}


export function timesStoreChangeComment(id, comment) {
	firebase.db.collection('times').doc(id).update({
		comment,
		updated: new Date()
	})	

	timesStore.update(data => {
		data.times[id].comment = comment
		return data
	})
}


export function timesStoreChangeDuration(id, duration) {
	firebase.db.collection('times').doc(id).update({
		duration,
		updated: new Date()
	})	

	timesStore.update(data => {
		data.times[id].duration = duration
		return data
	})
}


export function timesStoreChangeTask(id, task) {
	firebase.db.collection('times').doc(id).update({
		task,
		updated: new Date()
	})	

	timesStore.update(data => {
		data.times[id].task = task
		return data
	})
}


export function timesStoreDeleteEntry(id) {
	firebase.db.collection('times').doc(id).delete()
}