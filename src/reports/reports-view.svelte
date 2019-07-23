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

<section>
	<UiRadio />
</section>


<section class="date-nav">
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
</section>

<section>
	<ReportsBarchart />
</section>



<style>

	section {
		display:flex;
		flex-flow: row wrap;
		max-width:960px;
		margin:18px auto 18px auto;
	}

	.date-nav {
		font-size:0;
	}

	.button-wrapper {

		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:24px;
	}

</style>