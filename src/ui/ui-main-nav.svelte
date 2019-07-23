<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { dateToDatestring } from '../helpers/helpers.js'

	let ROUTES = ['timelog', 'reports', 'settings'],
	ELEMENTS_MAP = {},

	activeEl = ELEMENTS_MAP.timelog,
	hoverEl = ELEMENTS_MAP.timelog,
	mousePosition = {
		x: 0,
		y: 0
	}

	$: activeEl = ELEMENTS_MAP[$routerStore.view] || ELEMENTS_MAP.timelog

	$: activeElOffset = activeEl ? activeEl.getBoundingClientRect().left : 0
	$: activeElWidth = activeEl ? activeEl.getBoundingClientRect().width : 0

</script>

<nav>
	<ul>
		{#each ROUTES as route}
			<li>
				<a 
					href="/{route}/{route === 'timelog' ? dateToDatestring(new Date()) + '/' : ''}"
					bind:this={ELEMENTS_MAP[route]}
					class="{$routerStore.view === route ? 'active' : ''}"
					on:mouseenter={e => hoverEl = ELEMENTS_MAP[route]}>
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
			'left:' + (activeElOffset + 18) +'px;' + 
			'width:' + (activeElWidth - 36) +'px;'}"></div>
	{/if}
</nav>
	

<style>
	nav {
		width:100%;
		height:60px;
		position: sticky;
		top:0;
		background:#FFF;
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
			background:#CCC9C4;
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
		padding:6px 0;
		position: relative;
		font-size:14px;
		font-weight:500;
		color:#66625C;
		transition: all 100ms ease;
	}

	a:hover {
		text-decoration: none;
		color:#26231E;;
	}

	.active, .active:hover {
		color:#26231E;
	}

	.active span, .active:hover span {
		background:#FFF;
	}

	span {
		display:block;
		padding:0 18px;
		line-height:48px;
		border-radius: 6px;
		overflow:hidden;
		transition: all 400ms ease;
	}

	a:hover span {
		background:#FAF9F7;
	}



	.indicator {
		position:absolute;
		bottom:0;
		left:50%;
		width:60px;
		height:2px;
		background:#26231E;
		z-index:100;
		transition: all 100ms ease;
		pointer-events: none;
		border-radius: 1px 1px 0 0;
	}
</style>