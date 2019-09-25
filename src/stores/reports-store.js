import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { timesStore } from '../stores/times-store.js'
import { teamGetActiveId } from '../stores/team-store.js'
import { dateNextDate, dateToDatabaseDate, dateDaysBetweenDates } from '../helpers/helpers.js'
import { sws } from '../helpers/sws-client.js'

export const reportsStore = writable({
	firstDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	lastDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	dates: {},
	filterTasks: [],
	active: null
})

export const reportsStoreBarchartData = writable({
	total: 0,
	tasks: {},
	totalDayMax: 0,
	days: {}
})


export function reportsStoreInit() {
	// reportsStoreUpdateRange(new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0))
	

	timesStore.subscribe(() => {
		const unsubscribe = reportsStore.subscribe(data => {
			buildChartData(data)
		})
		unsubscribe()
	})
	reportsStore.subscribe(buildChartData)
}

export function reportsStoreSetPeriod(period) {
	reportsStore.update(data => {
		data.period = period
		return data
	})
}

export function reportsStoreUpdateRange(firstDate, lastDate) {
	reportsStore.update(data => {

		data.dates = {}
		let dateTmp = new Date(firstDate)

		const daysBetween = dateDaysBetweenDates(firstDate, lastDate) + 1 

		for(var i = 0; i < daysBetween; i++) {
			const databaseDateTmp = dateToDatabaseDate(dateTmp)
			data.dates[databaseDateTmp] = true
			dateTmp = dateNextDate(dateTmp)
		}

		data.firstDate = firstDate
		data.lastDate = lastDate
		return data
	})
}


export function reportsStoreSetActive(id) {
	reportsStore.update(data => {
		data.active = id
		return data
	})
}

async function buildChartData(reportsStore) {

	if(teamGetActiveId()) {

		const chartData = await sws.db.getReportData({
			team: teamGetActiveId(),
			dates: reportsStore.dates,
			filterTasks: reportsStore.filterTasks
		})

		reportsStoreBarchartData.set(chartData)	
	}
}