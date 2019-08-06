<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import UiButton from '../ui/ui-button.svelte'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'

	export let data = {}
	export let first = false
	export let last = false

	let hovered = false,
		isNew = false,
		interval,
		stopwatchDuration = 0

	const dispatch = createEventDispatcher()

	$: hasStopwatch = $userStore.stopwatchEntryId === data.id
	$: displayDuration = hasStopwatch
		? stopwatchDuration
		: data.duration


	onMount(() =>
		isNew = data.created.seconds * 1000 >= Date.now() - 2000
	)

	userStore.subscribe(userData => {
		if(userData.stopwatchEntryId === data.id) {
			interval = setInterval(() => {
				stopwatchDuration = Math.floor((Date.now() - $userStore.stopwatchStartTime) / 1000)
			}, 1000)

			stopwatchDuration = Math.floor((Date.now() - $userStore.stopwatchStartTime) / 1000)
		} else {
			clearInterval(interval)
		}
	})

</script>

	<li
		id="entry-{data.id}"
		in:slide={{ duration: 100, easing: cubicOut }}
		class="
			{first ? 'first' : ''}
			{last ? 'last' : ''}
			{hovered ? 'hovered' : ''}
			{ isNew ? 'new' : ''}
			{ hasStopwatch ? 'has-stopwatch' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}>
		<div class="stopwatch">
			<UiButton
				type="{hasStopwatch ? 'entry has-stopwatch' : 'entry'}"
				icon="{hasStopwatch ? 'pause' : 'play'}"
				hovered={hovered || hasStopwatch}
				color="{hovered || hasStopwatch ? '#26231E' : '#E6E4E1'}"
				on:click={e => userSetStopwatch(data.id, (Date.now() - data.duration * 1000))} />
		</div>
		<div class="duration" on:click={e => !hasStopwatch && dispatch('openDuration', data.id)}>
			<div>
				{dateGetHours(displayDuration)}<span>:</span>{dateGetMinutes(displayDuration)}<small>{dateGetSeconds(displayDuration)}</small>
			</div>
		</div>
		<div class="task" on:click={e => dispatch('openTask', data.id)}>
			<div>
				No Task
			</div>
		</div>
		<div
			class="comment {data.comment.length === 0 ? 'no-comment' : ''}"
			on:click={e => dispatch('openComment', data.id)}>
			<div>
				{data.comment.length > 0 ? data.comment : 'No comment'}
			</div>
		</div>
		<div class="nav">
			<UiButton
				type="entry"
				icon="burger"
				hovered={hovered}
				color="{hovered ? '#26231E' : '#E6E4E1'}"
				on:click={e => dispatch('openContextNav', data.id)} />
		</div>
	</li>
<style>

	li {
		display:flex;
		flex-flow:row wrap;
		position:relative;
		margin:0 0 1px 0;
		padding:0;
		background:#FFF;
		min-height:48px;
		border-radius:3px;
		box-shadow:0 3px 0 -2px rgba(0, 0, 0, .05), 0 1px 3px rgba(0, 0, 0, .1);
	}

	/*li:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		li:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}*/

	.new {
		min-height:0;
	}

	.hovered {
		background:#F5F3F0;
	}

	.first {
		border-top-left-radius:6px;
		border-top-right-radius:6px;
	}

	.last {
		border-bottom-left-radius:6px;
		border-bottom-right-radius:6px;
	}

	.has-stopwatch {
		/* background:#F0F3F5; */
	}

	.has-stopwatch .duration >div, .has-stopwatch.hovered .duration >div {
		min-width:63px;
		background:#477DB3;
		color:#FFF;
		cursor:initial;
		margin-left:-6px;
		padding-left:12px;
		border-top-left-radius:0;
		border-bottom-left-radius:0;
	}

	.has-stopwatch .duration span {
		animation: ticking 2000ms infinite;
	}

	@keyframes ticking {
		0% {
			opacity:1;
		}
		49.9% {
			opacity:1;
		}
		50% {
			opacity:0;
		}
		100% {	
			opacity:0;
		}
	}

	.stopwatch {
		height:48px;
		padding:6px;
	}

	.duration {
		width:68px; /* max length for 44:44:44 */
		height:48px;
		padding:0;
		cursor:pointer;
	}

	.duration:hover >div {
		background:rgba(0, 0, 0, .05);
	}

	.duration >div {
		display:inline-block;
		height:36px;
		line-height:36px;
		margin:6px 0;
		padding:0 6px;
		border-radius: 6px;
		font-size:14px;
		font-weight:600;
	}

	.duration span {
		
	}

	.duration small {
		position: relative;
		top:-3px;
		padding:0 0 0 2px;
		font-size:10px;
		font-weight:600;
	}

	.task {
		padding:6px;
		cursor:pointer;
	}

	.task:hover >div {
		box-shadow: 0 0 0 60px rgba(0, 0, 0, .05) inset;
	}

	.task >div {
		line-height:36px;
		font-size:14px;
		background:#68B359;
		border-radius: 6px;
		padding:0 12px;
		font-weight:600;
		color:#FFF;
	}

	.comment {
		flex: 1;
		padding:0 48px 0 0;
		height:48px;
		cursor:pointer;
		overflow:hidden;
	}

	.comment:hover >div {
		background:rgba(0, 0, 0, .05);
	}

	.comment >div {
		display:inline-block;
		max-width:100%;
		height:36px;
		line-height:36px;
		margin:6px 0;
		padding:0 6px;
		border-radius: 6px;
		font-size:14px;
		font-weight:400;
		white-space: nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}

	.no-comment {
		color:#99938A;
	}

	.nav {
		position: absolute;
		top:0;
		right:0;
		height:48px;
		padding:6px;
		background:#FFF;
	}

	.hovered .nav {
		background:#F5F3F0;
	}

	/* .nav:after {
		content:'';
		display:block;
		position: absolute;
		top:0;
		right:100%;
		width:12px;
		height:100%;
		background: linear-gradient(to left, rgba(245,243,240,1) 0%,rgba(245,243,240,0) 100%);
	}*/
</style>