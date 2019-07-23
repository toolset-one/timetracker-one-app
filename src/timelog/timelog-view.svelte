<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import TimelogEntry from '../timelog/timelog-entry.svelte'
	import TimelogDurationOverlay from '../timelog/timelog-duration-overlay.svelte'
	import TimelogProjectOverlay from '../timelog/timelog-project-overlay.svelte'
	import TimelogCommentOverlay from '../timelog/timelog-comment-overlay.svelte'
	import TimelogContextNav from '../timelog/timelog-context-nav.svelte'



	let openedDurationId,
		openProjectId,
		openCommentId,
		openContextNavId

	$: dateNow = dateStringToDate($routerStore.subview)
	$: entries = $timesStore.array.filter(entry => entry.day === $routerStore.subview)
	$: total = entries.reduce((sum, entry) => entry.duration + sum, 0)

	onMount(() => {

	})

	function newEntry() {
		timesStoreNewTime(dateToDatestring(dateNow), success => {

		})
	}

</script>

<header>
	<div class="date-nav">
		<div class="button-wrapper">
			<UiButton 
				type="icon" 
				icon="arrow-left" 
				link="/timelog/{dateToDatestring(datePrevDate(dateNow))}/" />
		</div>
		<div class="button-wrapper">
			<UiButton 
				type="icon"
				icon="arrow-right"
				link="/timelog/{dateToDatestring(dateNextDate(dateNow))}/" />
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
	{#each entries as entry, i (entry.id)}
		<TimelogEntry
			data={entry}
			on:openDuration={e => openedDurationId = e.detail}
			on:openProject={e => openProjectId = e.detail}
			on:openComment={e => openCommentId = e.detail}
			on:openContextNav={e => openContextNavId = e.detail} />
	{/each}
</ul>

{#if entries.length > 0}
	<div class="total">
		<p>
			{dateGetHours(total)}:{dateGetMinutes(total)} total
		</p>
	</div>
{:else}
	<p style="text-align: center;padding:42px 20px;">
		No tracked hours for this day.
	</p>
{/if}


{#if openedDurationId}
	<TimelogDurationOverlay
		id={openedDurationId}
		duration={$timesStore.json[openedDurationId].duration}
		on:close={e => openedDurationId = null} />
{:else if openProjectId}
	<TimelogProjectOverlay
		id={openProjectId}
		project={$timesStore.json[openProjectId].project}
		on:close={e => openProjectId = null} />
{:else if openCommentId}
	<TimelogCommentOverlay
		id={openCommentId}
		comment={$timesStore.json[openCommentId].comment}
		on:close={e => openCommentId = null} />
{:else if openContextNavId}
	<TimelogContextNav
		id={openContextNavId}
		on:close={e => openContextNavId = null}
		on:openDuration={e => openedDurationId = e.detail}
		on:openProject={e => openProjectId = e.detail}
		on:openComment={e => openCommentId = e.detail} />
{/if}

<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
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
		max-width:960px;
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
		max-width:960px;
		margin:18px auto 24px auto;
		padding:0 0 0 54px;
	}

	.total p {
		font-size:14px;
		line-height:18px;
		font-weight:600;
	}

</style>