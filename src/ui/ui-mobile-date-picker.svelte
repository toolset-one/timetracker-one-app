<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { MONTHS, getWindowWidth, trailingZero } from '../helpers/helpers.js'
	import { mobileOverlayTransition } from '../helpers/animations.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { timesStore, timesStoreChangeDuration } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { dateGetHours, dateGetMinutes } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiIcon from '../ui/ui-icon.svelte'

	export let date = new Date()

	const dispatch = createEventDispatcher()

	let months = [],
		dates = [],
		years = [],
		monthsEl,
		datesEl,
		yearsEl

	onMount(async () => {
		months = MONTHS

		for(var i = 0; i <= 31; i++) {
			dates.push(i)
		}

		const baseYear = (new Date().getFullYear() - 50)
		let selectedYear
		for(var i = 0; i <= 100; i++) {
			years.push(baseYear + i)
			if(baseYear + i === date.getFullYear()) {
				selectedYear = i
			}
		}

		dates = dates
		years = years

		setTimeout(() => {
			monthsEl.scrollTop = date.getMonth() * 42
			datesEl.scrollTop = date.getDate() * 42
			yearsEl.scrollTop = selectedYear * 42
		})
	})


	export function save() {
		date = new Date(years[Math.floor(yearsEl.scrollTop / 42)], Math.floor(monthsEl.scrollTop / 42), Math.floor(datesEl.scrollTop / 42))
		dispatch('close', '')
	}

	export function externalClose() {
		save()
	}

</script>

<div class="wrapper" transition:mobileOverlayTransition>
	<header>
		Select Date
	</header>

	<div class="swiper">
		<div class="options months" bind:this={monthsEl}>
			<ul>
				<li></li>
				<li></li>
				<li></li>
				{#each months as month}
					<li>
						{month}
					</li>
				{/each}
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<div class="options dates" bind:this={datesEl}>
			<ul>
				<li></li>
				<li></li>
				<li></li>
				{#each dates as date}
					<li>
						{date}
					</li>
				{/each}
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<div class="options years" bind:this={yearsEl}>
			<ul>
				<li></li>
				<li></li>
				<li></li>
				{#each years as year}
					<li>
						{year}
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
			background:#CCC9C4;
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
		z-index: 100;
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
		width:50%;
		max-height:294px;
		overflow-x:hidden;
		overflow-y:auto;
		-webkit-overflow-scrolling:touch;
		scroll-snap-type: y mandatory;
	}

	.options::-webkit-scrollbar {
		display: none;
	}

	.dates li {
		text-align: right;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
		scroll-snap-align: start;
	}

	li {
		margin:0;
		padding:0 12px;
		height:42px;
		line-height:42px;
		font-size:18px;
		font-family:monospace; /* TODO: OVERPASS */
		scroll-snap-align: start;
	}
</style>