import { writable, get } from 'svelte/store';
import { userStore } from '../stores/user-store.js'

let language = 'en'

export const i18n = writable({
	"NEW_ENTRY": "New Entry",
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
	]
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


