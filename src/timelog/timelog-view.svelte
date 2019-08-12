<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreControlDate, timesStoreNewTime } from '../stores/times-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateToDatabaseDate } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import TimelogEntry from '../timelog/timelog-entry.svelte'
	import TimelogDurationOverlay from '../timelog/timelog-duration-overlay.svelte'
	import TimelogMobileDurationOverlay from '../timelog/timelog-mobile-duration-overlay.svelte'
	import TimelogTaskOverlay from '../timelog/timelog-task-overlay.svelte'
	import TimelogCommentOverlay from '../timelog/timelog-comment-overlay.svelte'
	import TimelogContextNav from '../timelog/timelog-context-nav.svelte'
	import TimelogEntryOverlay from '../timelog/timelog-entry-overlay.svelte'



	let openedDurationId,
		openedMobileDurationId,
		openTaskId,
		openCommentId,
		openContextNavId,
		openEntryId = 'CHs2Jb2UA1sDEHywKRWk'

	$: dateNow = dateStringToDate($routerStore.subview)
	$: databaseDate = dateToDatabaseDate((dateStringToDate($routerStore.subview)))
	$: isDatabaseDateInDatabase = timesStoreControlDate(databaseDate)

	$: entries = $timesStore.dayIndex[databaseDate] 
		? Object.keys($timesStore.dayIndex[databaseDate]).map(entryId => $timesStore.times[entryId])
		: []
	$: total = entries.reduce((sum, entry) => entry.duration + sum, 0)


	function newEntry() {
		timesStoreNewTime(dateToDatabaseDate(dateNow), success => {

		})
	}

</script>

<header class="bp-{$uiStore.breakpoint}">
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

<ul class="entries bp-{$uiStore.breakpoint}">
	{#each entries as entry, i (entry.id)}
		<TimelogEntry
			data={entry}
			first={i == 0}
			last={i == entries.length - 1}
			on:openDuration={e => openedDurationId = e.detail}
			on:openTask={e => openTaskId = e.detail}
			on:openComment={e => openCommentId = e.detail}
			on:openContextNav={e => openContextNavId = e.detail}
			on:openEntry={e => openEntryId = e.detail} />
	{/each}
</ul>

{#if entries.length > 0}
	<div class="total bp-{$uiStore.breakpoint}">
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
		duration={$timesStore.times[openedDurationId].duration}
		on:close={e => openedDurationId = null} />
{:else if openedMobileDurationId}
	{#if $timesStore.times[openedMobileDurationId]}
	<TimelogMobileDurationOverlay
		id={openedMobileDurationId}
		duration={$timesStore.times[openedMobileDurationId].duration}
		on:close={e => openedMobileDurationId = null} />
	{/if}
{:else if openTaskId}
	<TimelogTaskOverlay
		id={openTaskId}
		task={$timesStore.times[openTaskId].task}
		on:close={e => openTaskId = null} />
{:else if openCommentId}
	<TimelogCommentOverlay
		id={openCommentId}
		comment={$timesStore.times[openCommentId].comment}
		on:close={e => openCommentId = null} />
{:else if openContextNavId}
	<TimelogContextNav
		id={openContextNavId}
		on:close={e => openContextNavId = null}
		on:openDuration={e => openedDurationId = e.detail}
		on:openTask={e => openTaskId = e.detail}
		on:openComment={e => openCommentId = e.detail} />
{:else if openEntryId}
	<TimelogEntryOverlay
		id={openEntryId}
		on:openMobileDuration={e => openedMobileDurationId = e.detail}
		on:close={e => openEntryId = null} />
{/if}

<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	header.bp-xs {
		margin:12px;
	}

	.date-nav {
		display:flex;
		flex-flow: row wrap;
		font-size:0;
		width:50%;
	}

	.bp-xs .date-nav {
		width:100%;
	}

	.button-wrapper {
		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:12px;
	}

	.add-button-wrapper {
		flex: 1;
		text-align: right;
	}

	.bp-xs .add-button-wrapper {
		position:fixed;
		bottom:12px;
		left:50%;
		transform: translateX(-50%);
	}

	.entries {
		position: relative;
		max-width:960px;
		margin:24px auto 12px auto;
		padding:0;
		list-style: none;
	}

	.bp-xs.entries {
		margin:12px auto;
	}

	/* .entries:after {
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
	}*/

	.total {
		max-width:960px;
		margin:18px auto 24px auto;
		padding:0 0 0 54px;
	}

	.bp-xs.total {
		padding:0 0 0 12px;
	}

	.total p {
		font-size:14px;
		line-height:18px;
		font-weight:600;
	}

</style>