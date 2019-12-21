<script>
	import { onMount, afterUpdate } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { i18n } from '../stores/i18n-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { reportsStore, reportsStoreUpdateRange, reportsStoreBarchartData, reportsStoreSetPeriod } from '../stores/reports-store.js'

	import { RANGE_OPTIONS, RANGE_MAP, dateToDatestring, dateStringToDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateGetWeek, dateGetMonth, datePrevMonth, dateNextMonth, dateIsWeek, dateIsMonth, dateGetWeekStart, dateGetMonthStart, dateRangeGetStandard, dateRangeGetStandardForDates } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiMultiselect from '../ui/ui-multiselect.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'
	import ReportsDistribution from '../reports/reports-distribution.svelte'
	import ReportsLegend from '../reports/reports-legend.svelte'
	import UiRangePicker from '../ui/ui-range-picker.svelte'


	let filterTasks,
		filterTasksLength = 0,
		firstDate = dateGetWeekStart(),
		lastDate = dateNextDate(firstDate, 6),
		rangeNow = 'current-week'

	$: tasksToFilter = [...$tasksStore.array, {
		title: $i18n.NO_TASK,
		id: null
	}]


	$: RANGE_OPTIONS_I18N = ($i18n =>
			(JSON.parse(JSON.stringify(RANGE_OPTIONS))).map(range => {
				range.title = $i18n[range.title]
				return range
			})
		)($i18n)


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

		const newRangeDates = dateRangeGetStandard(rangeNow)

		firstDate = newRangeDates.firstDate
		lastDate = newRangeDates.lastDate

		reportsStoreUpdateRange(firstDate, lastDate)
	}


	function reportsStoreChanged({ firstDate, lastDate }) {
		rangeNow = dateRangeGetStandardForDates(firstDate, lastDate)
	}


	function changeRangeValue(e) {
		rangeNow = e.detail.value
		rangeChanged()
	}


	reportsStoreUpdateRange(firstDate, lastDate)

</script>

<section class="filter-header bp-{$uiStore.breakpoint}">
	<div class="custom-range-wrapper">
		<UiRangePicker 
			bind:firstDate={firstDate}
			bind:lastDate={lastDate}
			on:input={e => changed(e)}
			on:changeRangeValue={e => changeRangeValue(e)} />
	</div>
	{#if $uiStore.breakpoint === 'l'}
		<div class="ranges-wrapper">
			<UiRadio options={RANGE_OPTIONS_I18N} bind:value={rangeNow} on:change={e => rangeChanged()} />
		</div>
	{/if}
</section>


<section class="filter-buttons bp-{$uiStore.breakpoint}">	
	<div class="button-wrapper">
		<UiMultiselect
			label="{$i18n.TASKS}"
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

	.legend-wrapper.bp-l {
		margin:24px auto;
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