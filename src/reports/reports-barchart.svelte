<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { reportsStore, reportsStoreBarchartData, reportsStoreUpdateRange } from '../stores/reports-store.js'

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
	tmp = 0,
	activeDate = null

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
	<div class="line" style="bottom:100%;">
		<span>
			{dateGetHours($reportsStoreBarchartData.totalDayMax)}:{dateGetMinutes($reportsStoreBarchartData.totalDayMax)}
		</span>
	</div>
	<div class="line" style="bottom:75%;">
		<span>
			{dateGetHours($reportsStoreBarchartData.totalDayMax / 4 * 3)}:{dateGetMinutes($reportsStoreBarchartData.totalDayMax / 4 * 3)}
		</span>
	</div>
	<div class="line" style="bottom:50%;">
		<span>
			{dateGetHours($reportsStoreBarchartData.totalDayMax / 2)}:{dateGetMinutes($reportsStoreBarchartData.totalDayMax / 2)}
		</span>
	</div>
	<div class="line" style="bottom:25%;">
		<span>
			{dateGetHours($reportsStoreBarchartData.totalDayMax / 4 * 1)}:{dateGetMinutes($reportsStoreBarchartData.totalDayMax / 4 * 1)}
		</span>
	</div>
	<div class="line line-bottom" style="bottom:0%;"></div>
</div>

<div
	class="barchart bp-{$uiStore.breakpoint} {animation ? 'no-snap' : ''}"
	bind:this={el}>
	<div
		class="inner"
		bind:this={innerEl} style="{'left:'+ (-1 * daysBetween * rangeWidth) +'px'}">
		{#each daysArray as day, i (day.daysSince)}
			<div
				class="day-container {activeDate === day.daysSince || !activeDate ? '' : 'inactive'}"
				on:mouseenter={e => activeDate = day.daysSince}
				on:mouseleave={e => activeDate = null}
				style="{'left:'+ ((day.daysSince) * rangeWidth) +'px'}"
				>

				<ReportsBarchartDay date={day.date} active={activeDate === day.daysSince} />
			</div>
		{/each}
	</div>
</div>
</div>

<div class="dates">
	<div class="date first-date">
		{dateGetHumanDate($reportsStore.firstDate)}
	</div>
	<div class="date last-date">
		{dateGetHumanDate($reportsStore.lastDate)}
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
		width:calc(100% - 24px);
		backface-visibility: hidden;
		z-index:300;
		margin:0 0 0 24px;
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
		z-index:200;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.day-container:hover {
		background:rgba(0, 0, 0, .1);
	}

	.day-container:hover .date small {
		opacity: 1;
	}

	.day-container.inactive {
		z-index:100;
		opacity: .5;
	}

	/*.legend {
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height:48px;
		background:var(--c-background-light);
	}*/

	.line-wrapper {
		pointer-events: none;
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		right:0;
	}

	.line {
		content:'';
		position: absolute;
		bottom:0;
		left:24px;
		right:0;
		height: 1px;
		background:#E6E4E1;
		z-index:200;
	}

	.line-bottom {
		background:var(--c-darkgrey);
		left:0;
	}

	.line span {
		font-size:9px;
		line-height: 12px;
		width:24px;
		text-align: left;
		padding:0 0 0 1px;
		position: absolute;
		top:50%;
		right:100%;
		transform:translateY(-50%);
		border-top-right-radius: 3px;
		border-bottom-right-radius: 3px;
		color:var(--c-greyed-out);
	}

 	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.line {
			background:var(--c-grey);
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}

		.line-bottom {
			background:var(--c-darkgrey);
		}

		.line span {
			transform:translateY(-50%) scale(1, 2);
		}
	}

	.dates {
		width:100%;
		display:flex;
		flex-direction:row;
	}

	.date {
		flex:1;
		font-size:12px;
		line-height:12px;
		padding:12px 0 0 0;
		font-weight:600;
	}

	.last-date {
		text-align: right;
	}
</style>