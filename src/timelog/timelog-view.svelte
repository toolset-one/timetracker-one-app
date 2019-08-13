<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreControlDate, timesStoreNewTime } from '../stores/times-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateToDatabaseDate } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiBackdrop from '../ui/ui-backdrop.svelte'

	import TimelogEntry from '../timelog/timelog-entry.svelte'
	import TimelogDurationOverlay from '../timelog/timelog-duration-overlay.svelte'
	import TimelogMobileDurationOverlay from '../timelog/timelog-mobile-duration-overlay.svelte'
	import TimelogTaskOverlay from '../timelog/timelog-task-overlay.svelte'
	import TimelogMobileTaskOverlay from '../timelog/timelog-mobile-task-overlay.svelte'
	import TimelogCommentOverlay from '../timelog/timelog-comment-overlay.svelte'
	import TimelogMobileCommentOverlay from '../timelog/timelog-mobile-comment-overlay.svelte'
	import TimelogContextNav from '../timelog/timelog-context-nav.svelte'
	import TimelogEntryOverlay from '../timelog/timelog-entry-overlay.svelte'



	let openedDurationId,
		openedMobileDurationId,
		openTaskId,
		openedMobileTaskId,
		openCommentId,
		openContextNavId,
		openEntryId,
		testEl

	let overlays = {
		mobileEntry: TimelogEntryOverlay,
		mobileDuration: TimelogMobileDurationOverlay,
		mobileTask: TimelogMobileTaskOverlay,
		mobileComment: TimelogMobileCommentOverlay,

		duration: TimelogDurationOverlay,
		task: TimelogTaskOverlay,
		comment: TimelogCommentOverlay,
		contextNav: TimelogContextNav
	},
	overlayEl,
	overlayComponent,
	entryIdActive

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

	function openOverlayComponent(e) {
		overlayComponent = overlays[e.component]
		entryIdActive = e.id
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
{#if $uiStore.breakpoint === 'xs'}
	<div class="spacer"></div>
{/if}

<ul class="entries bp-{$uiStore.breakpoint}">
	{#each entries as entry, i (entry.id)}
		<TimelogEntry
			data={entry}
			first={i == 0}
			last={i == entries.length - 1}
			on:open={e => openOverlayComponent(e.detail)} />
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

<!-- on:open={e => openOverlayComponent(e.detail)} -->

{#if overlayComponent && $timesStore.times[entryIdActive]}
	<svelte:component
		this={overlayComponent}
		bind:this={overlayEl}
		id={entryIdActive}
		duration={$timesStore.times[entryIdActive].duration}
		task={$timesStore.times[entryIdActive].task}
		comment={$timesStore.times[entryIdActive].comment}
		on:open={e => openOverlayComponent(e.detail)}
		on:close={e => {
			overlayComponent = null
			entryIdActive = null
		}} />

	<UiBackdrop
		on:close={e => {
			if(overlayEl.externalClose) {
				overlayEl.externalClose()
			} else {
				overlayComponent = null
				entryIdActive = null
			}
		}} />
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
		margin:0;
		padding:12px;
		height:66px;
		position: fixed;
		top:0;
		left:0;
		width:100%;
		z-index:500;
		background: linear-gradient(to bottom, rgba(247, 245, 242, 1) 57px,rgba(247, 245, 242, 0) 66px);
	}

	.spacer {
		height:66px;
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
		bottom:60px;
		left:50%;
		transform: translateX(-50%);
		z-index: 500;
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

	.total {
		max-width:960px;
		margin:18px auto 24px auto;
		padding:0 0 0 54px;
	}

	.bp-xs.total {
		padding:0 0 90px 12px;
	}

	.total p {
		font-size:14px;
		line-height:18px;
		font-weight:600;
	}

</style>