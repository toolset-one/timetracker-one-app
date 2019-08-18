<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { teamStore,teamStoreChangeTitle } from '../stores/team-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	import TeamEmpty from '../settings/team-empty.svelte'
	import TeamEntry from '../settings/team-entry.svelte'

	let newTeamTitle = ''



	onMount(() => {
		teamStore.subscribe(data => console.log(data))
	})


	function openOverlayComponent(e) {
		overlayComponent = overlays[e.component]
		entryIdActive = e.id
	}

	function newEntry() {

	}

</script>


<section>

	{#if !$teamStore.active || ($teamStore.active.title.length === 0 && $teamStore.teams.length === 1)}
		<TeamEmpty />
	{:else}

		<header class="bp-{$uiStore.breakpoint}">
			<div class="subview-title">
				<h2>
					Team &middot; {$teamStore.active.title}
				</h2>
			</div>
			<div class="add-button-wrapper">
				<UiButton label="Invite Member" on:click={e => newEntry()} />
			</div>
		</header>


		<ul class="entries">
			{#each $teamStore.active.admins as admin, i}
				<TeamEntry data={$teamStore.active.memberData[admin]}
					first={i == 0}
					last={i == $teamStore.active.admins.length - 1}
					on:open={e => openOverlayComponent(e.detail)} />
			{/each}
		</ul>
	{/if}

		

	
</section>

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

	section {
		max-width:960px;
		margin:24px auto 24px auto;
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