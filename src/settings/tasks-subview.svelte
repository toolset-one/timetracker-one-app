<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { i18n } from '../stores/i18n-store.js'
	import { tasksStore, tasksStoreNewTask } from '../stores/tasks-store.js'
	import { uiStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiBackdrop from '../ui/ui-backdrop.svelte'
	import TasksEntry from '../settings/tasks-entry.svelte'

	import TasksEntryOverlay from '../settings/tasks-entry-overlay.svelte'
	import TasksMobileTitleOverlay from '../settings/tasks-mobile-title-overlay.svelte'
	import TasksMobileColorOverlay from '../settings/tasks-mobile-color-overlay.svelte'

	import TasksTitleOverlay from '../settings/tasks-title-overlay.svelte'
	import TasksColorOverlay from '../settings/tasks-color-overlay.svelte'
	import TasksContextNav from '../settings/tasks-context-nav.svelte'


	let overlays = {
		mobileEntry: TasksEntryOverlay,
		mobileTitle: TasksMobileTitleOverlay,
		mobileColor: TasksMobileColorOverlay,

		color: TasksColorOverlay,
		title: TasksTitleOverlay,
		contextNav: TasksContextNav
	},
	overlayEl,
	overlayComponent,
	entryIdActive

	$: entries = $tasksStore.array

	onMount(() => {

	})

	function newEntry() {
		tasksStoreNewTask(success => {

		})
	}

	function openOverlayComponent(e) {
		overlayComponent = overlays[e.component]
		entryIdActive = e.id
	}

</script>

<header class="bp-{$uiStore.breakpoint}">
	<div class="subview-title">
		<h2>
			{$i18n.TASKS}
		</h2>
	</div>
	<div class="add-button-wrapper">
		<UiButton label="{$i18n.NEW_TASK}" on:click={e => newEntry()} />
	</div>
</header>

<ul class="entries bp-{$uiStore.breakpoint}">
	{#each entries as entry, i (entry.id)}
		<TasksEntry
			data={entry}
			first={i == 0}
			last={i == entries.length - 1}
			on:open={e => openOverlayComponent(e.detail)} />
	{/each}
</ul>

{#if entries.length == 0}
	<p style="text-align: center;padding:42px 20px;">
		{$i18n.NO_TASKS_CREATED}
	</p>
{/if}

{#if overlayComponent && $tasksStore.json[entryIdActive]}
	<svelte:component
		this={overlayComponent}
		bind:this={overlayEl}
		id={entryIdActive}
		color={$tasksStore.json[entryIdActive].color}
		title={$tasksStore.json[entryIdActive].title}
		on:open={e => openOverlayComponent(e.detail)}
		on:close={e => {
			overlayComponent = null
			entryIdActive = null
		}} />

	<UiBackdrop
		on:close={e => {
			if(overlayEl.externalClose) {
				overlayEl.externalClose()
			} else {
				overlayComponent = null
				entryIdActive = null
			}
		}} />
{/if}



<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	header.bp-xs {
		margin:12px;
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

	.bp-xs .add-button-wrapper {
		position:fixed;
		bottom:60px;
		left:50%;
		transform: translateX(-50%);
		z-index: 500;
	}

	.entries {
		position: relative;
		max-width:960px;
		margin:24px auto 12px auto;
		padding:0;
		list-style: none;
	}

	.bp-xs.entries {
		margin:12px auto;
	}

</style>