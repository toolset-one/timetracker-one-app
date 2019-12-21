<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { i18n } from '../stores/i18n-store.js'
	import { uiStore, uiScrollstopStore } from '../stores/ui-store.js'
	import { userSetStopwatch } from '../stores/user-store.js'
	import { timesStoreDeleteEntry } from '../stores/times-store.js'
	import UiIcon from '../ui/ui-icon.svelte'

	export let data

	const dispatch = createEventDispatcher(),
		ICON_MAP = {
			'delete': 'cross-big',
			'stopwatch': 'clock-big',
			'duration': 'clock-big',
			'task': 'checkmark-big',
			'comment': 'pen-big',
			'neutral': ''
		}

	let el,
		touch = false,
		firstX = 0,
		delta = 0,
		trigger = 'neutral'

	$: LABEL_MAP = {
		'delete': $i18n.DELETE,
		'stopwatch': $i18n.START_STOPWATCH,
		'duration': $i18n.EDIT_DURATION,
		'task': $i18n.EDIT_TASK,
		'comment': $i18n.EDIT_COMMENT,
		'neutral': ''
	}

	onMount(() => {

	})

	function touchstart(e) {
		touch = true
		firstX = e.changedTouches[0].clientX
	}

	function touchmove(e) {
		delta = get(uiScrollstopStore) ? e.changedTouches[0].clientX - firstX : 0

 		if(delta <= -168) {
			trigger = 'comment'
		} else if(delta > -168 && delta <= -108) {
			trigger = 'task'
		} else if(delta > -108 && delta <= -48) {
			trigger = 'duration'
		} else if(delta > -48 && delta <= 48) {
			trigger = 'neutral'
		} else if(delta > 48 && delta <= 180) {
			trigger = 'stopwatch'
		} else if (delta > 180) {
			trigger = 'delete'
		}
	}

	function touchend(e) {
		touch = false
		delta = 0

		if(trigger === 'delete') {
			timesStoreDeleteEntry(data.id)
		} else if(trigger === 'stopwatch') {
			userSetStopwatch(data.id, (Date.now() - data.duration * 1000))
		} else if(trigger === 'duration') {
			dispatch('open', { component: 'mobileDuration', id: data.id })
		} else if(trigger === 'task') {
			dispatch('open', { component: 'mobileTask', id: data.id })
		} else if(trigger === 'comment') {
			dispatch('open', { component: 'mobileComment', id: data.id })
		}

		trigger = 'neutral'
	}
	
</script>

{#if $uiStore.isTouchDevice}
	<div
		class="wrapper {touch ? 'touched' : ''}"
		bind:this={el}
		on:touchstart={e => touchstart(e)}
		on:touchmove={e => touchmove(e)}
		on:touchend={e => touchend(e)}>
	
		<div class="slot" style="transform:translateX({delta}px)">
			<slot></slot>
		</div>

		<div
			class="indicator {trigger} {delta < 0 ? 'right' : 'left'}"
			style="width:{Math.abs(delta)}px">
			{#if trigger != 'neutral'}
				<div class="inner">
					<div class="icon-wrapper">
						<UiIcon type={ICON_MAP[trigger]} size="big" color="#FFF" />
					</div>
					{LABEL_MAP[trigger]}
				</div>
			{/if}
		</div>
	
	</div>
{:else}
	<slot></slot>
{/if}



<style>

	.wrapper {
		position: relative;
		display:block;
		min-width:100%;
		max-width:100%;
		overflow:hidden;
		display:block;
	}

	.touched .slot {
		transition:none;
	}

	.slot {
		display:flex;
		flex-flow:row wrap;
		background:#FFF;
		min-width:100%;
		max-width:100%;
		margin:0;
		transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.indicator {
		position: absolute;
		top:0;
		left:0;
		width:0;
		height:100%;
		transition: background-color 100ms ease;
		overflow:hidden;
	}

	.indicator.right {
		left:auto;
		right:0;
	}

	.indicator.neutral {
		background:var(--c-darkgrey);
	}

	.indicator.stopwatch {
		background:var(--c-blue);
	}

	.indicator.delete {
		background:#B33C24;
	}

	.indicator.duration {
		background:#47A1B3;
	}

	.indicator.task {
		background:#4759B3;
	}

	.indicator.comment {
		background:#7D47B3;
	}

	.indicator .inner {
		position: absolute;
		top:50%;
		left:50%;
		transform:translateX(-50%) translateY(-50%);
		color:#FFF;
		font-size:10px;
		text-align: center;
		line-height:18px;
		white-space: nowrap;
	}

	.icon-wrapper {
		width:24px;
		margin:0 auto;
	}

</style>