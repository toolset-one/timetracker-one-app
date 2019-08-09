<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import UiButton from '../ui/ui-button.svelte'

	import { timesStoreChangeTask } from '../stores/times-store.js'
	import { tasksStore, tasksStoreNewTask } from '../stores/tasks-store.js'

	import { dateGetHours, dateGetMinutes, dateGetSeconds } from '../helpers/helpers.js'

	export let id = null
	export let duration = 0

	let value = '',
		el,
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


	function keydown(e) {
		if(e.keyCode === 13) {

			if(('no task').includes(value.toLowerCase()) && tasks.length === 0) {
				save(null)
			} else if(!('no task').includes(value.toLowerCase()) && tasks.length === 1) {
				save(tasks[0].id)
			}

			
		} else if(e.keyCode === 27) {
			dispatch('close', '')
		}
	}


	function save(taskId) {
		timesStoreChangeTask(id, taskId)
		dispatch('close', '')
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
		on:keydown={e => keydown(e)}>

	<ul>
		{#if ('no task').includes(value.toLowerCase())}
			<li on:click={e => save(null)}>
				No Task
			</li>
		{/if}
		{#each tasks as task}
			<li on:click={e => save(task.id)}>
				{task.title.length > 0 ? task.title : 'No title'}
			</li>
		{/each}
	</ul>
</div>
<div
	class="backdrop"
	transition:fade="{{delay: 0, duration: 100}}"
	on:click={e => dispatch('close', '')}></div>
<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .15);
		/* -webkit-backdrop-filter: blur(1px); */
		z-index:1000;
	}

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
		font-size:14px;
		line-height: 42px;
		white-space: nowrap;
		padding:0 12px;
		cursor: pointer;
	}

	li:hover {
		background:#F5F3F0;
	}
</style>