<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { teamStore,teamStoreChangeTitle } from '../stores/team-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	import TeamEmpty from '../settings/team-empty.svelte'

	let newTeamTitle = ''



	onMount(() => {

	})

</script>


<section>

	{#if !$teamStore.active || ($teamStore.active.title.length === 0 && $teamStore.teams.length === 1)}
		<TeamEmpty />
	{/if}

	{$teamStore.active ? $teamStore.active.title : 'NO TEAM TITLE'}

	
</section>

<style>

	section {
		max-width:960px;
		margin:24px auto 24px auto;
	}

	/* .container {
		position: relative;
		margin:0 auto 24px auto;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
	}

	h2 {
		padding:24px 0 0 0;
	}

	p {
		margin:0 0 24px 0;
	}

	.form-item {
		margin:0 0 24px 0;
	} */

</style>