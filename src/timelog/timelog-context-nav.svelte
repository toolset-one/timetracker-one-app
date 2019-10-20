<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { getWindowWidth } from '../helpers/helpers.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { timesStoreGetEntry, timesStoreDeleteEntry } from '../stores/times-store.js'

	export let id = null

	const dispatch = createEventDispatcher()

	let firstEl,
		lastEl,
		right,
		top,
		entryData,
		opened = false

	$: hasStopwatch = $userStore.stopwatchEntryId === id

	onMount(() => {

		const boundingRect = document.querySelector('#entry-'+ id +' .nav a').getBoundingClientRect()
		top = boundingRect.top
		right = getWindowWidth() - boundingRect.left - 36

		opened = true

		timesStoreGetEntry(id, data => entryData = data)

		firstEl.focus()

		setTimeout(() => {
			firstEl.dispatchEvent(new CustomEvent('trigger-focus-resize', { bubbles: true }))
		}, 100)
	})

	function setStopwatch() {
		userSetStopwatch(id, (Date.now() - entryData.duration * 1000))
	}

	function keydown(e) {
		if(e.keyCode === 40) {
			if(e.target.nextElementSibling) {
				e.target.nextElementSibling.focus()
			} else {
				firstEl.focus()
			}
		} else if(e.keyCode === 38) {
			if(e.target.previousElementSibling) {
				e.target.previousElementSibling.focus()
			} else {
				lastEl.focus()
			}
		} else if(e.keyCode === 13) {
			e.target.dispatchEvent(new MouseEvent('click', {
				bubbles: false
			}))
		} else if(e.keyCode === 27) {
			dispatch('close', '')
		}
	}

</script>

<nav
	style="{
		'top:'+ top +'px;'+
		'right:'+ right +'px;'
	}"
	class="nav-wrapper {opened ? 'opened' : ''}">

	<ul on:click={e => dispatch('close', '')}>
		<li bind:this={firstEl}
			on:click={e => setStopwatch()}
			tabindex="0"
			data-disable="true"
			on:keydown={e =>keydown(e)}>
			{hasStopwatch ? 'Stop' : 'Start'} Stopwatch
		</li>
		<li 
			class="border {hasStopwatch ? 'disabled' : ''}"
			on:click={e => !hasStopwatch ? dispatch('open', { component: 'duration', id}) : ''}
			tabindex="0"
			data-disable="true"
			on:keydown={e =>keydown(e)}>
			Edit Duration
		</li>
		<li on:click={e => dispatch('open', { component: 'task', id})}
			tabindex="0"
			data-disable="true"
			on:keydown={e =>keydown(e)}>
			Edit Task
		</li>
		<li on:click={e => dispatch('open', { component: 'comment', id})}
			tabindex="0"
			data-disable="true"
			on:keydown={e =>keydown(e)}>
			Edit Comment
		</li>
		<li bind:this={lastEl} class="border" on:click={e => timesStoreDeleteEntry(id)}
			tabindex="0"
			data-disable="true"
			on:keydown={e =>keydown(e)}>
			Delete
		</li>
	</ul>
</nav>

<style>
	.nav-wrapper {
		position: absolute;
		top:0;
		right:0;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:var(--shadow-overlay);
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
			background:var(--c-grey);
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
		background:var(--c-hover-grey);
	}

	li:hover:after {
		display:none;
	}

	li:hover + li:after {
		display:none;
	}

	.disabled {
		color:var(--c-greyed-out);
		cursor:default;
	}
</style>