<script>
	import { createEventDispatcher } from 'svelte'

	import UiMobileDatePicker from './ui-mobile-date-picker.svelte'

	const dispatch = createEventDispatcher()

	let el

	export let lastDate = new Date()

	function save() {
		dispatch('change', {
			attribute: 'lastDate',
			value: lastDate
		})

		dispatch('close', '')
	}

	export function externalClose() {
		el.externalClose()
	}

</script>

<UiMobileDatePicker
	bind:this={el}
	bind:date={lastDate}
	on:close={e => save()}
/>