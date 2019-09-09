<script>
	import { createEventDispatcher } from 'svelte'

	import UiMobileDatePicker from './ui-mobile-date-picker.svelte'

	const dispatch = createEventDispatcher()

	let el

	export let firstDate = new Date()

	function save() {
		dispatch('change', {
			attribute: 'firstDate',
			value: firstDate
		})

		dispatch('close', '')
	}

	export function externalClose() {
		el.externalClose()
	}

</script>

<UiMobileDatePicker
	bind:this={el}
	bind:date={firstDate}
	on:close={e => save()}
/>