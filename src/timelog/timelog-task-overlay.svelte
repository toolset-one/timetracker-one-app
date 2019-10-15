<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import UiButton from '../ui/ui-button.svelte'

	import { timesStoreChangeTask } from '../stores/times-store.js'
	import { tasksStore, tasksStoreNewTask } from '../stores/tasks-store.js'

	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'

	export let id = null
	export let duration = 0

	let value = '',
		el,
		optionsEl,
		top = 0,
		left = 0

	$: tasks = $tasksStore.array
		.filter(val => val.title.toLowerCase().includes(value.toLowerCase()))
		.sort((a, b) => a.title.localeCompare(b.title) )

	const dispatch = createEventDispatcher()

	onMount(() => {

		const boundingRect = document.querySelector('#entry-'+ id +' .task').getBoundingClientRect()
		top = boundingRect.top
		left = boundingRect.left + 6

		el.focus()
	})


	function keydownInput(e) {
	
		if(e.keyCode === 13) { // ENTER
			if(('no task').includes(value.toLowerCase()) && tasks.length === 0) {
				save(null)
			} else if(!('no task').includes(value.toLowerCase()) && tasks.length === 1) {
				save(tasks[0].id)
			}
		} else if(e.keyCode === 27) { // ESC
			if(value.length > 0) {
				value = ''
			} else {
				dispatch('close', '')
			}
		} else if(e.keyCode === 38) { // UP
			if(optionsEl.querySelector('li')) {
				optionsEl.querySelector('li:last-child').focus()
			}
		} else if(e.keyCode === 40) { // DOWN
			if(optionsEl.querySelector('li')) {
				optionsEl.querySelector('li').focus()
			}
		}
	}


	function keydownList(e, taskId) {
	
		if(e.keyCode === 13) { // ENTER
			save(taskId)
		} else if(e.keyCode === 27) { // ESC
			el.focus()
		} else if(e.keyCode === 38) { // UP
			if(e.target.previousElementSibling) {
				e.target.previousElementSibling.focus()
			} else {
				el.focus()
			}
		} else if(e.keyCode === 40) { // DOWN
			if(e.target.nextElementSibling) {
				e.target.nextElementSibling.focus()
			} else {
				el.focus()
			}
		} else {
			el.focus()
		}
	}


	function save(taskId) {
		timesStoreChangeTask(id, taskId)
		dispatch('close', '')
		document.querySelector('#entry-' + id + ' .comment').focus()
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
		placeholder="Search Tasks"
		on:keydown={e => keydownInput(e)}
		data-disable="true">

	<ul bind:this={optionsEl}>
		{#if ('no task').includes(value.toLowerCase())}
			<li
				on:click={e => save(null)}
				on:keydown={e => keydownList(e, null)}
				tabindex="0"
				data-disable="true">
				No Task
			</li>
		{/if}
		{#each tasks as task}
			<li
				on:click={e => save(task.id)}
				on:keydown={e => keydownList(e, task.id)}
				tabindex="0"
				data-disable="true">
				{task.title.length > 0 ? task.title : 'No title'}
			</li>
		{/each}
	</ul>
	{#if tasks.length === 0 && !('no task').includes(value.toLowerCase())}
		<small>
			No tasks found for this search term
		</small>
	{/if}
</div>
<style>
	.input-wrapper {
		position: absolute;
		top:0;
		left:0;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		overflow:hidden;
	}

	.input-wrapper:after {
		content:'';
		position: absolute;
		top:47px;
		left:12px;
		right:12px;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.input-wrapper:after {
			background:var(--c-grey);
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
		font-size:14px;
		line-height: 42px;
		white-space: nowrap;
		padding:0 12px;
		cursor: pointer;
	}

	li:hover {
		background:#F5F3F0;
	}

	small {
		display: block;
		padding:12px 24px;
		text-align: center;
	}
</style>