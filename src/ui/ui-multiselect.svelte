<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import UiButton from '../ui/ui-button.svelte'

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let options = []
	export let value = []

	let opened = false,
		searchValue = ''

	$: filteredOptions = options
		.filter(val => val.title.toLowerCase().includes(searchValue.toLowerCase()))
		.sort((a, b) => a.title.localeCompare(b.title) )

	function toggle(id) {
		if(value.includes(id)) {
			value = value.filter(val => val != id)
		} else {
			value = [...value, id]
		}
	}

</script>

<div class="wrapper">
	<UiButton
		label="{label}"
		type="icon-right"
		icon="arrow-left"
		on:click={e => opened = true}
		focusConfig="REPORTS_MULTIPLE" />

	{#if opened}
		<div class="overlay">
			<input
				type="text"
				bind:value={searchValue}
				placeholder="Search">

			<ul>
				{#each filteredOptions as option}
					<li on:click={e => toggle(option.id)}>
						<div class="{value.includes(option.id) ? 'active' : ''}"></div>
						{option.title}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

{#if opened}
	<div
		class="backdrop"
		transition:fade="{{delay: 0, duration: 100}}"
		on:click={e => opened = false}></div>
{/if}

<style>
	.wrapper {
		position: relative;
	}

	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .15);
		z-index:1000;
	}

	.overlay {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		overflow:hidden;
	}

	.overlay:after {
		content:'';
		position: absolute;
		top:47px;
		left:12px;
		right:12px;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.overlay:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	input {
		margin:0;
		border:0;
		line-height: 24px;
		padding:12px 12px;
		font-size:14px;
		outline:none;
		width:240px;
		font-weight:400;
		background:transparent;
	}

	input::placeholder {
		color:#99938D;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
	}

	li {
		position: relative;
		font-size:14px;
		line-height: 42px;
		white-space: nowrap;
		padding:0 12px 0 42px;
		cursor: pointer;
	}

	li:hover {
		background:#F5F3F0;
	}

	li div {
		position: absolute;
		top:12px;
		left:12px;
		width:18px;
		height:18px;
		border:#CCC9C4 1px solid;
		border-radius: 3px;
		transition: 100ms ease;
	}

	li .active {
		border-color:#477DB3;
	}

	li div:after {
		content:"";
		display:block;
		width:9px;
		height:6px;
		position: absolute;
		top:4px;
		left:4px;
		border-left:#477DB3 2px solid;
		border-bottom:#477DB3 2px solid;
		transform: rotate(45deg);
		opacity:0;
		transition: 100ms ease;
	}

	li .active:after {
		opacity:1;
		transform: rotate(-45deg);
	}
</style>