<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { mobileOverlayTransition } from '../helpers/animations.js'
	import { timesStoreChangeComment } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	export let id = null
	export let comment = ''

	const regex = /\n/g,
		dispatch = createEventDispatcher()

	let el,
		value

	onMount(async () => {
		value = comment.replace(/\n/g, '')
		el.focus()
	})


	function save() {
		timesStoreChangeComment(id, value)
		dispatch('close', '')
	}

	export function externalClose() {
		save()
	}

	function keydown(e) {
		if( e.keyCode === 27) { // ESC
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13) { // ENTER
			save()
		}
	}

</script>

<div class="wrapper" transition:mobileOverlayTransition>
	<header>
		Edit Comment
	</header>

	<textarea
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="No comment"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}></textarea>
</div>
<style>
	.wrapper {
		position: fixed;
		top:24px;
		bottom:0;
		left:50%;
		max-width:480px;
		width:96.25%;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		transition: transform 200ms ease, opacity 200ms ease;
		transform:translateX(-50%);
	}

	header {
		position: relative;
		height:42px;
		background:#FaFaFa;
		line-height: 42px;
		font-size:14px;
		padding:0 12px;
	}

	header .icon {
		position: absolute;
		top:0;
		right:0;
		padding:15px;
		cursor: pointer;
	}

	header:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		header:after {
			background:var(--c-grey);
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	textarea {
		display:block;
		border:0;
		margin:0;
		padding:12px;
		line-height: 30px;
		font-size: 16.5px;
		font-weight:400;
		resize: none;
		overflow:hidden;
		width:100%;
		min-height:100%;
		outline:none;
	}
</style>