<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { mobileOverlayTransition } from '../helpers/animations.js'
	import { timesStoreChangeTask } from '../stores/times-store.js'
	import { uiStore } from '../stores/ui-store.js'

	export let options = []
	export let value = []

	const dispatch = createEventDispatcher()

	let el,
		animation = false

	onMount(async () => {

	})


	function toggle(id) {
		if(value.includes(id)) {
			value = value.filter(val => val != id)
		} else {
			value = [...value, id]
		}
	}

	export function externalClose() {
		dispatch('close', '')
	}

</script>

<div class="wrapper" transition:mobileOverlayTransition>
	<header>
		Choose
	</header>

	<div class="swiper">
		<div class="options" bind:this={el}>
			<ul>
				<li></li>
				{#each options as option}
					<li on:click={e => toggle(option.id)}>
						<div class="{value.includes(option.id) ? 'active' : ''}"></div>
						{option.title.length > 0 ? option.title : 'No Title'}
					</li>
				{/each}
				<li></li>
			</ul>
		</div>
	</div>
</div>
<style>
	.wrapper {
		position: fixed;
		bottom:0;
		left:50%;
		max-width:480px;
		width:96.25%;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		transition: transform 200ms ease, opacity 200ms ease;
		transform:translateX(-50%);
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

	.swiper {
		position: relative;
		display:flex;
		flex-direction: row;
	}

	.swiper:before, .swiper:after {
		content:'';
		display:block;
		height:60px;
		width:100%;
		position: absolute;
		top:0;
		left:0;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 12px,rgba(255, 255, 255, .5) 66.66666%);
		pointer-events: none;
		z-index:100;
	}

	.swiper:after {
		top:auto;
		bottom:0;
		transform:rotate(180deg);
	}

	.indicator {
		position: absolute;
		top:50%;
		left:50%;
		width:100%;
		height:42px;
		line-height: 42px;
		font-size:18px;
		text-align:center;
		transform:translateX(-50%) translateY(-50%);
		border-top:#E6E4E1 1px solid;
		border-bottom:#E6E4E1 1px solid;
		pointer-events: none;
	}

	.options {
		width:100%;
		max-height:294px;
		overflow-x:hidden;
		overflow-y:auto;
		-webkit-overflow-scrolling:touch;
		scroll-snap-type: y mandatory;
	}

	.options::-webkit-scrollbar {
		display: none;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
		scroll-snap-align: start;
	}

	li {
		position: relative;
		margin:0;
		padding:0 24px 0 42px;
		height:42px;
		line-height:42px;
		font-size:16.5px;
		scroll-snap-align: start;
	}

	li div {
		position: absolute;
		top:12px;
		left:12px;
		width:18px;
		height:18px;
		border:var(--c-grey) 1px solid;
		border-radius: 3px;
		transition: 100ms ease;
	}

	li .active {
		border-color:var(--c-blue);
	}
	li div:after {
		content:"";
		display:block;
		width:9px;
		height:6px;
		position: absolute;
		top:4px;
		left:4px;
		border-left:var(--c-blue) 2px solid;
		border-bottom:var(--c-blue) 2px solid;
		transform: rotate(45deg);
		opacity:0;
		transition: 100ms ease;
	}

	li .active:after {
		opacity:1;
		transform: rotate(-45deg);
	}
</style>