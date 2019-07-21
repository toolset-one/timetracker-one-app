<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import TimelogEntry from '../timelog/timelog-entry.svelte'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate } from '../helpers/helpers.js'

	let newData = {
		duration: 0,
		comment: ''
	}

	let entries = [{
		duration: 0,
		comment: 'Wirklich jetze?'
	}, {
		duration: 2400,
		comment: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.'
	}]

	$: dateNow = dateStringToDate($routerStore.subview)

	onMount(() => {
		console.log($routerStore.subview)
	})

	function newEntry() {
		entries = [...entries, newData]
	}

</script>

	<header>
		<div class="date-nav">
			<div class="button-wrapper">
				<UiButton 
					type="icon" 
					icon="arrow-left" 
					on:click={e => Page('/timelog/' + dateToDatestring(datePrevDate(dateNow)) + '/')} />
			</div>
			<div class="button-wrapper">
				<UiButton 
					type="icon"
					icon="arrow-right"
					on:click={e => Page('/timelog/' + dateToDatestring(dateNextDate(dateNow)) + '/')} />
			</div>
			<h2>
				{dateGetHumanDate(dateNow)}
			</h2>
		</div>
		<div class="add-button-wrapper">
			<UiButton label="Add Entry" on:click={e => newEntry()} />
		</div>
	</header>

	<ul class="entries">
		{#each entries as entry}
			<TimelogEntry data={entry} />
		{/each}
	</ul>

	<div class="total">
			<p>
				1:08 total
			</p>
	</div>

<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:900px;
		margin:60px auto 24px auto;
	}

	.date-nav {
		display:flex;
		flex-flow: row wrap;
		font-size:0;
		width:50%;
	}

	.button-wrapper {

		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:24px;
	}

	.add-button-wrapper {
		flex: 1;
		text-align: right;
	}

	.entries {
		position: relative;
		max-width:900px;
		margin:24px auto 12px auto;
		padding:0;
		list-style: none;
	}

	.entries:after {
		content:'';
		position: absolute;
		top:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.entries:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 0;
		}
	}

	.total {
		max-width:900px;
		margin:18px auto 24px auto;
		padding:0 0 0 54px;
	}

	.total p {
		font-size:14px;
		line-height:18px;
		font-weight:700;
	}

</style>