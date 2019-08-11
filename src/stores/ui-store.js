import { writable } from 'svelte/store';

export const uiStore = writable({
	breakpoint: 'xs',
	isTouchDevice: false
})



export function uiStoreInit() {
	uiStore.update(data => {
		data.isTouchDevice = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false
		return data
	})
}

export function uiStoreSetBreakpoint(windowWidth) {
	uiStore.update(data => {

		if(windowWidth < 600) {
			var breakpoint = 'xs'
		} else {
			var breakpoint = 'l'
		}

		data.breakpoint = breakpoint
		return data
	})
}