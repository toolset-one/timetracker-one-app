<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'

	import UiSubNav from '../ui/ui-sub-nav.svelte'
	import TasksSubview from '../settings/tasks-subview.svelte'

	onMount(() => {
	
	})

</script>

<section >
	<UiSubNav />
</section>

{#if $routerStore.subview === 'tasks'}
	<TasksSubview />
{:else if $routerStore.subview === 'team'}
	Team
{:else if $routerStore.subview === 'appearance'}
	Appearance
{:else if $routerStore.subview === 'account'}
	Account
{/if}


<style>

	section {
		display:flex;
		flex-flow: row wrap;
		max-width:960px;
		margin:18px auto 24px auto;
	}

	.filter-header .button-wrapper {
		margin-right:6px;
	}

	.range-header {
		display:flex;
		flex-direction: row wrap;
	}

	.date-nav {
		display:flex;
		flex-flow: row wrap;
		width:60%;
		font-size:0;
	}

	.button-wrapper {
		margin-right:6px;
	}

	.button-wrapper + .button-wrapper {
		margin-right:12px;
	}

	.range-wrapper {
		flex: 1;
		text-align:right;
	}

</style>