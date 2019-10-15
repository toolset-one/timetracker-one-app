<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import UiButton from '../ui/ui-button.svelte'
	import { dateGetHours, dateGetMinutes, dateGetSeconds, dateTimeToDuration } from '../helpers/helpers.js'
	import { timesStoreChangeDuration } from '../stores/times-store.js'

	export let id = null
	export let duration = 0

	let value = '',
		el,
		top = 0,
		left = 0,
		alreadyClosed = false

	const dispatch = createEventDispatcher()

	onMount(() => {

		const boundingRect = document.querySelector('#entry-'+ id +' .duration').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left - 6

		el.focus()
	})

	function keydown(e) {
		if( e.keyCode === 27) { // ESC
			e.preventDefault()
			e.stopPropagation()
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13 || e.keyCode === 9) { // ENTER / TAB
			e.preventDefault()
			e.stopPropagation()
			save()
		}
	}

	function save() {
		if(!alreadyClosed) {
			if(value != '' && !isNaN(dateTimeToDuration(value))) {
				timesStoreChangeDuration(id, dateTimeToDuration(value))
			}
			dispatch('close', '')
			document.querySelector('#entry-' + id + ' .task').focus()
		}
	}

</script>

<div
	style="{
		'top:'+ top +'px;'+
		'left:'+ left +'px;'
	}"
	class="input-wrapper">
	<input
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="{dateGetHours(duration)}:{dateGetMinutes(duration)}"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}
		data-disable="true">
</div>
<style>
	.input-wrapper {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
	}

	input {
		margin:0;
		border:0;
		line-height: 24px;
		padding:12px 12px;
		font-size:14px;
		outline:none;
		width:72px;
		box-shadow:var(--shadow-overlay);
		font-weight:600;
		border-radius: 6px;
	}

	input::placeholder {
		color:#99938D;
	}
</style>