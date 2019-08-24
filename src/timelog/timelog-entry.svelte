<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import UiButton from '../ui/ui-button.svelte'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { uiStore, uiStopwatchStore } from '../stores/ui-store.js'

	export let data = {}
	export let first = false
	export let last = false

	const PARENT_CONFIG = [{
			'act': 'parent',
			'sel': 'li'
		}] 

	const FIRSTENTRY_FOCUS_CONFIG = JSON.stringify({
		'top': [{
			'act': 'parent',
			'sel': 'body'
		}, {
			'act': 'query',
			'sel': '.add-button-wrapper a'
		}],
		'bottom': [{
			'act': 'next'
		}],
		'left': [{
			'act': 'query',
			'sel': '.nav a'
		}],
		'right': [{
			'act': 'find'
		}],
		'enter': [{
			'act': 'find'
		}]
	})

	const ENTRY_FOCUS_CONFIG = JSON.stringify({
		'top': [{
			'act': 'prev'
		}],
		'bottom': [{
			'act': 'next'
		}],
		'left': [{
			'act': 'query',
			'sel': '.nav a'
		}],
		'right': [{
			'act': 'find'
		}],
		'enter': [{
			'act': 'find'
		}]
	})

	const STOPWATCH_CONFIG = JSON.stringify({
		'top': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'prev'
		}, {
			'act': 'query',
			'sel': '.stopwatch a'
		}],
		'bottom': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'next'
		}, {
			'act': 'query',
			'sel': '.stopwatch a'
		}],
		'left': PARENT_CONFIG,
		'right': [{
			'act': 'parent',
			'sel': '.stopwatch'
		}, {
			'act': 'next'
		}],
		'esc': PARENT_CONFIG
	})


	const DURATION_CONFIG = JSON.stringify({
		'box-y': 6,
		'box-height': -12,
		'top': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'prev'
		}, {
			'act': 'query',
			'sel': '.duration'
		}],
		'bottom': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'next'
		}, {
			'act': 'query',
			'sel': '.duration'
		}],
		'left': [{
			'act': 'prev'
		}, {
			'act': 'find',
		}],
		'right': [{
			'act': 'next'
		}],
		'esc': PARENT_CONFIG
	})


	const TASK_CONFIG = JSON.stringify({
		'box-x': 6,
		'box-width': -12,
		'box-y': 6,
		'box-height': -12,
		'top': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'prev'
		}, {
			'act': 'query',
			'sel': '.task'
		}],
		'bottom': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'next'
		}, {
			'act': 'query',
			'sel': '.task'
		}],
		'left': [{
			'act': 'prev'
		}],
		'right': [{
			'act': 'next'
		}],
		'esc': PARENT_CONFIG
	})


	const COMMENT_CONFIG = JSON.stringify({
		'box-x': 0,
		'box-width': -48,
		'box-y': 6,
		'box-height': -12,
		'top': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'prev'
		}, {
			'act': 'query',
			'sel': '.comment'
		}],
		'bottom': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'next'
		}, {
			'act': 'query',
			'sel': '.comment'
		}],
		'left': [{
			'act': 'prev'
		}],
		'right': [{
			'act': 'next'
		}, {
			'act': 'find'
		}],
		'esc': PARENT_CONFIG
	})

	const CONTEXT_NAV_CONFIG = JSON.stringify({
		'top': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'prev'
		}, {
			'act': 'query',
			'sel': '.nav a'
		}],
		'bottom': [{
			'act': 'parent',
			'sel': 'li'
		}, {
			'act': 'next'
		}, {
			'act': 'query',
			'sel': '.nav a'
		}],
		'left': [{
			'act': 'parent',
			'sel': '.nav'
		}, {
			'act': 'prev'
		}],
		'right': PARENT_CONFIG,
		'esc': PARENT_CONFIG
	})

	let hovered = false,
		focused = false,
		isNew = false,
		interval,
		stopwatchDuration = 0

	$: animationDuration = $uiStore.breakpoint === 'xs' ? 0 : 100

	const dispatch = createEventDispatcher()

	$: hasStopwatch = $userStore.stopwatchEntryId === data.id
	$: taskColor = $tasksStore.json[data.task] ? $tasksStore.json[data.task].color : '#333'


	onMount(() =>
		isNew = data.created.seconds * 1000 >= Date.now() - 2000
	)

	function dispatchDesktopAndKeyboard(event, eventData) {
		const unsubscribe = uiStore.subscribe(data => {
			if(!data.isTouchDevice && data.breakpoint != 'xs') {
				dispatch(event, eventData)
			}
		})
		unsubscribe()
	}


	function dispatchMobileOrTouch(event, eventData) {
		const unsubscribe = uiStore.subscribe(data => {
			if(data.isTouchDevice || data.breakpoint === 'xs') {
				dispatch(event, eventData)
			}
		})
		unsubscribe()
	}

