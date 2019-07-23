import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'

export const reportsStore = writable({
	startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1, 0, 0, 0),
	firstDate: (() => {
		let dateTmp = new Date(new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1, 0, 0, 0))
		dateTmp.setYear(dateTmp.getFullYear() - 5)
		return dateTmp
	})()
})


export function reportsStoreInit() {
	

}
