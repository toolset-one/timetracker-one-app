<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'
	import { i18n } from '../stores/i18n-store.js'
	import { userStore, userSetStopwatch } from '../stores/user-store.js'
	import { tasksStore } from '../stores/tasks-store.js'
	import { timesStoreDeleteEntry } from '../stores/times-store.js'
	import { uiStore, uiStopwatchStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import TimelogEntrySwiper from '../timelog/timelog-entry-swiper.svelte'

	export let data = {}
	export let first = false
	export let last = false


	let el,
		hovered = false,
		focused = false,
		isNew = false,
		interval,
		stopwatchDuration = 0

	$: animationDuration = $uiStore.breakpoint === 'xs' ? 0 : 100

	const dispatch = createEventDispatcher()

	$: hasStopwatch = $userStore.stopwatchEntryId === data.id
	$: taskColor = $tasksStore.json[data.task] ? $tasksStore.json[data.task].color : '#333'


	onMount(() => {
		isNew = (new Date(data.createdAt)).getTime() >= Date.now() - 2000

		if(!isNew) {
			el.removeAttribute('style')
		}
	})

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
		bind:this={el}
		id="entry-{data.id}"
		data-id="{data.id}"
		in:slide={{ duration: 100, easing: cubicOut }}
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
		data-config="TIMELOG_ENTRY"
		data-top={first ? 'TIMELOG_ENTRY__TO_ADD' : null}>
		

<TimelogEntrySwiper data={data} on:open={e => dispatch('open', e.detail)}>

		{#if $uiStore.breakpoint != 'xs' && !$uiStore.isTouchDevice}

			<div class="stopwatch">
				<UiButton
					type="{hasStopwatch ? 'entry has-stopwatch' : 'entry'}"
					icon="{hasStopwatch ? 'pause' : 'play'}"
					hovered={hovered || focused || hasStopwatch}
					color="{hovered || focused || hasStopwatch ? 'var(--c-darkgrey)' : '#E6E4E1'}"
					on:click={e => userSetStopwatch(data.id, (Date.now() - data.duration * 1000))}
					focusConfig="TIMELOG_ENTRY_STOPWATCH"
					focusTop={first ? 'TIMELOG_ENTRY__TO_ADD' : null} />
			</div>
		{/if}
		<div
			class="duration"
			on:click={e => !hasStopwatch && dispatchDesktopAndKeyboard('open', { component: 'duration', id: data.id})}
			tabindex="0"
			data-config="TIMELOG_ENTRY_DURATION"
			data-top={first ? 'TIMELOG_ENTRY__TO_ADD' : null}>
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
			data-config="TIMELOG_ENTRY_TASK"
			data-top={first ? 'TIMELOG_ENTRY__TO_ADD' : null}>
			<div style="{$uiStore.breakpoint === 'xs' ? 'color' : 'background-color'}:{taskColor};">
				{#if $uiStore.breakpoint === 'xs'}
					<span style="background-color:{taskColor};"></span>
				{/if}

				{(data.task && $tasksStore.json && $tasksStore.json[data.task]) 
					? $tasksStore.json[data.task].title.length > 0 ? $tasksStore.json[data.task].title : $i18n.NO_TITLE
					: $i18n.NO_TASK}
			</div>
		</div>
		<div
			class="comment {data.comment.length === 0 ? 'no-comment' : ''}"
			on:click={e => dispatchDesktopAndKeyboard('open', { component: 'comment', id: data.id})}
			tabindex="0"
			data-config="TIMELOG_ENTRY_COMMENT"
			data-top={first ? 'TIMELOG_ENTRY__TO_ADD' : null}>
			<div>
				{data.comment.length > 0 ? data.comment : $i18n.NO_COMMENT}
			</div>
		</div>
		{#if $uiStore.breakpoint != 'xs' && !$uiStore.isTouchDevice}
			<div class="nav">
				<UiButton
					type="entry"
					icon="burger"
					hovered={hovered || focused}
					color="{hovered || focused ? 'var(--c-darkgrey)' : '#E6E4E1'}"
					on:click={e => dispatch('open', { component: 'contextNav', id: data.id})}
					focusConfig="TIMELOG_ENTRY_CONEXTNAV"
					focusTop={first ? 'TIMELOG_ENTRY__TO_ADD' : null} />
			</div>
		{/if}

</TimelogEntrySwiper>


	</li>
<style>

	li {
		display:flex;
		flex-flow:row wrap;
		position:relative;
		margin:0 0 0 0;
		padding:0;
		background:#FFF;
		border-radius:0;
		box-shadow:var(--shadow-box);
		outline:none;
	}

	li.bp-xs {
		box-shadow:none;
		border-radius: 0;
		margin:0;
	}

	li:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	li.bp-l:after {
		left:6px;
		right:6px;
		width:auto;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		li:after {
			background:var(--c-grey);
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
		background:var(--c-blue);
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
		background:var(--c-blue);
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
		color:var(--c-greyed-out);
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