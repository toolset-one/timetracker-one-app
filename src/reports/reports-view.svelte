<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiRadio from '../ui/ui-radio.svelte'
	import ReportsBarchart from '../reports/reports-barchart.svelte'


	let TODO

	onMount(() => {

	})

</script>

<section class="filter-header">
	<div class="button-wrapper">
		<UiButton label="Team ▾" />
	</div>
	<div class="button-wrapper">
		<UiButton label="Tasks ▾" />
	</div>
	<div class="button-wrapper">
		<UiButton label="Tags ▾" />
	</div>
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
			July, 2019
		</h2>
	</div>

	<div class="range-wrapper">
		<UiRadio />
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
		width:50%;
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