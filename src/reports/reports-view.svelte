<script>
	import { onMount, afterUpdate } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { reportsStore, reportsStoreUpdateDate, reportsStoreBarchartData, reportsStoreSetPeriod } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateGetWeek, dateGetMonth } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiMultiselect from '../ui/ui-multiselect.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'
	import ReportsDistribution from '../reports/reports-distribution.svelte'
	import UiRangePicker from '../ui/ui-range-picker.svelte'

	let filterTasks,
		filterTasksLength = 0,
		scrollToDateFunction,
		firstDate = getFirstDate(),
		lastDate = dateNextDate(firstDate, 7)

	$: tasksToFilter = [...$tasksStore.array, {
		title: 'No Task',
		id: null
	}]

	function getFirstDate() {
		let firstDateTmp = new Date()

		while(dateGetWeek(datePrevDate(firstDateTmp)) === dateGetWeek(firstDateTmp)) {
			firstDateTmp = datePrevDate(firstDateTmp)
		}

		// Temp
		setTimeout(() => {
			scrollToDateFunction(firstDateTmp)
		})
		
		return firstDateTmp
	}

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
		reportsStoreUpdateDate(e.detail.firstDate)
		scrollToDateFunction(e.detail.firstDate)
	}


	reportsStoreUpdateDate(firstDate)

</script>

<section class="filter-header bp-{$uiStore.breakpoint}">
	<div class="mobile-range-wrapper">
		<UiRangePicker 
			bind:firstDate={firstDate}
			bind:lastDate={lastDate}
			on:input={e => changed(e)}/>
	</div>

	<div class="spacer"></div>

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
	<ReportsBarchart bind:scrollToDate={scrollToDateFunction} />
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

	.spacer {
		flex:1;
	}

	.mobile-range-wrapper {
	
	}

	.bp-l .mobile-range-wrapper {

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
		margin:48px 12px;
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