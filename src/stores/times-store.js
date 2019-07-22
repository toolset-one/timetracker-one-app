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

						const textData = Object.assign({ 
							id: change.doc.id 
						}, change.doc.data())

						timesStore.update(data => {
							data.json[textData.id] = textData
							data.array = (Object.keys(data.json).map(el => data.json[el]))
							return data
						})
					} else if (change.type === 'removed') {
						timesStore.update(data => {
							delete data.json[change.doc.data().slug]
							data.array = (Object.keys(data.json).map(el => data.json[el]))
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


export function timesStoreChangeTime(id, text) {
	firebase.db.collection('times').doc(id).update({
		text,
		excerpt: getExcerpt(text),
		updated: new Date()
	})
}


function getExcerpt(text) {

	if(text.length > 100) {

		if(text.split('\n')[0].length <= 100) {
			return	text.split('\n')[0]
		}

		const trimmedTime = text.substr(0, 100),
			wordTrimmedTime = trimmedTime.substr(0, Math.min(trimmedTime.length, trimmedTime.lastIndexOf(' ')))
			return wordTrimmedTime +'…'
	}

	return text
}
