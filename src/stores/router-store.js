import { writable } from 'svelte/store'
import Page from 'page'
import { dateToDatestring } from '../helpers/helpers.js'



export const routerStore = writable({
  view: 'index',
  subview: null
})


Page({
	hashbang: true
})

Page('/', () => Page('/timelog/' + dateToDatestring(new Date()) + '/'))

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