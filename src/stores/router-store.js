import { writable, get } from 'svelte/store'
import Page from 'page'
import { dateToDatestring } from '../helpers/helpers.js'
import { authStore } from '../stores/auth-store.js'



export const routerStore = writable({
  view: 'index',
  subview: null
})

authStore.subscribe(authData => {
	if(authData.inited) {
		if(get(routerStore).view === 'index') {
			if(authData.hasAuth) {
				Page('/timelog/' + dateToDatestring(new Date()) + '/')
			} else {
				Page('/sign-in/')
			}
		}
	}
})


Page({
	hashbang: true
})

Page('/', () => {
	const authData = get(authStore)
	if(authData.hasAuth) {
		Page('/timelog/' + dateToDatestring(new Date()) + '/')
	} else {
		Page('/sign-in/')
	}
})

Page('/timelog/', () => Page('/timelog/' + dateToDatestring(new Date()) + '/'))

Page('/:view/', data => 
	routerStore.set({
		view: data.params.view,
		subview: null
	})
)

Page('/:view/:subview/', data => 
	routerStore.set({
		view: data.params.view,
		subview: data.params.subview
	})
)

Page('/sign-up/:key/:email/', data => {
	routerStore.set({
		view: 'sign-up',
		key: data.params.key,
		email: data.params.email
	})
})


Page()