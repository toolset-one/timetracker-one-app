import { writable } from 'svelte/store';
import Page from 'page'



export const routerStore = writable({
  view: 'index',
  subview: null
})


Page({
	hashbang: true
})

Page('/', data => 
	routerStore.set({
		view: 'index',
		subview: null
	})
)

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


Page()