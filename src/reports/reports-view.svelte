<script>
	import { onMount, afterUpdate } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { reportsStore, reportsStoreUpdateRange, reportsStoreBarchartData, reportsStoreSetPeriod } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateGetWeek, dateGetMonth, datePrevMonth, dateNextMonth, dateIsWeek, dateIsMonth, dateGetWeekStart, dateGetMonthStart } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiMultiselect from '../ui/ui-multiselect.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'
	import ReportsDistribution from '../reports/reports-distribution.svelte'
	import ReportsLegend from '../reports/reports-legend.svelte'
	import UiRangePicker from '../ui/ui-range-picker.svelte'

	const RANGE_OPTIONS = [{
		title: 'Current Week',
		value: 'current-week'
	}, {
		title: 'Last Week',
		value: 'last-week'
	}, {
		title: 'Current Month',
		value: 'current-month'
	}, {
		title: 'Last Month',
		value: 'last-month'
	}, {
		title: 'Custom',
		value: 'custom',
		disabled: true
	}]


	let filterTasks,
		filterTasksLength = 0,
		firstDate = dateGetWeekStart(),
		lastDate = dateNextDate(firstDate, 6),
		rangeNow = 'current-week'

	$: tasksToFilter = [...$tasksStore.array, {
		title: 'No Task',
		id: null
	}]


	onMount(() => {
		reportsStore.subscribe(reportsStoreChanged)
	})


	afterUpdate(() => {
		if(filterTasksLength != filterTasks.length) {
			reportsStore.update(data => {
				filterTasksLength = filterTasks.length
				data.filterTasks = filterTasks
				return data
			})
		}
	})


	function changed(e) {
		reportsStoreUpdateRange(e.detail.firstDate, e.detail.lastDate)
	}


	function rangeChanged(e) {
		if(rangeNow === 'current-week') {

			firstDate = dateGetWeekStart()
			lastDate = dateNextDate(firstDate, 6)

		} else if(rangeNow === 'last-week') {

			firstDate = dateGetWeekStart(datePrevDate(new Date(), 7))
			lastDate = dateNextDate(firstDate, 6)

		} else if(rangeNow === 'current-month') {

			firstDate = dateGetMonthStart()
			lastDate = datePrevDate(dateNextMonth(firstDate))

		} else if(rangeNow === 'last-month') {

			firstDate = dateGetMonthStart(datePrevMonth(new Date()))
			lastDate = datePrevDate(dateNextMonth(firstDate))
		}

		reportsStoreUpdateRange(firstDate, lastDate)
	}


	function reportsStoreChanged({ firstDate, lastDate }) {

		let firstDateTest = dateGetWeekStart()
		let lastDateTest = dateNextDate(firstDateTest, 6)

		if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
			rangeNow = 'current-week'
			return
		}

		firstDateTest = dateGetWeekStart(datePrevDate(new Date(), 7))
		lastDateTest = dateNextDate(firstDate, 6)

		if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
			rangeNow = 'last-week'
			return
		}

		firstDateTest = dateGetMonthStart()
		lastDateTest = datePrevDate(dateNextMonth(firstDate))

		if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
			rangeNow = 'current-month'
			return
		}

		firstDateTest = dateGetMonthStart(datePrevMonth(new Date()))
		lastDateTest = datePrevDate(dateNextMonth(firstDate))

		if(isSameDate(firstDate, firstDateTest) && isSameDate(lastDate, lastDateTest)) {
			rangeNow = 'last-month'
			return
		}

		rangeNow = 'custom'
	}


	function isSameDate(date1, date2) {
		return date1.getDate() === date2.getDate()
			&& date1.getMonth() === date2.getMonth()
			&& date1.getYear() === date2.getYear()
	}


	reportsStoreUpdateRange(firstDate, lastDate)

</script>

<section class="filter-header bp-{$uiStore.breakpoint}">
	<div class="custom-range-wrapper">
		<UiRangePicker 
			bind:firstDate={firstDate}
			bind:lastDate={lastDate}
			on:input={e => changed(e)}/>
	</div>
	{#if $uiStore.breakpoint === 'l'}
		<div class="ranges-wrapper">
			<UiRadio options={RANGE_OPTIONS} bind:value={rangeNow} on:change={e => rangeChanged()} />
		</div>
	{/if}
</section>


<section class="filter-buttons bp-{$uiStore.breakpoint}">	
	<div class="button-wrapper">
		<UiMultiselect
			label="Tasks"
			options={tasksToFilter}
			bind:value={filterTasks} />
	</div>
</section>


<section class="distribution-wrapper bp-{$uiStore.breakpoint}">
	<ReportsDistribution />
</section>


<section class="barchart-wrapper bp-{$uiStore.breakpoint}">
	<ReportsBarchart />
</section>


<section class="legend-wrapper bp-{$uiStore.breakpoint}">
	<ReportsLegend />
</section>



<style>

	section {
		display:flex;
		flex-flow: row wrap;
		max-width:960px;
		margin:24px auto;
	}

	.filter-header {
		margin:12px;
	}

	.filter-header.bp-l {
		margin:24px auto;
	}

	.filter-header .button-wrapper {
		margin-right:12px;
	}

	.filter-buttons {
		margin:0 12px 12px 12px;
	}

	.filter-buttons.bp-l {
		margin:24px auto;
	}

	.legend-wrapper {
		margin:0 12px 84px 12px;
	}

	.spacer {
		
	}

	.ranges-wrapper {
		flex:1;
		text-align: right;
	}

	.custom-range-wrapper {
		max-width:100%;
	}

	.bp-l .custom-range-wrapper {

	}

	.range-header {
		display:flex;
		flex-direction: row wrap;

		margin:0 12px 12px 12px;
	}

	.range-header.bp-l {
		margin:24px auto;
	}

	.distribution-wrapper {
		margin:12px;
	}

	.distribution-wrapper.bp-l {
		margin:24px auto;
	}

	.barchart-wrapper {
		margin:48px 12px 12px 12px;
	}

	.barchart-wrapper.bp-l {
		margin:60px auto;
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