<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { i18n } from '../stores/i18n-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { teamStore, teamStoreChangeTitle } from '../stores/team-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	let newTeamTitle = ''

</script>


<div class="container">
	<h2>
		{$i18n.TRACK_TOGETHER}
	</h2>
			
	<p>
		{$i18n.TRACK_TOGETHER_DESCRIPTION}
	</p>

	<div class="form-item">
		<UiInput
			label="{$i18n.NEW_TEAM_TITLE}"
			bind:value={newTeamTitle} />
	</div>
	<UiButton
		label="{$i18n.CREATE_NEW_TEAM}"
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
		box-shadow:var(--shadow-box);
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