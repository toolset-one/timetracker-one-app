<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { fade } from 'svelte/transition'
	import { uiStore } from '../stores/ui-store.js'
	import UiButton from '../ui/ui-button.svelte'
	import UiMobileMultiselectOverlay from '../ui/ui-mobile-multiselect-overlay.svelte'

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let options = []
	export let value = []

	let el,
		buttonEl,
		optionsEl,
		opened = false,
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


	function keydownInput(e) {
	
		if(e.keyCode === 13) { // ENTER
			if(filteredOptions.length === 1) {
				toggle(filteredOptions[0].id)
			}
		} else if(e.keyCode === 27) { // ESC
			if(searchValue.length > 0) {
				searchValue = ''
			} else {
				buttonEl.focus()
				opened = false
			}
		} else if(e.keyCode === 38) { // UP
			e.preventDefault()
			if(optionsEl.querySelector('li')) {
				optionsEl.querySelector('li:last-child').focus()
			}
		} else if(e.keyCode === 40) { // DOWN
			e.preventDefault()
			if(optionsEl.querySelector('li')) {
				optionsEl.querySelector('li').focus()
			}
		}
	}


	function keydownList(e, taskId) {
	
		if(e.keyCode === 13) { // ENTER
			toggle(taskId)
		} else if(e.keyCode === 27) { // ESC
			el.focus()
		} else if(e.keyCode === 38) { // UP
			e.preventDefault()
			if(e.target.previousElementSibling) {
				e.target.previousElementSibling.focus()
			} else {
				el.focus()
			}
		} else if(e.keyCode === 40) { // DOWN
			e.preventDefault()
			if(e.target.nextElementSibling) {
				e.target.nextElementSibling.focus()
			} else {
				el.focus()
			}
		} else {
			el.focus()
		}
	}


	function open() {
		opened = true
		setTimeout(() => {
			const { isTouchDevice } = get(uiStore)
			if(!isTouchDevice) {
				el.focus()
			}
		})
	}

</script>

<div class="wrapper">
	<UiButton
		bind:this={buttonEl}
		label="{label}"
		type="icon-right"
		icon="arrow-left"
		on:click={e => open()}
		focusConfig="REPORTS_MULTIPLE" />

	{#if opened && !$uiStore.isTouchDevice}
		<div class="overlay">
			<input
				bind:this={el}
				type="text"
				bind:value={searchValue}
				placeholder="Search"
				on:keydown={e => keydownInput(e)}
				data-disable="true">

			<ul bind:this={optionsEl}>
				{#each filteredOptions as option}
					<li 
						on:click={e => toggle(option.id)}
						on:keydown={e => keydownList(e, option.id)}
						tabindex="0"
						data-disable="true">
						<div class="{value.includes(option.id) ? 'active' : ''}"></div>
						{option.title.length > 0 ? option.title : 'No Title'}
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

{#if opened && $uiStore.isTouchDevice}
	<UiMobileMultiselectOverlay
		options={filteredOptions}
		bind:value={value} />
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