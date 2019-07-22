import { writable } from 'svelte/store';

const ACTION_CODE_SETTINGS = {
	url: 'http://'+ (window.location.href.includes('localhost') ? 'localhost:10002' : 'app.timetracker.one') +'/sign-in/validate/',
	handleCodeInApp: true
}

export const authStore = writable({
	seemsToHaveAuth: false,
	inited: false,
	hasAuth: false,
	user: null
})



export function authInit() {
	var timeStart = Date.now()

	console.log(Date.now() - loadedTime)

	const seemsToHaveAuth = localStorage.getItem('seemsToHaveAuth')
	if(seemsToHaveAuth) {
		authStore.update(data => {
			data.seemsToHaveAuth = true
			return data
		})
	}

	firebase.auth().onAuthStateChanged(user => {
		console.log('AUTH STATE CHANGED', Date.now() - timeStart, firebase.auth().currentUser)
		if (user) {
			authStore.set({
				seemsToHaveAuth: true,
				inited: true,
				hasAuth: true,
				user: {
					id: user.uid,
					email: user.email
				}
			})
			localStorage.setItem('seemsToHaveAuth', true)
		} else {
			authStore.set({
				seemsToHaveAuth: false,
				inited: true,
				hasAuth: false,
				user: null
			})

			localStorage.setItem('seemsToHaveAuth', false)
		}
	})
}


export function authAnonymous(cb) {

	firebase.auth().signInAnonymously().then(() => {
		cb(true)
	}).catch(err => {
		cb(false)
	})
}


export function authSendEmail(email, cb) {
	firebase.auth().sendSignInLinkToEmail(email, ACTION_CODE_SETTINGS).then(() => {
		window.localStorage.setItem('emailForSignIn', email)
		cb(true)
	}).catch(err => {
		console.log(err)
		cb(false)
	})
}


export function authValidateLink(cb) {

	if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
	
		var email = window.localStorage.getItem('emailForSignIn')
		if (!email) {
			email = window.prompt('Please provide your email for confirmation');
		}

		firebase.auth().signInWithEmailLink(email, window.location.href).then(res => {
			window.localStorage.removeItem('emailForSignIn')
			cb(true)
		}).catch(err => {
			console.log(err)
			cb(false)
		})
	} else {
		cb(false)
	}
}