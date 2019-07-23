import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'

export const timesStore = writable({
	json: {},
	array: []
})

let listener,
	textId


export function timesStoreInit() {
	setListener()

}

function setListener() {
	authStore.subscribe(authData => {
		if(listener) {
			listener()
		}

		if(authData.hasAuth) {
			listener = firebase.db.collection('times').where('user', '==', authData.user.id).onSnapshot(snapshot =>
				snapshot.docChanges().forEach(change => {
								
					if (change.type === 'added' || change.type === 'modified') {

						const entryData = Object.assign({ 
							id: change.doc.id 
						}, change.doc.data())

						timesStore.update(data => {
							data.json[entryData.id] = entryData
							data.array = (Object.keys(data.json).map(el => data.json[el])).sort((a, b) => b.created.seconds - a.created.seconds)
							return data
						})
					} else if (change.type === 'removed') {
						timesStore.update(data => {
							delete data.json[change.doc.id]
							data.array = (Object.keys(data.json).map(el => data.json[el])).sort((a, b) => b.created.seconds - a.created.seconds)
							return data
						})
					}
				})
			)
		}
	})
}


export function timesStoreNewTime(day, cb) {

	const unsubscribe = authStore.subscribe(authData => {
		firebase.db.collection('times').doc().set({
			user: authData.user.id,
			day: day,
			duration: 0,
			project: null,
			comment: '',
			updated: new Date(),
			created: new Date()
		}).then(() => {
			console.log('document created');
			cb(true)
		}).catch(err => {
			console.error('error: ', err);
			cb(false)
		})
	})
	unsubscribe()
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
		data.json[id].comment = comment
		data.array = (Object.keys(data.json).map(el => data.json[el])).sort((a, b) => b.created.seconds - a.created.seconds)
		return data
	})
}


export function timesStoreChangeDuration(id, duration) {
	firebase.db.collection('times').doc(id).update({
		duration,
		updated: new Date()
	})	

	timesStore.update(data => {
		data.json[id].duration = duration
		data.array = (Object.keys(data.json).map(el => data.json[el])).sort((a, b) => b.created.seconds - a.created.seconds)
		return data
	})
}


export function timesStoreDeleteEntry(id) {
	firebase.db.collection('times').doc(id).delete()
}