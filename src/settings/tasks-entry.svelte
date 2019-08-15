<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	import { COLORS } from '../helpers/helpers.js'

	import { uiStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'

	export let data = {}
	export let first = false
	export let last = false

	let isNew = false,
		hovered = false

	const dispatch = createEventDispatcher()


	onMount(() =>
		isNew = data.created.seconds * 1000 >= Date.now() - 2000
	)

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
		id="entry-{data.id}"
		in:slide={{ duration: 100, easing: cubicOut }}
		class="
			bp-{$uiStore.breakpoint}
			{$uiStore.isTouchDevice ? 'touch' : 'mouse'}
			{first ? 'first' : ''}
			{last ? 'last' : ''}
			{ isNew ? 'new' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}
		on:click={e => dispatchMobileOrTouch('open', { component: 'mobileEntry', id: data.id})}>
		<div class="color" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'color', id: data.id})}>
			<div style="{'background-color:' + data.color + ';'}">
				
			</div>
		</div>
		<div class="title" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'title', id: data.id})}>
			<div>
				{data.title.length > 0 ? data.title : 'No title'}
			</div>
		</div>
		{#if $uiStore.breakpoint != 'xs'}
			<div class="nav">
				<UiButton
					type="entry"
					icon="burger"
					hovered={hovered}
					color="{hovered ? '#26231E' : '#E6E4E1'}"
					on:click={e => dispatch('open', { component: 'contextNav', id: data.id})} />
			</div>
		{/if}
	</li>
<style>

	li {
		display:flex;
		flex-flow:row wrap;
		position:relative;
		margin:0 0 1px 0;
		padding:0;
		background:#FFF;
		min-height:48px;
		border-radius:3px;
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
	}

	li.bp-xs {
		box-shadow:none;
		border-radius: 0;
		margin:0;
	}

	li.bp-xs:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		li.bp-xs:after {
			background:#CCC9C4;
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

	.color {
		padding:9px 0 9px 6px;
	}

	.color div {
		width:30px;
		height:30px;
		border-radius: 6px;
		background:#EEE;
		cursor:pointer;
	}

	.title {
		flex: 1;
		height:48px;
		padding:0 6px;
		cursor:pointer;
	}

	.mouse .title:hover >div {
		background:rgba(0, 0, 0, .05);
	}

	.title >div {
		display:inline-block;
		height:36px;
		line-height:36px;
		margin:6px 0;
		padding:0 6px;
		border-radius: 6px;
		font-size:14px;
		font-weight:600;
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
</style>