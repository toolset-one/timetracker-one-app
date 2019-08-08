<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { routerStore } from '../stores/router-store.js'
	import { reportsStore, reportsStoreUpdateDate } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth} from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'

	const barchartStore = writable({
		startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
		firstDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0)
	})

	let el,
	innerEl,
	daysArray = [],
	timeout,
	scrollLeft

	$: daysBetween = dateDaysBetweenDates($barchartStore.firstDate, $barchartStore.startDate)

	onMount(() => {
		
		barchartStore.subscribe(data => {

			let dateTmp = new Date(data.startDate)
			dateTmp.setDate(dateTmp.getDate() - $reportsStore.period)

			let daysSince = daysBetween,
				arrayTmp = []

			for(var i = -1 * $reportsStore.period; i <= $reportsStore.period; i++) {
				arrayTmp.push({
					date: dateTmp,
					daysSince
				})

				dateTmp = dateNextDate(dateTmp)
				daysSince++
			}
			daysArray = arrayTmp
		})

		el.scrollLeft = 500000		
	})



	function scroll(e) {
		console.log(el.scrollLeft)
		barchartStore.update(data => {
			let dateTmp = new Date($barchartStore.firstDate),
			periodWidth = (960 / $reportsStore.period)

			dateTmp.setDate(dateTmp.getDate() + Math.floor((el.scrollLeft - 500000) / periodWidth) )

			data.startDate = dateTmp
			return data
		})

		if(timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(() => {
			let dateTmp = new Date($barchartStore.firstDate),
				periodWidth = (960 / $reportsStore.period)
			dateTmp.setDate(dateTmp.getDate() + Math.round((el.scrollLeft - 500000) / periodWidth) )
			reportsStoreUpdateDate(dateTmp)
		}, 100)

	}

</script>

<div class="barchart-wrapper" style="{'--visible-items:'+ $reportsStore.period}">

<div class="legend"></div>

<div class="line" style="bottom:calc(48px + 352px)"></div>
<div class="line" style="bottom:calc(48px + 264px)"></div>
<div class="line" style="bottom:calc(48px + 176px)"></div>
<div class="line" style="bottom:calc(48px + 88px)"></div>
<div class="line line-bottom" style="bottom:calc(48px + 0)"></div>

<div
	class="barchart"
	bind:this={el}
	on:scroll={e => scroll(e)}>
	<div
		class="inner"
		bind:this={innerEl}>
		{#each daysArray as day, i (day.daysSince)}
			<div class="day-container" style="{'left:'+ (500000 + (day.daysSince - $reportsStore.period) * 960 / $reportsStore.period) +'px'}">

				{#if $reportsStore.dates[day.date.getFullYear() +'-'+ day.date.getMonth() +'-'+ day.date.getDate()]}
					.
				{/if}

				<div class="date">
					<span>
						{dateGetWeekday(day.date)}
					</span>
					<small>
						{dateGetDay(day.date)} {dateGetMonth(day.date)}
					</small>
				</div>
			</div>
		{/each}
	</div>
</div>

</div>

<!-- {JSON.stringify($reportsStore.dates)} -->


<style>
	.barchart-wrapper {
		position: relative;
		width:100%;
		background:#FFF;
	}

	.barchart {
		position: relative;
		height:400px;
		width:100%;
		overflow-x:auto;
		overflow-y:show;
		scroll-snap-type: x mandatory;
		backface-visibility: hidden;
	}

	.barchart::-webkit-scrollbar {
		display: none;
	}

	.inner {
		position: relative;
		height: 100%;
		width:1000000px !important;
		backface-visibility: hidden;
	}

	.day-container {
		position:absolute;
		top:0;
		/* border-right:1px #CCC solid; */
		width:calc(960px / var(--visible-items));
		height:100%;
		scroll-snap-align: start;
		text-align: center;
		font-size:14px;
		z-index:100;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	/* .day-container:nth-child(odd) .date {
		display:none;
	}*/

	.day-container:hover {
		background:#F5F3F0;
	}

	.day-container:hover .date small {
		opacity: 1;
	}

	.date {
		position: absolute;
		bottom:0;
		left:50%;
		transform: translateX(-50%);
		text-align: center;
	}

	.day-container:hover .day-container {
		background:rgba(0, 0, 0, .1);
	}

	.date span {
		position: relative;
		display: inline-block;
		font-size:12px;
		line-height:12px;
		padding:6px 0;
	}

	.date small {
		background:#F5F3F0;
		display: block;
		padding:0 6px;
		font-size:12px;
		line-height:24px;
		white-space: nowrap;
		font-weight:600;
		opacity:0;
		border-radius: 6px;
	}

	.legend {
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height:48px;
		background:#FAF9F7;
	}

	.line {
		content:'';
		position: absolute;
		bottom:48px;
		left:0;
		right:0;
		height: 1px;
		background:#E6E4E1;
		z-index:200;
	}

	.line-bottom {
		background:#26231E;
	}

 	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.line {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}

		.line-bottom {
			background:#26231E;
		}
	}
</style>