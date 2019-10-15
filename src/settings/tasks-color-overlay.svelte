<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { tasksStoreChangeTitle, tasksStoreChangeColor } from '../stores/tasks-store.js'
	import { COLORS } from '../helpers/helpers.js'

	export let id = null
	export let color = ''

	let value = '',
		el,
		top = 0,
		left = 0,
		alreadyClosed = false

	const dispatch = createEventDispatcher()

	onMount(() => {

		const boundingRect = document.querySelector('#entry-'+ id +' .color').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left
	})

	function save(newColor) {
		if(!alreadyClosed) {
			tasksStoreChangeColor(id, newColor)
			dispatch('close', '')
		}
	}

</script>

<div
	style="{
		'top:'+ top +'px;'+
		'left:'+ left +'px;'
	}"
	class="wrapper">
	{#each COLORS as colorOption}
		<div
			class="color {color === colorOption ? 'active' : ''}"
			style="{'background-color:' + colorOption + ';'}"
			on:click={e => save(colorOption)}>
		</div>
	{/each}
	
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
		z-index:1000;
	}

	.wrapper {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
		padding:6px;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:var(--shadow-overlay);
		max-width:204px;
	}

	.color {
		position: relative;
		width:30px;
		height:30px;
		border-radius: 6px;
		float:left;
		margin:9px;
		cursor: pointer;
		transition: all 100ms ease;
	}

	.color:hover {
		box-shadow: 0 0 0 2px #FFF, 0 0 0 4px rgba(0, 0, 0, .25);
	}

	.color.active:after {
		content:"";
		display:block;
		position: absolute;
		top:0;
		right:0;
		bottom:0;
		left:0;
		border:rgba(255, 255, 255, .5) 3px solid;
		border-radius: 6px;
	}

</style>