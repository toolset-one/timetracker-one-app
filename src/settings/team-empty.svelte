<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { uiStore } from '../stores/ui-store.js'
	import { teamStore, teamStoreChangeTitle } from '../stores/team-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	let newTeamTitle = ''

</script>


<div class="container">
	<h2>
		Want to track togehter?
	</h2>
			
	<p>
		You are tracking solo right now. If you like to create a team, please go ahead:
	</p>

	<div class="form-item">
		<UiInput
			label="Title of new team"
			bind:value={newTeamTitle} />
	</div>
	<UiButton
		label="Create New Team"
		disabled={newTeamTitle.length === 0}
		on:click={e => teamStoreChangeTitle($teamStore.active.id, newTeamTitle)} />

</div>

<style>

	.container {
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
	}

</style>