<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { uiStore, uiScrollstopStore } from '../stores/ui-store.js'
	import { userStore, userStopwatchStore } from '../stores/user-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateToDatabaseDate } from '../helpers/helpers.js'
	import { sws } from '../helpers/sws-client.js'

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

	$: entries = $timesStore.times.sort((a, b) => b.createdAt - a.createdAt)
	$: total = entries.reduce((sum, entry) => {
		return sum + ($userStore.stopwatchEntryId === entry.id ? $userStopwatchStore : entry.duration)
	}, 0)

	$: entryActive = entries.find(entry => entry.id === entryIdActive)

	let entries = []


	onMount(() => {
	
	})


	function newEntry() {
		timesStoreNewTime(dateToDatabaseDate(dateNow), success => {

		})
	}

	function openOverlayComponent(e) {
		overlayComponent = overlays[e.component]
		entryIdActive = e.id
	}

	let scrollPosStart = 0,
		scrollStopDecision = false,
		startX = 0,
		startY = 0

	function touchstart(e) {
		startX = e.changedTouches[0].clientX
		startY = e.changedTouches[0].clientY

		scrollPosStart = document.querySelector('body').scrollTop
	}

	function touchmove(e) {
		e.stopPropagation()

		if( !scrollStopDecision) {
			let xAbs = Math.abs(startX - e.changedTouches[0].clientX)
			let yAbs = Math.abs(startY - e.changedTouches[0].clientY)
			if(xAbs > yAbs) {
				document.querySelector('body').style.overflow = 'hidden'
				uiScrollstopStore.set(true)
			} else {
				uiScrollstopStore.set(false)
			}
			scrollStopDecision = true
		}
	}

	function touchend(e) {
		if(get(uiScrollstopStore)) {
			document.querySelector('body').setAttribute('style', null)		
		}
		scrollStopDecision = false	
		uiScrollstopStore.set(false)
	}

</script>

<svelte:body
	on:touchstart={touchstart}
	on:touchmove={touchmove}
	on:touchend={touchend}
/>

<header class="bp-{$uiStore.breakpoint}">
	<div class="date-nav">
		<div class="button-wrapper">
			<UiButton 
				type="icon" 
				icon="arrow-left" 
				link="/timelog/{dateToDatestring(datePrevDate(dateNow))}/"
				focusConfig="TIMELOG_HEADER_ARROW_LEFT" />
		</div>
		<div class="button-wrapper">
			<UiButton 
				type="icon"
				icon="arrow-right"
				link="/timelog/{dateToDatestring(dateNextDate(dateNow))}/"
				focusConfig="TIMELOG_HEADER_ARROW_RIGHT" />
		</div>
		<h2>
			{dateGetHumanDate(dateNow)}
		</h2>
	</div>
	<div class="add-button-wrapper">
		<UiButton
			label="Add Entry"
			on:click={e => newEntry()}
			focusConfig="TIMELOG_HEADER_ADD"
			type="{$uiStore.breakpoint === 'xs' ? 'dark' : 'default'}" />
	</div>
</header>
{#if $uiStore.breakpoint === 'xs'}
	<div class="spacer"></div>
{/if}

{#if entries.length > 0}

	<ul class="entries bp-{$uiStore.breakpoint}">
		{#each entries as entry, i (entry.id)}
			<TimelogEntry
				data={entry}
				first={i == 0}
				last={i == entries.length - 1}
				on:open={e => openOverlayComponent(e.detail)} />
		{/each}
	</ul>

	<div class="total bp-{$uiStore.breakpoint}">
		<p>
			{dateGetHours(total)}:{dateGetMinutes(total)} total
		</p>
	</div>
{:else}
	<div class="container">
		<h3>
			No tracked hours for this day.
		</h3>
		<p>
			To track some time, please use the button saying "Add Entry". If you need help how to use timetracker.one, please <a href="https://timetracker.one/help/" target="_blank" data-config="TIMELOG_EMPTY_STATE_LINK">click here</a>.
		</p>
	</div>
{/if}


{#if overlayComponent && entryActive}
	<svelte:component
		this={overlayComponent}
		bind:this={overlayEl}
		id={entryIdActive}
		duration={entryActive.duration}
		task={entryActive.task}
		comment={entryActive.comment}
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
		margin:0 auto 12px auto;
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

	.container {
		max-width:960px;
		position: relative;
		margin:0 auto 24px auto;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
	}

	.container h3 {
		padding:24px 0 0 0;
		text-align: center;
	}

	.container p {
		text-align: center;
		max-width: 600px;
		margin:0 auto;
	}

</style>