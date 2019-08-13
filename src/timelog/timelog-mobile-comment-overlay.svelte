<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { timesStoreChangeComment } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	export let id = null
	export let comment = ''

	const regex = /\n/g,
		dispatch = createEventDispatcher()

	let opened = false,
		el,
		value,
		sizeTestEl,
		maxWidth,
		width,
		height

	onMount(async () => {
		value = comment.replace(/\n/g, '')
		opened = true
	})


	function save() {

		timesStoreChangeComment(id, value)

		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
	}

	export function externalClose() {
		save()
	}

	function sizeTestChange() {
		const boundingRect = sizeTestEl.getBoundingClientRect()
		width = boundingRect.width
		height = boundingRect.height

		if(regex.test(value)) {
			value = value.replace(regex, '')
		}
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
		Edit Comment
	</header>

	<textarea
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="No comment"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}
		on:input={e => sizeTestChange()}></textarea>
</div>
<div bind:this={sizeTestEl} class="size-test" style="{'max-width:'+ maxWidth +'px;'}">{value}</div>
<style>
	.wrapper {
		position: fixed;
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
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	textarea {
		display:block;
		border:0;
		margin:0;
		padding:12px;
		line-height: 24px;
		font-size: 14px;
		font-weight:400;
		resize: none;
		overflow:hidden;
		width:100%;
		min-height:210px;
		outline:none;
	}

	.size-test {
		display:inline-block;
		line-height: 24px;
		padding:12px;
		font-size:14px;
		font-weight:400;
		position: absolute;
		top:-1000px;
		pointer-events: none;
	}
</style>