</script>

	<li
		id="entry-{data.id}"
		in:slide={{ duration: animationDuration, easing: cubicOut }}
		class="
			bp-{$uiStore.breakpoint}
			{$uiStore.isTouchDevice ? 'touch' : 'mouse'}
			{first ? 'first' : ''}
			{last ? 'last' : ''}
			{hovered ? 'hovered' : ''}
			{ isNew ? 'new' : ''}
			{ hasStopwatch ? 'has-stopwatch' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}
		on:click={e => dispatchMobileOrTouch('open', { component: 'mobileEntry', id: data.id})}
		on:focusin={e => focused = true}
		on:focusout={e => focused = false}
		tabindex="0"
		data-focus="{first ? FIRSTENTRY_FOCUS_CONFIG : ENTRY_FOCUS_CONFIG}">
		{#if $uiStore.breakpoint != 'xs' && !$uiStore.isTouchDevice}
			<div class="stopwatch">
				<UiButton
					type="{hasStopwatch ? 'entry has-stopwatch' : 'entry'}"
					icon="{hasStopwatch ? 'pause' : 'play'}"
					hovered={hovered || focused || hasStopwatch}
					color="{hovered || focused || hasStopwatch ? '#26231E' : '#E6E4E1'}"
					on:click={e => userSetStopwatch(data.id, (Date.now() - data.duration * 1000))}
					focusConfig={STOPWATCH_CONFIG} />
			</div>
		{/if}
		<div
			class="duration"
			on:click={e => !hasStopwatch && dispatchDesktopAndKeyboard('open', { component: 'duration', id: data.id})}
			tabindex="0"
			data-focus="{DURATION_CONFIG}">
			<div>
				{#if hasStopwatch}
					{$uiStopwatchStore.hours}<span>:</span>{$uiStopwatchStore.minutes}<small>{$uiStopwatchStore.seconds}</small>
				{:else}
					{dateGetHours(data.duration)}<span>:</span>{dateGetMinutes(data.duration)}<small>{dateGetSeconds(data.duration)}</small>
				{/if}
			</div>
		</div>
		<div
			class="task"
			on:click={e => dispatchDesktopAndKeyboard('open', { component: 'task', id: data.id})}
			tabindex="0"
			data-focus="{TASK_CONFIG}">
			<div style="{$uiStore.breakpoint === 'xs' ? 'color' : 'background-color'}:{taskColor};">
				{#if $uiStore.breakpoint === 'xs'}
					<span style="background-color:{taskColor};"></span>
				{/if}

				{(data.task && $tasksStore.json && $tasksStore.json[data.task]) 
					? $tasksStore.json[data.task].title 
					: 'No Task'}
			</div>
		</div>
		<div
			class="comment {data.comment.length === 0 ? 'no-comment' : ''}"
			on:click={e => dispatchDesktopAndKeyboard('open', { component: 'comment', id: data.id})}
			tabindex="0"
			data-focus="{COMMENT_CONFIG}">
			<div>
				{data.comment.length > 0 ? data.comment : 'No comment'}
			</div>
		</div>
		{#if $uiStore.breakpoint != 'xs' && !$uiStore.isTouchDevice}
			<div class="nav">
				<UiButton
					type="entry"
					icon="burger"
					hovered={hovered || focused}
					color="{hovered || focused ? '#26231E' : '#E6E4E1'}"
					on:click={e => dispatch('open', { component: 'contextNav', id: data.id})}
					focusConfig={CONTEXT_NAV_CONFIG} />
			</div>
		{/if}
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
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
		outline:none;
	}

	li.bp-xs {
		box-shadow:none;
		border-radius: 0;
		margin:0;
	}

	li.bp-xs:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		li.bp-xs:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.new {
		min-height:0;
	}

	.first {
		border-top-left-radius:6px;
		border-top-right-radius:6px;
	}

	.last {
		border-bottom-left-radius:6px;
		border-bottom-right-radius:6px;
	}

	.has-stopwatch .duration >div,
	.has-stopwatch.hovered .duration >div {
		min-width:63px;
		background:#477DB3;
		color:#FFF;
		cursor:initial;
		margin-left:-6px;
		padding-left:12px;
		border-top-left-radius:0;
		border-bottom-left-radius:0;
	}

	.bp-xs.has-stopwatch .duration >div,
	.bp-xs.has-stopwatch.hovered .duration >div {
		border-top-left-radius:6px;
		border-bottom-left-radius:6px;
		margin-left:0;
		padding-left:12px;
	}

	.has-stopwatch .duration span {
		animation: ticking 2000ms infinite;
	}

	.mouse.has-stopwatch .duration:hover >div {
		background:#477DB3;
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
		outline:none;
	}

	.bp-xs .duration {
		padding-left:6px;
		width:72px;
	}

	.mouse .duration:hover >div {
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
		outline:none;
	}

	.mouse .task:hover >div {
		box-shadow: 0 0 0 60px rgba(0, 0, 0, .05) inset;
	}

	.task >div {
		position: relative;
		line-height:36px;
		font-size:14px;
		background:transparent;
		border-radius: 6px;
		padding:0 12px;
		font-weight:600;
		color:#FFF;
	}

	.bp-xs .task >div {
		padding-left:18px;
	}

	.task >div span {
		position: absolute;
		top:11px;
		left:0;
		display:block;
		width:12px;
		height:12px;
		border-radius: 3px;
	}

	.comment {
		flex: 1;
		padding:0 48px 0 0;
		height:48px;
		cursor:pointer;
		overflow:hidden;
		outline:none;
	}

	.bp-xs .comment {
		margin-top:-12px;
		flex:none;
		width:100%;
		padding:0 12px 6px 72px;
		height:auto;
	}

	.mouse .comment:hover >div {
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

	.bp-xs .comment >div {
		height:auto;
		line-height:24px;
		white-space:normal;
		overflow:visible;
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
		border-radius: 3px;
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