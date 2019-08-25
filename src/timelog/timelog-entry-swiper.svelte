<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { uiStore } from '../stores/ui-store.js'
	import { userSetStopwatch } from '../stores/user-store.js'
	import { timesStoreDeleteEntry } from '../stores/times-store.js'

	export let data

	const dispatch = createEventDispatcher()

	let el,
		touch = false,
		firstX = 0,
		delta = 0,
		trigger = 'neutral'

	onMount(() => {
		if(el) {
			el.scrollLeft = el.getBoundingClientRect().width
		}
	})


	function scroll(e) {
		console.log(el.scrollLeft)

		/*if(false && !touch) {
			const scrollPercentage = el.scrollLeft / el.getBoundingClientRect().width

			if(scrollPercentage < 0.5 || scrollPercentage > 1.5) {
				scrollCanceled = true
				el.scrollLeft = el.getBoundingClientRect().width
				setTimeout(() => {
					scrollCanceled = false
				})
			}
		}*/
	
		/*

{e => userSetStopwatch(data.id, (Date.now() - data.duration * 1000))}

		*/

	}

	function touchstart(e) {
		touch = true
		firstX = e.changedTouches[0].clientX
	}

	function touchmove(e) {
		delta = e.changedTouches[0].clientX - firstX

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
	}
	
</script>

{#if $uiStore.isTouchDevice}
	<div
		class="wrapper {touch ? 'touched' : ''}"
		bind:this={el}
		on:scroll={e => scroll(e)}
		on:touchstart={e => touchstart(e)}
		on:touchmove={e => touchmove(e)}
		on:touchend={e => touchend(e)}>
	
		<div class="slot" style="transform:translateX({delta}px)">
			<slot></slot>
		</div>

		<div
			class="indicator {trigger} {delta < 0 ? 'right' : 'left'}"
			style="width:{Math.abs(delta)}px"></div>
	
	</div>
{:else}
	<slot></slot>
{/if}



<style>

	.wrapper {
		position: relative;
		display:block;
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
	}

	.indicator.right {
		left:auto;
		right:0;
	}

	.indicator.neutral {
		background:#26231E;
	}

	.indicator.stopwatch {
		background:#477DB3;
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

</style>