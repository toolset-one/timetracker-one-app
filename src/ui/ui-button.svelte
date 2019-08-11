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



	let el,
		hover = false,
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}

	function click(e) {
		if(!link) {
			e.preventDefault()
		}
		dispatch('click', '')
	}

</script>

<a
	href="{link ? link : '#'}"
	class="type-{type} {hovered ? 'hovered': ''}"
	style="{
		'--x:'+ (mousePosition.x - boundingRect.left) +'px;' +
		'--y:'+ (mousePosition.y - boundingRect.top) +'px;' + 
		'color:'+ color +';'
	}"
	bind:this={el}
	on:click={e => click(e)}
	on:mouseenter={e => hover = true}
	on:mouseleave={e => hover = false}
	on:mousemove={e => mousePosition = {
		x: e.pageX,
		y: e.pageY
	}}>
	<em></em>
	<span>
		{#if type === 'default' || type === 'icon-right' }	
			{label}
		{:else if type === 'icon' || type === 'entry' || type === 'entry has-stopwatch'}
			<UiIcon type={icon} color="{color}" />
		{/if}
	</span>
	{#if type === 'icon-right' }
		<span class="">
			<i style="display:block;transform:rotate(-90deg)">
				<UiIcon type={icon} color="{color}" />
			</i>	
		</span>
	{/if}
</a>

<style>
	a {
		display:inline-block;
		position: relative;
		padding:1px;
		border:0;
		border-radius: 6px;
		background:#CCC9C4;
		cursor: pointer;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
		transition: all 100ms ease;
		outline:none;
	}

	a:hover {
		text-decoration: none;
		transform: translateY(1px);
		box-shadow: 0 4px 0 -3px rgba(0, 0, 0, .05);
	}

	a:active {
		background: #99815C;
		transform: translateY(2px);
		box-shadow: 0 -4px 0 -3px rgba(0, 0, 0, .05);
	}

	a:before {
		content:'';
		display:block;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, 0);
		position: absolute;
		top:2px;
		left:0;
		transition: all 100ms ease;
	}


	.type-icon {
		width:42px;
		height:42px;
	}

	.type-icon span {
		display: block;
		width:40px;
		height:40px;
		padding:0;
		padding:14px;
	}

	.type-icon em:after, .type-entry em:after {
		width: 60px;
		height: 60px;
	}

	.type-entry {
		width:36px;
		height:36px;
		background:#FFF;
		box-shadow:none;
	}

	.type-entry:hover {
		transform: none;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
	}

	.type-entry.hovered {
		background:#CCC9C4;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
	}


	.type-entry span {
		display: block;
		width:34px;
		height:34px;
		padding:11px;
	}

	.has-stopwatch {
		border-top-right-radius:0;
		border-bottom-right-radius:0;
	}

	.has-stopwatch span {
		border-top-right-radius:0;
		border-bottom-right-radius:0;
		width:35px;
	}

	.has-stopwatch.hovered {
		box-shadow: none;
	}

	.type-icon-right {
		display:flex;
		flex-flow: row wrap;
	}

	.type-icon-right span {
		
	}

	.type-icon-right span:first-of-type {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.type-icon-right span:last-of-type {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left:1px;
		width:40px;
		padding:14px;
	}

	span {
		display: block;
		position: relative;
		border-radius: 5px;
		line-height:40px;
		background:#FFF;
		padding:0 18px;
		font-size:14px;
		font-weight:600;
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

	a:hover em:after {
		transform: translate(-50%, -50%) scale(1);
	}

</style>