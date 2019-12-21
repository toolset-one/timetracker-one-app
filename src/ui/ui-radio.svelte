<script>
	import { createEventDispatcher } from 'svelte';
	import { i18n } from '../stores/i18n-store.js'
	import { routerStore } from '../stores/router-store.js'

	import UiIcon from './ui-icon.svelte'

	const dispatch = createEventDispatcher()

	export let value = null
	export let options = []

	let el,
		optionEls = {},
		hover = false,
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = value && el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}

	$: activeBoundingRect = optionEls[value]
		? optionEls[value].getBoundingClientRect() 
		: {
		width: 0,
		top: 0,
		left: 0
	}

	$: activeWidth = activeBoundingRect ? activeBoundingRect.width + 2 : 0
	$: activeLeft = activeBoundingRect ? activeBoundingRect.left - boundingRect.left - 2 : 0

	function click(e, option) {
		if(!option.disabled) {
			value = option.value
			dispatch('change', '')
		}
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
		{#each options as option, i (option.value)}
			<div
				bind:this={optionEls[option.value]}
				class="option {option.value === value ? 'active' : ''} {option.disabled ? 'disabled' : ''}"
				on:click={e => click(e, option)}
				tabindex="{!option.disabled ? '0' : null}"
				data-left="{i === 0 ? 'REPORTS_RANGE_RADIO_FIRST' : null}"
				data-config="REPORTS_RANGE_RADIO">
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
		background:var(--c-grey);
		transition: all 100ms ease;
		outline:none;
	}

	.inner {
		position: relative;
		display: block;
		height:40px;
		border-radius: 5px;
		background:var(--c-background-light);
		padding:0;
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
		padding:0 12px;
		font-size:14px;
		font-weight:600;
		color:var(--c-greyed-out);
		float:left;
		transition: all 100ms ease;
		cursor: pointer;
		outline: none;
	}

	.option:hover, .option.active {
		color:var(--c-darkgrey);
	}

	.option.disabled, .option.disabled:hover {
		color:var(--c-greyed-out);
		cursor:default;
	}

	.indicator {
		width:48px;
		height:100%;
		position: absolute;
		top:0;
		left:0;

		background:#FFF;
		border-left:var(--c-grey) 1px solid;
		border-right:var(--c-grey) 1px solid;
		border-radius: 5px;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
		transition: all 100ms ease;
	}

</style>