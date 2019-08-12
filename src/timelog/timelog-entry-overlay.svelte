<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { getWindowWidth } from '../helpers/helpers.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { timesStore, timesStoreGetEntry, timesStoreDeleteEntry } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiIcon from '../ui/ui-icon.svelte'

	export let id = null

	const dispatch = createEventDispatcher()

	let opened = false,
		hovered = false,
		interval,
		stopwatchDuration = 0,
		offset = false

	$: entryData = $timesStore.times ? $timesStore.times[id] : {
		task: null
	}

	$: hasStopwatch = $userStore.stopwatchEntryId === id
	$: displayDuration = hasStopwatch
		? stopwatchDuration
		: entryData ? entryData.duration : 0

	onMount(async () => {
		opened = true

		timesStoreGetEntry(id, data => entryData = data)
	})

	function setStopwatch() {
		userSetStopwatch(id, (Date.now() - entryData.duration * 1000))
	}

	userStore.subscribe(userData => {
		if(userData.stopwatchEntryId === id) {
			interval = setInterval(() => {
				stopwatchDuration = Math.floor((Date.now() - $userStore.stopwatchStartTime) / 1000)
			}, 1000)

			stopwatchDuration = Math.floor((Date.now() - $userStore.stopwatchStartTime) / 1000)
		} else {
			clearInterval(interval)
		}
	})

	function openDuration(e) {
		console.log('T')
		e.stopPropagation()
		offset = true
		dispatch('openMobileDuration', id)
	}


	function close() {
		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
	}

</script>

<div class="wrapper {opened ? 'opened' : ''} {offset ? 'offset' : ''}">
	<!--<header>
		Edit Time {id}

		<div class="icon" on:click={e => close()}>
			<UiIcon type='cross' />
		</div>
	</header>-->


	<div
		class="attr duration"
		on:click={e => openDuration(e)}>
		<div class="attr-icon">
			<UiIcon type='clock-big' size="big" color="#26231E" />
		</div>
		<span class="attr-value">
			{dateGetHours(displayDuration)}<span>:</span>{dateGetMinutes(displayDuration)}<small>{dateGetSeconds(displayDuration)}</small>
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
	<div class="attr task">
		<div class="attr-icon">
			<UiIcon type='checkmark-big' size="big" />
		</div>
		<span class="attr-value">
			{(entryData && entryData.task && $tasksStore.json && $tasksStore.json[entryData.task]) 
					? $tasksStore.json[entryData.task].title 
					: 'No Task'}
		</span>
	</div>
	<div class="attr comment">
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
			on:click={e => timesStoreDeleteEntry(id)} />
	</footer>
</div>
<div
	class="backdrop"
	transition:fade="{{delay: 0, duration: 100}}"
	on:click={e => close()}></div>
<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .5);
		z-index:1000;
	}

	.wrapper {
		position: fixed;
		bottom:0;
		left:12px;
		right:12px;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		opacity:0;
		transform:translateY(100%);
		transition: transform 200ms ease, opacity 200ms ease;
	}

	.offset {
		margin:0 -6px -6px 0;
	}

	.opened {
		transform:translateY(0);
		opacity:1;
	}

	header {
		position: relative;
		height:42px;
		background:#FaFaFa;
		line-height: 42px;
		font-size:14px;
		padding:0 12px;
	}

	header .icon {
		position: absolute;
		top:0;
		right:0;
		padding:15px;
		cursor: pointer;
	}

	header:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		header:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
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