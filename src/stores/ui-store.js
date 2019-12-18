import { writable, get } from 'svelte/store';
import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'
import { routerStore } from '../stores/router-store.js'
import { userStore, userStopwatchStore } from '../stores/user-store.js'


const TITLE_MAP = {
	'sign-in': 'Sign In',
	'sign-uo': 'Sign Up',
	'new-password': 'New password',
	'timelog': 'Timelog',
	'reports': 'Reports',
	'settings': 'Settings',
}

let view = '',
	hours = null,
	minutes = null,
	seconds = null,
	divider = ':'


export const uiStore = writable({
	breakpoint: 'xs',
	isTouchDevice: false
})


export const uiStopwatchStore = writable({
	hours: 0,
	minutes: 0,
	seconds: 0
})


export const uiScrollstopStore = writable({
	scrollstop: false
})


export function uiStoreInit() {
	uiStore.update(data => {
		data.isTouchDevice = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false
		return data
	})
}


export function uiStoreSetBreakpoint(windowWidth) {
	uiStore.update(data => {

		if(windowWidth < 800) {
			var breakpoint = 'xs'
		} else {
			var breakpoint = 'l'
		}

		data.breakpoint = breakpoint
		return data
	})
}


userStopwatchStore.subscribe(userStopwatchData => {


	hours = dateGetHours(userStopwatchData)
	minutes = dateGetMinutes(userStopwatchData)
	seconds = dateGetSeconds(userStopwatchData)

	uiStopwatchStore.update(data => {
		return {
			hours,
			minutes,
			seconds
		}
	})
	setTitle(view, hours, minutes)
})


routerStore.subscribe(routerData => {
	view = routerData.view
	setTitle(view, hours, minutes)
})


function setTitle(view, hours, minutes) {
	divider = divider === ':' ? ' ' : ':'
	const stopwatchTitle = (get(userStore).stopwatchEntryId) ? '['+ hours + divider + minutes +'] ' : ''
	document.title = stopwatchTitle + TITLE_MAP[view] +' · Timetracker.One'
}