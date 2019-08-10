import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { timesStore, timesStoreControlDate } from '../stores/times-store.js'
import { dateNextDate, dateToDatabaseDate } from '../helpers/helpers.js'

export const reportsStore = writable({
	date: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	dates: {},
	period: 7,
	filterTasks: []
})

export const reportsStoreBarchartData = writable({
	totalDayMax: 0,
	days: {}
})


export function reportsStoreInit() {
	reportsStoreUpdateDate(new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0))
	reportsStore.subscribe(buildChartData)
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
			const databaseDateTmp = dateToDatabaseDate(dateTmp)
			timesStoreControlDate(databaseDateTmp)
			data.dates[databaseDateTmp] = true
			dateTmp = dateNextDate(dateTmp)
		}

		data.date = date
		return data
	})
}


function buildChartData(reportsStore) {

	var chartData = {
		totalDayMax: 0,
		days: {}
	}

	const unsubscribe = timesStore.subscribe(timesStore => {
		Object.keys(reportsStore.dates).forEach(date => {
			chartData.days[date] = {
				total: 0,
				tasks: {}
			}

			Object.keys(timesStore.dayIndex[date] || []).forEach(timeId => {
				const { task, duration } = timesStore.times[timeId]

				chartData.days[date].total += duration

				if(!chartData.days[date].tasks[task]) {
					chartData.days[date].tasks[task] = 0
				}
				chartData.days[date].tasks[task] += duration
			})

			chartData.totalDayMax = Math.max( chartData.totalDayMax, chartData.days[date].total )
		})

		chartData.totalDayMax = Math.ceil(chartData.totalDayMax / 3600) * 3600

		reportsStoreBarchartData.set(chartData)	
	})
	unsubscribe()

}