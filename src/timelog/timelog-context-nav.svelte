<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { getWindowWidth } from '../helpers/helpers.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { timesStoreGetEntry, timesStoreDeleteEntry } from '../stores/times-store.js'

	export let id = null

	const dispatch = createEventDispatcher()

	let right,
		top,
		entryData,
		opened = false

	$: hasStopwatch = $userStore.stopwatchEntryId === id

	onMount(async () => {

		const boundingRect = document.querySelector('#entry-'+ id +' .nav a').getBoundingClientRect()
		top = boundingRect.top
		right = getWindowWidth() - boundingRect.left - 36

		setTimeout(() => {}, 10)

		opened = true

		timesStoreGetEntry(id, data => entryData = data)
	})

	function setStopwatch() {
		userSetStopwatch(id, (Date.now() - entryData.duration * 1000))
	}

</script>

<nav
	style="{
		'top:'+ top +'px;'+
		'right:'+ right +'px;'
	}"
	class="nav-wrapper {opened ? 'opened' : ''}">

	<ul on:click={e => dispatch('close', '')}>
		<li on:click={e => setStopwatch()}>
			{hasStopwatch ? 'Stop' : 'Start'} Stopwatch
		</li>
		<li 
			class="border {hasStopwatch ? 'disabled' : ''}"
			on:click={e => !hasStopwatch ? dispatch('openDuration', id) : ''}>
			Edit Duration
		</li>
		<li on:click={e => dispatch('openProject', id)}>
			Edit Project
		</li>
		<li on:click={e => dispatch('openComment', id)}>
			Edit Comment
		</li>
		<li class="border" on:click={e => timesStoreDeleteEntry(id)}>
			Delete
		</li>
	</ul>
</nav>
<div
	class="backdrop"
	transition:fade="{{delay: 0, duration: 100}}"
	on:click={e => dispatch('close', '')}></div>
<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .15);
		/* -webkit-backdrop-filter: blur(1px); */
		z-index:1000;
	}

	.nav-wrapper {
		position: absolute;
		top:0;
		right:0;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		overflow:hidden;
		height:36px;
		width:36px;
		opacity:0;
		transition: height 100ms ease, width 100ms ease, opacity 100ms ease;
	}

	.opened {
		height:210px;
		width:210px;
		opacity:1;
	}

	.border {
		position: relative;
	}

	.border:after {
		content:'';
		position: absolute;
		bottom:100%;
		left:12px;
		right:12px;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.border:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
	}

	li {
		font-size:14px;
		line-height: 42px;
		white-space: nowrap;
		padding:0 12px;
		cursor: pointer;
		width:210px;
	}

	li:hover {
		background:#F5F3F0;
	}

	li:hover:after {
		display:none;
	}

	li:hover + li:after {
		display:none;
	}

	.disabled {
		color:#99938A;
		cursor:default;
	}
</style>