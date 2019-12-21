<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { COLORS } from '../helpers/helpers.js'
	import { i18n } from '../stores/i18n-store.js'
	import { tasksStoreChangeColor } from '../stores/tasks-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	export let id = null
	export let color = ''

	const dispatch = createEventDispatcher()

	let opened = false,
		el

	onMount(async () => {
		opened = true
	})


	function save(newColor) {

		tasksStoreChangeColor(id, newColor)

		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
	}

	export function externalClose() {
		save(color)
	}

</script>

<div class="wrapper {opened ? 'opened' : ''}">
	<header>
		{$i18n.EDIT_COLOR}
	</header>

	<div class="colors">
		{#each COLORS as colorOption}
			<div
				class="color {color === colorOption ? 'active' : ''}"
				style="{'background-color:' + colorOption + ';'}"
				on:click={e => save(colorOption)}>
			</div>
		{/each}
	</div>

</div>
<style>
	.wrapper {
		position: fixed;
		bottom:0;
		left:12px;
		right:12px;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		opacity:0;
		transform:translateY(100%);
		transition: transform 100ms ease, opacity 100ms ease;
	}

	.opened {
		transform:translateY(0);
		opacity:1;
	}

	header {
		position: relative;
		height:42px;
		background:#FaFaFa;
		line-height: 42px;
		font-size:14px;
		padding:0 12px;
	}

	header .icon {
		position: absolute;
		top:0;
		right:0;
		padding:15px;
		cursor: pointer;
	}

	header:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		header:after {
			background:var(--c-grey);
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.colors {
		padding:6px;
		font-size:0;
		text-align: center;
	} 

	.color {
		display:inline-block;
		position: relative;
		width:42px;
		height:42px;
		border-radius: 6px;
		margin:12px;
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