<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { routerStore } from '../stores/router-store.js'

	import UiIcon from './ui-icon.svelte'

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let type = 'default'
	export let icon = 'arrow-left'
	export let hovered = false
	export let color = '#26231E'
	export let link = null

	export let value = 'week'
	export let options = [{
		title: 'Week Bla Bla',
		value: 'week'
	}, {
		title: 'Month',
		value: 'month'
	}, {
		title: 'Year',
		value: 'year'
	}]

	let el,
		optionEls = {},
		hover = false,
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}

	$: activeBoundingRect = optionEls[value]
		? optionEls[value].getBoundingClientRect() 
		: {
		top: 0,
		left: 0
	}

	$: activeWidth = activeBoundingRect.width + 2
	$: activeLeft = activeBoundingRect.left - boundingRect.left - 2

	function click(e) {
		if(!link) {
			e.preventDefault()
		}
		dispatch('click', '')
	}

</script>

<div
	class="radio-wrapper"
	style="{
		'--x:'+ (mousePosition.x - boundingRect.left) +'px;' +
		'--y:'+ (mousePosition.y - boundingRect.top) +'px;'
	}"
	bind:this={el}
	on:mouseenter={e => hover = true}
	on:mouseleave={e => hover = false}
	on:mousemove={e => mousePosition = {
		x: e.pageX,
		y: e.pageY
	}}>
	<em></em>
	<div class="inner">
		<div class="indicator" style="{
			'width:'+ activeWidth +'px;' +
			'left:'+ activeLeft +'px;'
		}"></div>
		{#each options as option}
			<div
				bind:this={optionEls[option.value]}
				class="option {option.value === value ? 'active' : ''}"
				on:click={e => value = option.value}>
				{option.title}
			</div>
		{/each}
	</div>
</div>

<style>
	.radio-wrapper {
		display:inline-block;
		position: relative;
		padding:1px;
		border:0;
		border-radius: 6px;
		background:#CCC9C4;
		cursor: pointer;
		transition: all 100ms ease;
		outline:none;
	}

	.inner {
		position: relative;
		display: block;
		height:40px;
		border-radius: 5px;
		background:#FAF9F7;
		padding:0;
		/* box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05) inset; */
	}

	em {
		display:block;
		width:100%;
		height:100%;
		position: absolute;
		top:0;
		left:0;
		background:transparent;
		border-radius: 6px;
		overflow:hidden;
	}

	em:after {
		content: '';
		display:block;
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: 120px;
		height: 120px;
		background: radial-gradient(circle closest-side, #FAD000, transparent);
		transform: translate(-50%, -50%) scale(0);
		transition: transform 500ms ease;
		pointer-events: none;
	}

	.radio-wrapper:hover em:after {
		transform: translate(-50%, -50%) scale(1);
	}

	.option {
		position:relative;
		z-index: 100;
		border-radius: 5px;
		line-height:40px;
		padding:0 18px;
		font-size:14px;
		font-weight:600;
		color:#99938A;
		float:left;
		transition: all 100ms ease;
	}

	.option:hover, .option.active {
		color:#26231E;
	}

	.indicator {
		width:48px;
		height:100%;
		position: absolute;
		top:0;
		left:0;

		background:#FFF;
		border-left:#CCC9C4 1px solid;
		border-right:#CCC9C4 1px solid;
		border-radius: 5px;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
		transition: all 100ms ease;
	}

</style>