<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { reportsStore, reportsStoreSetPeriod } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateGetWeek, dateGetMonth } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiMultiselect from '../ui/ui-multiselect.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'

	const PERIOD_OPTIONS = [{
		title: 'Week',
		value: 'week'
	}, {
		title: 'Month',
		value: 'month'
	}/*, {
		title: 'Year',
		value: 'year'
	}*/],

	PERIOD_MAP = {
		'week': 7,
		'month': 31,
		'year': 368
	}

	let period = 'week',
		tasksActive

	onMount(() => {

	})

	function getPeriodTitle(date) {

		if(period === 'week') {
			if( dateGetWeek(datePrevDate(date)) != dateGetWeek(date)) {
				return 'Week Number ' + dateGetWeek(date)
			} else {
				return dateGetHumanDate(date) +' – '+ dateGetHumanDate(dateNextDate(date, 6))
			}
		} else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				return dateGetMonth(date) + ' ' + date.getFullYear()
			} else {
				return dateGetHumanDate(date) +' – '+ dateGetHumanDate(dateNextDate(date, 30))
			}
		}

		return dateGetWeek(date)
	}

</script>

<section class="filter-header">
	<!--<div class="button-wrapper">
		<UiButton label="Team ▾" />
	</div>-->
	<div class="button-wrapper">
		<UiMultiselect
			label="Tasks"
			type="icon-right"
			icon="arrow-left"
			options={$tasksStore.array}
			bind:value={tasksActive} />
	</div>
	<!--<div class="button-wrapper">
		<UiButton label="Tags ▾" />
	</div>-->
</section>

<section class="range-header">
	<div class="date-nav">
		<div class="button-wrapper">
			<UiButton 
				type="icon" 
				icon="arrow-left" />
		</div>
		<div class="button-wrapper">
			<UiButton 
				type="icon"
				icon="arrow-right" />
		</div>
		<h2>
			{getPeriodTitle($reportsStore.date)}
		</h2>
	</div>

	<div class="range-wrapper">
		<UiRadio options={PERIOD_OPTIONS} bind:value={period} on:change={e => reportsStoreSetPeriod(PERIOD_MAP[period])} />
	</div>
</section>

<section>
	<ReportsBarchart />
</section>



<style>

	section {
		display:flex;
		flex-flow: row wrap;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	.filter-header .button-wrapper {
		margin-right:6px;
	}

	.range-header {
		display:flex;
		flex-direction: row wrap;
	}

	.date-nav {
		display:flex;
		flex-flow: row wrap;
		width:60%;
		font-size:0;
	}

	.button-wrapper {
		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:12px;
	}

	.range-wrapper {
		flex: 1;
		text-align:right;
	}

</style>