<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { mobileOverlayTransition } from '../helpers/animations.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { timesStore, timesStoreGetEntry, timesStoreDeleteEntry } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'
	import { uiStopwatchStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiIcon from '../ui/ui-icon.svelte'

	export let id = null

	const dispatch = createEventDispatcher()

	let hovered = false,
		interval,
		stopwatchDuration = 0

	$: entryData = $timesStore.times ? $timesStore.times[id] : {
		task: null
	}

	$: hasStopwatch = $userStore.stopwatchEntryId === id

	onMount(async () => {
		timesStoreGetEntry(id, data => entryData = data)
	})

	function setStopwatch() {
		userSetStopwatch(id, (Date.now() - entryData.duration * 1000))
	}

	function openDuration(e) {
		e.stopPropagation()

		if(hasStopwatch) {
			userSetStopwatch(id, (Date.now() - entryData.duration * 1000))
		}

		dispatch('open', {
			component: 'mobileDuration',
			id
		})
	}

	function openTask(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileTask',
			id
		})
	}

	function openComment(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileComment',
			id
		})
	}


	function close() {
		dispatch('close', '')
	}

	export function externalClose() {
		close()
	}

</script>

<div class="wrapper" transition:mobileOverlayTransition>
	<div
		class="attr duration"
		on:click={e => openDuration(e)}>
		<div class="attr-icon">
			<UiIcon type='clock-big' size="big" color="#26231E" />
		</div>
		<span class="attr-value">
			{#if hasStopwatch}
				{$uiStopwatchStore.hours}<span>:</span>{$uiStopwatchStore.minutes}<small>{$uiStopwatchStore.seconds}</small>
			{:else}
				{dateGetHours(entryData.duration)}<span>:</span>{dateGetMinutes(entryData.duration)}<small>{dateGetSeconds(entryData.duration)}</small>
			{/if}
		</span>
		<div class="attr-button">
			<UiButton
				type="icon"
				icon="{hasStopwatch ? 'pause' : 'play'}"
				hovered={hovered || hasStopwatch}
				color="#26231E"
				on:click={e => userSetStopwatch(id, (Date.now() - entryData.duration * 1000))} />
		</div>
	</div>
	<div class="attr task"
		on:click={e => openTask(e)}>
		<div class="attr-icon">
			<UiIcon type='checkmark-big' size="big" />
		</div>
		<span class="attr-value">
			{(entryData && entryData.task && $tasksStore.json && $tasksStore.json[entryData.task]) 
					? $tasksStore.json[entryData.task].title.length > 0 ? $tasksStore.json[entryData.task].title : 'No Title' 
					: 'No Task'}
		</span>
	</div>
	<div
		class="attr comment"
		on:click={e => openComment(e)}>
		<div class="attr-icon">
			<UiIcon type='pen-big' size="big" />
		</div>
		<span class="attr-value">
			{entryData && entryData.comment.length > 0 ? entryData.comment : 'No comment'}
		</span>
	</div>

	<footer>
		<UiButton
			label="Delete"
			color="red"
			on:click={e => timesStoreDeleteEntry(id) && dispatch('close')} />
	</footer>
</div>

<style>
	.wrapper {
		position: fixed;
		bottom:0;
		left:50%;
		max-width:480px;
		width:96.25%;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		transition: transform 200ms ease, opacity 200ms ease;
		transform:translateX(-50%);
	}

	.attr {
		position: relative;
		padding:12px;
		display:flex;
		flex-direction: row wrap;
	}

	.attr:after {
		content:'';
		position: absolute;
		bottom:0;
		left:54px;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.attr:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.attr-icon {
		padding:9px;
		width:42px;
		height:42px;
	}

	.attr-value {
		flex:1;
		line-height:42px;
		font-size:16.5px;
		font-weight:400;
	}

	.attr.comment .attr-value {
		line-height:24px;
		padding:9px 0;
	}

	.attr-value small {
		position: relative;
		top:-5px;
		padding:0 0 0 2px;
		font-size:10px;
		font-weight:600;
	}

	.attr-button {
		height:42px;
	}

	footer {
		padding:12px;
		text-align: right;
	}
</style>