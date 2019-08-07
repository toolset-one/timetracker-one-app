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


export function authSignIn(email, password, cb) {
	firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
		cb(true)
	}).catch(err => {
		cb(false, err.code)
	})
}


export function authSignUp(email, password, cb) {
	firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
		cb(true)
	}).catch(err => {
		cb(false, err.code)
	})
}


export function authStoreNewPassword(email, cb) {

	const actionCodeSettings = {
		url: 'https://app.timetracker.one/new-password-verification/?email=' + email,
		handleCodeInApp: true
	}

	firebase.auth().sendPasswordResetEmail(email).then(() => {
		cb(true)
	}).catch(function(error) {
		cb(false)
	})
}


export function authStoreVerifyPasswordCode(oobCode, cb) {
	firebase.auth().verifyPasswordResetCode(oobCode).then(res => {
		cb(null)
	}).catch(err => {
		cb(err)
	})
}


export function authStoreConfirmPasswordReset(oobCode, password, cb) {
	firebase.auth().confirmPasswordReset(oobCode, password).then(res => {
		console.log('RES', res)
		cb(null)
	}).catch(err => {
		cb(err)
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