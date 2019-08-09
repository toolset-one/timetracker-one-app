<script>
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import UiButton from '../ui/ui-button.svelte'

	export let data = {}
	export let first = false
	export let last = false

	let hovered = false,
		isNew = false

	const dispatch = createEventDispatcher()


	onMount(() =>
		isNew = data.created.seconds * 1000 >= Date.now() - 2000
	)

</script>

	<li
		id="entry-{data.id}"
		in:slide={{ duration: 100, easing: cubicOut }}
		class="
			{first ? 'first' : ''}
			{last ? 'last' : ''}
			{hovered ? 'hovered' : ''}
			{ isNew ? 'new' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}>
		<div class="title" on:click={e => dispatch('openTitle', data.id)}>
			<div>
				{data.title.length > 0 ? data.title : 'No title'}
			</div>
		</div>
		<div class="nav">
			<UiButton
				type="entry"
				icon="burger"
				hovered={hovered}
				color="{hovered ? '#26231E' : '#E6E4E1'}"
				on:click={e => dispatch('openContextNav', data.id)} />
		</div>
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

	.new {
		min-height:0;
	}

	.hovered {
		/* background:#F5F3F0; */
	}

	.first {
		border-top-left-radius:6px;
		border-top-right-radius:6px;
	}

	.last {
		border-bottom-left-radius:6px;
		border-bottom-right-radius:6px;
	}

	.title {
		flex: 1;
		height:48px;
		padding:0 6px;
		cursor:pointer;
	}

	.title:hover >div {
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
		background:transparent;
		border-radius: 3px;
	}

	.hovered .nav {
		background:#F5F3F0;
	}
</style>