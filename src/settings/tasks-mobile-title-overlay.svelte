<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { tasksStoreChangeTitle } from '../stores/tasks-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	export let id = null
	export let title = ''

	const regex = /\n/g,
		dispatch = createEventDispatcher()

	let opened = false,
		el,
		value

	onMount(async () => {
		value = title.replace(/\n/g, '')
		opened = true

		el.focus()
	})


	function save() {

		tasksStoreChangeTitle(id, value)

		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
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

<div class="wrapper {opened ? 'opened' : ''}">
	<header>
		Edit Title
	</header>

	<textarea
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="No title"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}></textarea>
</div>
<style>
	.wrapper {
		position: fixed;
		top:12px;
		bottom:0;
		left:12px;
		right:12px;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		opacity:0;
		transform:translateY(100%);
		transition: transform 100ms ease, opacity 100ms ease;
	}

	.opened {
		transform:translateY(0);
		opacity:1;
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