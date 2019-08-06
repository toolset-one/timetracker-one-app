import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { authStore } from '../stores/auth-store.js'
import { dateNextDate } from '../helpers/helpers.js'
export const reportsStore = writable({
	date: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	dates: {},
	period: 7
})


export function reportsStoreInit() {
	reportsStoreUpdateDate(new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0))

}

export function reportsStoreSetPeriod(period) {
	reportsStore.update(data => {
		data.period = period
		return data
	})
}

export function reportsStoreUpdateDate(date) {
	reportsStore.update(data => {

		data.dates = {}
		let dateTmp = new Date(date)

		for(var i = 0; i < data.period; i++) {
			data.dates[dateTmp.getFullYear() +'-'+ dateTmp.getMonth() +'-'+ dateTmp.getDate()] = true
			dateTmp = dateNextDate(dateTmp)
		}

		data.date = date
		return data
	})
}