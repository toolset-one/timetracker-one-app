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

		const boundingRect = document.querySelector('#'+ id +' .project').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left + 6

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
		placeholder="Search Projects"
		on:keydown={e => (e.keyCode === 27 && dispatch('close', ''))}>

	<ul>
		<li>
			Testproject
		</li>
		<li>
			Timetracker.One
		</li>
	</ul>
</div>
<div
	class="backdrop"
	transition:fade="{{delay: 0, duration: 100}}"
	on:click={e => dispatch('close', '')}></div>
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
		background:#FFF;
		border-radius: 6px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		overflow:hidden;
	}

	.input-wrapper:after {
		content:'';
		position: absolute;
		top:47px;
		left:12px;
		right:12px;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.input-wrapper:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	input {
		margin:0;
		border:0;
		line-height: 24px;
		padding:12px 12px;
		font-size:14px;
		outline:none;
		width:240px;
		font-weight:400;
		background:transparent;
	}

	input::placeholder {
		color:#99938D;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
	}

	li {
		font-size:14px;
		line-height: 42px;
		white-space: nowrap;
		padding:0 12px;
		cursor: pointer;
	}

	li:hover {
		background:#F5F3F0;
	}
</style>