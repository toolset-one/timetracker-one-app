<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	import { COLORS } from '../helpers/helpers.js'

	import { uiStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'

	export let data = {}
	export let invitation = false
	export let first = false
	export let last = false

	let isNew = false,
		hovered = false

	const dispatch = createEventDispatcher()


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
			{last ? 'last' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}
		on:click={e => dispatchMobileOrTouch('open', { component: 'mobileEntry', id: data.id})}>
		{#if !invitation}
			<div class="color" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'color', id: data.id})}>
				<div style="{'background-color:' + (data ? data.color : '#333') + ';'}">
					
				</div>
			</div>
		{/if}
		<div class="name" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'name', id: data.id })}>
			<div>
				{data.name && data.name.length > 0 ? data.name : 'No name'}
			</div>
		</div>
		<div class="email" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'email', id: data.id })}>
			<div>
				{data.email && data.email.length > 0 ? data.email : 'No email address'}
			</div>
		</div>
		{#if !invitation}
			<div class="role" on:click={e => dispatchDesktopAndKeyboard('open', { component: 'role', id: data.id })}>
				<div>
					Admin
				</div>
			</div>
		{/if}
		{#if !invitation && $uiStore.breakpoint != 'xs' && !$uiStore.isTouchDevice}
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
	}

	.name, .email, .role {
		height:48px;
		padding:0 6px;
		cursor:pointer;
	}

	.name, .email {
		cursor: default;
	}

	.email {
		flex:1;
	}

	.mouse .role:hover >div {
		background:rgba(0, 0, 0, .05);
	}

	.name >div, .email >div, .role >div {
		display:inline-block;
		height:36px;
		line-height:36px;
		margin:6px 0;
		padding:0 6px;
		border-radius: 6px;
		font-size:14px;
		font-weight:600;
		white-space: nowrap;
	}

	.email >div, .role >div {
		font-weight:400;
	}

	.nav {
		height:48px;
		padding:6px;
		background:#FFF;
		border-radius: 3px;
	}
</style>