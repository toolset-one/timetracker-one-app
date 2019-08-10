import { writable } from 'svelte/store';

export const uiStore = writable({
	breakpoint: 'bp-xs'
})



export function uiStoreInit() {

}

export function uiStoreSetBreakpoint(windowWidth) {
	uiStore.update(data => {

		if(windowWidth < 600) {
			var breakpoint = 'bp-xs'
		} else {
			var breakpoint = 'bp-l'
		}

		data.breakpoint = breakpoint
		return data
	})
}