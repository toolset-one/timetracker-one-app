<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
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
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13) { // ENTER
			save()
		}
	}

	function save() {
		if(!alreadyClosed) {
			if(value != '' && !isNaN(dateTimeToDuration(value))) {
				timesStoreChangeDuration(id, dateTimeToDuration(value))
			}
			dispatch('close', '')
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
		on:keydown={e => keydown(e)}>
</div>
<div class="backdrop" transition:fade="{{delay: 0, duration: 100}}"></div>
<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .15);
		/* -webkit-backdrop-filter: blur(1px); */
		z-index:1000;
	}

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
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		font-weight:600;
		border-radius: 6px;
	}

	input::placeholder {
		color:#99938D;
	}
</style>