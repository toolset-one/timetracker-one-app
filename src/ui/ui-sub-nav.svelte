<script>
	import { onMount } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { dateToDatestring } from '../helpers/helpers.js'

	import { uiStore } from '../stores/ui-store.js'

	let ROUTES = ['tasks', 'team', 'account'],
	ELEMENTS_MAP = {},

	el,
	activeEl = ELEMENTS_MAP.projects,
	hoverEl = ELEMENTS_MAP.projects,
	mousePosition = {
		x: 0,
		y: 0
	}

	$: activeEl = ELEMENTS_MAP[$routerStore.subview] || ELEMENTS_MAP.timelog

	$: activeElOffset = (activeEl ? activeEl.getBoundingClientRect().left : 0) - (el ? el.getBoundingClientRect().left : 0)
	$: activeElWidth = activeEl ? activeEl.getBoundingClientRect().width : 0

</script>

<nav bind:this={el} class="bp-{$uiStore.breakpoint}">
	<ul>
		{#each ROUTES as route}
			<li>
				<a 
					href="/settings/{route}/"
					bind:this={ELEMENTS_MAP[route]}
					class="{$routerStore.subview === route ? 'active' : ''}"
					on:mouseenter={e => hoverEl = ELEMENTS_MAP[route]}
					data-config="SUB_NAV">
					<span>
						{route.charAt(0).toUpperCase() + route.slice(1)}
					</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if activeEl}
		<div
		class="indicator"
		style="{
			'left:' + (activeElOffset + ($uiStore.breakpoint === 'xs' ? 9 : 18)) +'px;' + 
			'width:' + (activeElWidth - ($uiStore.breakpoint === 'xs' ? 18 : 36)) +'px;'}"></div>
	{/if}
</nav>
	

<style>
	nav {
		width:100%;
		height:48px;
		position: relative;
		text-align: center;
		z-index:500;
	}

	nav:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		nav:after {
			background:var(--c-grey);
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	ul {
		display: inline-block;
		margin:0;
		padding:0;
		list-style: none;
	}

	li {
		margin:0;
		padding:0;
		float:left;
	}

	a {
		display:block;
		padding:0;
		position: relative;
		font-size:14px;
		font-weight:500;
		color:var(--x-middlegrey);
		transition: all 100ms ease;
	}

	a:hover {
		text-decoration: none;
		color:blue;;
	}

	.active, .active:hover {
		color:var(--c-darkgrey);
	}

	span {
		display:block;
		padding:0 18px;
		line-height:48px;
		border-radius: 6px;
		overflow:hidden;
		transition: all 100ms ease;
	}

	a:hover span {
		background:var(--c-background-light);
	}

	.bp-xs span {
		padding:0 9px;
	}


	.indicator {
		position:absolute;
		bottom:0;
		left:50%;
		width:60px;
		height:2px;
		background:var(--c-darkgrey);
		z-index:100;
		transition: all 100ms ease;
		pointer-events: none;
		border-radius: 1px 1px 0 0;
	}
</style>