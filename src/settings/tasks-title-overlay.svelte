<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { tasksStoreChangeTitle } from '../stores/tasks-store.js'

	export let id = null
	export let title = ''

	let value = '',
		el,
		top = 0,
		left = 0,
		alreadyClosed = false

	const dispatch = createEventDispatcher()

	onMount(() => {

		const boundingRect = document.querySelector('#entry-'+ id +' .title').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left

		value = title

		el.focus()
	})

	function keydown(e) {
		if( e.keyCode === 27) { // ESC
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13) { // ENTER
			save()
		}
	}

	function save() {
		if(!alreadyClosed) {
			tasksStoreChangeTitle(id, value)
			dispatch('close', '')
		}
	}

</script>

<div
	style="{
		'top:'+ top +'px;'+
		'left:'+ left +'px;'
	}"
	class="input-wrapper">
	<input
		type="text"
		bind:this={el}
		bind:value={value}
		placeholder="No title"
		on:blur={e => save()}
		on:keydown={e => keydown(e)}>
</div>
<style>
	.input-wrapper {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
	}

	input {
		margin:0;
		border:0;
		line-height: 24px;
		padding:12px 12px;
		font-size:14px;
		outline:none;
		width:180px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		font-weight:600;
		border-radius: 6px;
	}

	input::placeholder {
		color:#99938D;
	}
</style>