import { writable } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { timesStore, timesStoreControlDate } from '../stores/times-store.js'
import { dateNextDate, dateToDatabaseDate, dateDaysBetweenDates } from '../helpers/helpers.js'

export const reportsStore = writable({
	firstDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	lastDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	dates: {},
	filterTasks: []
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

		console.log(daysBetween)

		for(var i = 0; i < daysBetween; i++) {
			const databaseDateTmp = dateToDatabaseDate(dateTmp)
			timesStoreControlDate(databaseDateTmp)
			data.dates[databaseDateTmp] = true
			dateTmp = dateNextDate(dateTmp)
		}

		data.firstDate = firstDate
		data.lastDate = lastDate
		return data
	})
}


function buildChartData(reportsStore) {

	var chartData = {
		total: 0,
		tasks: {},
		totalDayMax: 0,
		days: {}
	}

	const unsubscribe = timesStore.subscribe(timesStore => {

		const allTasks = reportsStore.filterTasks.length === 0

		Object.keys(reportsStore.dates).forEach(date => {
			chartData.days[date] = {
				total: 0,
				tasks: {}
			}

			Object.keys(timesStore.dayIndex[date] || []).forEach(timeId => {
				const { task, duration } = timesStore.times[timeId]

				if(allTasks || reportsStore.filterTasks.includes(task) ) {
					chartData.total += duration
					chartData.days[date].total += duration

					if(!chartData.days[date].tasks[task]) {
						chartData.days[date].tasks[task] = 0
					}
					chartData.days[date].tasks[task] += duration

					if(!chartData.tasks[task]) {
						chartData.tasks[task] = 0
					}

					chartData.tasks[task] += duration
				}
			})

			chartData.totalDayMax = Math.max( chartData.totalDayMax, chartData.days[date].total )
		})

		chartData.totalDayMax = Math.ceil(chartData.totalDayMax / 3600) * 3600

		reportsStoreBarchartData.set(chartData)	
	})
	unsubscribe()

}