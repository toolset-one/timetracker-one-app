<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { tasksStore, tasksStoreNewTask } from '../stores/tasks-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import TasksEntry from '../settings/tasks-entry.svelte'
	import TasksTitleOverlay from '../settings/tasks-title-overlay.svelte'
	import TasksColorOverlay from '../settings/tasks-color-overlay.svelte'
	import TasksContextNav from '../settings/tasks-context-nav.svelte'


	let openedTitleId,
		openedColorId,
		openContextNavId

	$: entries = $tasksStore.array

	onMount(() => {

	})

	function newEntry() {
		tasksStoreNewTask(success => {

		})
	}

</script>

<header>
	<div class="subview-title">
		<h2>
			Tasks
		</h2>
	</div>
	<div class="add-button-wrapper">
		<UiButton label="Add Task" on:click={e => newEntry()} />
	</div>
</header>

<ul class="entries">
	{#each entries as entry, i (entry.id)}
		<TasksEntry
			data={entry}
			first={i == 0}
			last={i == entries.length - 1}
			on:openTitle={e => openedTitleId = e.detail}
			on:openColor={e => openedColorId = e.detail}
			on:openContextNav={e => openContextNavId = e.detail} />
	{/each}
</ul>

{#if entries.length == 0}
	<p style="text-align: center;padding:42px 20px;">
		No tasks created.
	</p>
{/if}


{#if openedTitleId}
	<TasksTitleOverlay
		id={openedTitleId}
		title={$tasksStore.json[openedTitleId].title}
		on:close={e => openedTitleId = null} />
{:else if openedColorId}
	<TasksColorOverlay
		id={openedColorId}
		color={$tasksStore.json[openedColorId].color}
		on:close={e => openedColorId = null} />
{:else if openContextNavId}
	<TasksContextNav
		id={openContextNavId}
		on:close={e => openContextNavId = null}
		on:openTitle={e => openedTitleId = e.detail} />
{/if}



<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	.subview-title {
		display:flex;
		flex-flow: row wrap;
		font-size:0;
		width:50%;
	}

	.add-button-wrapper {
		flex: 1;
		text-align: right;
	}

	.entries {
		position: relative;
		max-width:960px;
		margin:24px auto 12px auto;
		padding:0;
		list-style: none;
	}

</style>