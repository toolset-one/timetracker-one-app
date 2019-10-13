import { writable, get } from 'svelte/store';
import { routerStore } from '../stores/router-store.js'
import { timesStore } from '../stores/times-store.js'
import { teamStore } from '../stores/team-store.js'
import { dateNextDate, dateToDatabaseDate, dateDaysBetweenDates } from '../helpers/helpers.js'
import { sws } from '../helpers/sws-client.js'

let teamId = null

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

	timesStore.subscribe(() => {
		if(teamId) {
			const reportsData = get(reportsStore)
			buildChartData(reportsData, teamId)
		}
	})

	teamStore.subscribe(teamData => {
		if(teamData.active && teamData.active.id != teamId) {
			teamId = teamData.active.id
			const reportsData = get(reportsStore)
			buildChartData(reportsData, teamId)
		}
	})

	reportsStore.subscribe(reportsData => {
		if(teamId) {
			buildChartData(reportsData, teamId)
		}
	})
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

async function buildChartData(reportsStore, teamId) {

	const chartData = await sws.db.getReportData({
		team: teamId,
		dates: reportsStore.dates,
		filterTasks: reportsStore.filterTasks
	})

	reportsStoreBarchartData.set(chartData)	
}