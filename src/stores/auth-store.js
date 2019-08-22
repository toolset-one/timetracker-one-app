import { writable } from 'svelte/store';

const ACTION_CODE_SETTINGS = {
	url: 'http://'+ (window.location.href.includes('localhost') ? 'localhost:10002' : 'app.timetracker.one') +'/sign-in/validate/',
	handleCodeInApp: true
}

export const authStore = writable({
	seemsToHaveAuth: false,
	inited: false,
	hasAuth: false,
	hasTeam: false,
	user: null
})



export function authInit() {

	// Looks wether this user was already signed in or not
	const seemsToHaveAuth = localStorage.getItem('seemsToHaveAuth')
	if(seemsToHaveAuth) {
		authStore.update(data => {
			data.seemsToHaveAuth = true
			return data
		})
	}

	firebase.auth().onAuthStateChanged(async user => {
		if (user) {

			authStore.update(data => {
				data.seemsToHaveAuth = true
				data.inited = true
				data.hasAuth = true

				if(!data.user) {
					data.user = {}
				}

				data.user.id = user.uid
				data.user.email = user.email
				data.user.name = user.displayName
				return data
			})

			await authStoreControlUserToken()

		} else {

			authStore.set({
				seemsToHaveAuth: false,
				inited: true,
				hasAuth: false,
				hasTeam: false,
				user: null
			})

			localStorage.setItem('seemsToHaveAuth', false)
		}
	})
}


export async function authStoreControlUserToken() {

	await firebase.auth().currentUser.getIdToken(true)
		
	const idToken = await firebase.auth().currentUser.getIdTokenResult(),
		isAdmin = idToken.claims.admin && Object.keys(idToken.claims.admin).length > 0,
		isMember = idToken.claims.member && Object.keys(idToken.claims.member).length > 0,
		hasTeam = isAdmin || isMember

	authStore.update(data => {
		data.hasTeam = hasTeam
		data.user.admin = idToken.claims.admin
		data.user.member = idToken.claims.member
		return data
	})

	localStorage.setItem('seemsToHaveAuth', hasTeam)
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

export function authSignOut() {
	firebase.auth().signOut()
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