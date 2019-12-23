import { writable } from 'svelte/store'
import { sws } from '../helpers/sws-client.js'


export const authStore = writable({
	inited: false,
	hasAuth: false,
	user: null
})



export function authInit() {

	sws.auth.hookIntoAuthState(user => {

		if(user) {
			authStore.set({
				inited: true,
				hasAuth: true,
				user
			})
		} else {
			authStore.set({
				inited: true,
				hasAuth: false,
				user: null
			})
		}

		console.log(Date.now() - loadedTime)
	})
}


export function authSignIn(email, password) {
	return sws.auth.signIn(email, password)
}


export function authSignUp(email, password, code) {
	return sws.auth.signUp(email, password, code)
}

export function authSignOut() {
	sws.auth.signOut()
}


export function authStoreNewPassword(email) {
	return sws.auth.sendPasswordMail(email)
}


export function authStoreVerifyPasswordCode(oobCode, cb) {
	sws.auth.verifyPasswordCode(oobCode).then(res => {
		cb(null)
	}).catch(err => {
		cb(err)
	})
}


export function authStoreConfirmPasswordReset(oobCode, password, cb) {
	sws.auth.resetPassword(oobCode, password).then(res => {
		cb(null)
	}).catch(err => {
		cb(err)
	})	
}