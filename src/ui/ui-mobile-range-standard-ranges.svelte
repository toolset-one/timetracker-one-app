<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { mobileOverlayTransition } from '../helpers/animations.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import UiIcon from '../ui/ui-icon.svelte'

	const dispatch = createEventDispatcher()

	export let options = []
	export let rangeOption

	let optionsEl,
		animation = false


	onMount(() => {

		var index = 0
		options.forEach((val, i) => {
			if(val.title === rangeOption) {
				index = i
			}
		})

		scrollTo(optionsEl, index * 42, 200)
	})


	function select(e, option) {

		var index = 0
		options.forEach((val, i) => {
			if(val.value === option.value) {
				index = i
			}
		})

		animation = true
		scrollTo(optionsEl, index * 42, 200)
	}


	function scrollTo(element, to, duration) {
		let start = element.scrollTop,
			change = to - start,
			currentTime = 0,
			increment = 20;
			
		const animateScroll = () => {		
			currentTime += increment
			const val = Math.easeInOutQuad(currentTime, start, change, duration)
			element.scrollTop = val
			if(currentTime < duration) {
				setTimeout(animateScroll, increment)
			} else {
				animation = false
			}
		}
		animateScroll()
	}


	Math.easeInOutQuad = function (t, b, c, d) {
		t /= d / 2
		if (t < 1) return c / 2 * t * t + b
		t--
		return -c / 2 * (t * (t - 2) - 1) + b
	}


	function save() {
		const index = Math.round(optionsEl.scrollTop / 42)

		dispatch('change', {
			attribute: 'rangeValue',
			value: options[index].value
		})

		dispatch('close', '')
	}

	export function externalClose() {
		save()
	}

</script>

<div class="wrapper" transition:mobileOverlayTransition>
	<header>
		Pick a range
	</header>

	<div class="swiper">
		<div class="options tasks {animation ? 'no-snap' : ''}" bind:this={optionsEl}>
			<ul>
				<li></li>
				<li></li>
				<li></li>
				{#each options as option}
					<li on:click={e => select(e, option)}>
						{option.title}
					</li>
				{/each}
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<div class="indicator"></div>
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
		height:126px;
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

	.options.no-snap {
		scroll-snap-type:none;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
		scroll-snap-align: start;
	}

	li {
		margin:0;
		padding:0 24px;
		height:42px;
		line-height:42px;
		font-size:18px;
		scroll-snap-align: start;
	}
</style>