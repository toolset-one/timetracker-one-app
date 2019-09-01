<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { reportsStore, reportsStoreUpdateRange } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate, dateDatabaseToDate} from '../helpers/helpers.js'

	import ReportsBarchartDay from '../reports/reports-barchart-day.svelte'

	let el,
	animation = false,
	elWidth = 960,
	firstDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	startDate = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0),
	innerEl,
	daysArray = [],
	timeout,
	scrollLeft,
	tmp = 0

	$: daysBetween = dateDaysBetweenDates($reportsStore.firstDate, startDate)
	$: rangeDates = Object.keys($reportsStore.dates).length
	$: rangeWidth = elWidth / rangeDates
	$: daysArray = Object.keys($reportsStore.dates).map((key, i) => {
		return {
			date: dateDatabaseToDate(key),
			daysSince: daysBetween + i
		}
	})

	onMount(() => {
		elWidth = el.getBoundingClientRect().width
	})

</script>

<div class="barchart-wrapper" style="{
	'--chart-width:' + elWidth +'px;'+
	'--visible-items:'+ rangeDates +';'
}">

<div class="legend"></div>

<div class="line-wrapper">
	<div class="line" style="bottom:100%;"></div>
	<div class="line" style="bottom:75%;"></div>
	<div class="line" style="bottom:50%;"></div>
	<div class="line" style="bottom:25%;"></div>
	<div class="line line-bottom" style="bottom:0%;"></div>
</div>

<div
	class="barchart bp-{$uiStore.breakpoint} {animation ? 'no-snap' : ''}"
	bind:this={el}>
	<div
		class="inner"
		bind:this={innerEl} style="{'left:'+ (-1 * daysBetween * rangeWidth) +'px'}">
		{#each daysArray as day, i (day.daysSince)}
			<div class="day-container" style="{'left:'+ ((day.daysSince) * rangeWidth) +'px'}">

				<ReportsBarchartDay date={day.date} />
			</div>
		{/each}
	</div>
</div>

</div>


<style>
	.barchart-wrapper {
		position: relative;
		width:100%;
		background:#FFF;
	}

	.barchart {
		position: relative;
		height:250px;
		width:100%;
		overflow:hidden;
		backface-visibility: hidden;
		z-index:300;
	}

	.barchart.bp-l {
		height:360px;
	}

	.inner {
		position: relative;
		height: 100%;
	}

	.day-container {
		position:absolute;
		top:0;
		width:calc(var(--chart-width) / var(--visible-items));
		height:100%;
		text-align: center;
		font-size:14px;
		z-index:100;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.day-container:hover {
		background:rgba(0, 0, 0, .1);
	}

	.day-container:hover .date small {
		opacity: 1;
	}

	.legend {
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height:48px;
		background:#FAF9F7;
	}

	.line-wrapper {
		pointer-events: none;
		position: absolute;
		top:0;
		bottom:48px;
		left:0;
		right:0;
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