<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import UiButton from '../ui/ui-button.svelte'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'

	export let id = null
	export let duration = 0

	let value = '',
		el,
		top = 0,
		left = 0

	const dispatch = createEventDispatcher()

	onMount(() => {

		const boundingRect = document.querySelector('#'+ id +' .duration').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left - 6

		el.focus()
	})

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
		on:blur={e => dispatch('close', '')}>
</div>
<div class="backdrop" transition:fade="{{delay: 0, duration: 100}}"></div>
<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .25);
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
		border:0;
		line-height: 24px;
		padding:12px 12px;
		font-size:14px;
		outline:none;
		width:72px;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
		font-weight:600;
	}
</style>