import { writable, get } from 'svelte/store';
import { userStore } from '../stores/user-store.js'

let language = 'en'

export const i18n = writable({
	"MONTHS": [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"Juli",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	"WEEKDAYS_SHORT": [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	"MAIN_NAV": [
		"Timelog",
		"Reports",
		"Settings"
	],

	"NEW_ENTRY": "New Entry",
	"NO_TITLE": "No title",
	"NO_TASK": "No task",
	"NO_COMMENT": "No comment",
	"STOP_STOPWATCH": "Stop Stopwatch",
	"START_STOPWATCH": "Start Stopwatch",
	"EDIT_DURATION": "Edit Duration",
	"EDIT_TASK": "Edit Task",
	"EDIT_COMMENT": "Edit Comment",
	"DELETE": "Delete",
	"SEARCH_TASKS": "Search Tasks",
	"NO_TASKS_FOUND": "No tasks found for this search term",
	"NO_TRACKED_HOURS": "No tracked hours for this day.",
	"NO_TRACKED_HOURS_DESCRIPTION": "To track some time, please use the button saying \"New Entry\". If you need help how to use timetracker.one, please",
	"NO_TRACKED_HOURS_LINK": "click here",
	"TOTAL": "total",

	"NO_TIMES_FOR_FILTERS": "There are no times logged for the choosen filters.",
	"TASKS": "Tasks",
	"CURRENT_WEEK": "Current Week",
	"LAST_WEEK": "Last Week",
	"CURRENT_MONTH": "Current Month",
	"LAST_MONTH": "Last Month",
	"CUSTOM": "Custom",
	"WEEK": "Week",
	"UNTIL": "until"
})

export function i18nStoreInit() {
	setListener()
	getTranslations()
}

function setListener() {
	userStore.subscribe(userData => {
		if(userData.language != language) {
			language = userData.language
			getTranslations()
		}
	})
}

function getTranslations() {
	fetch('/i18n-'+ language +'.json').then(async res => {
			if (res.status !== 200) {
				return
			}

			const i18nObj = await res.json().catch(err => console.log(err))

			i18n.update(() => i18nObj)
		}
	).catch(err => console.log('Fetch Error', err))
}


