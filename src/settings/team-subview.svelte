<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { teamStore,teamStoreChangeTitle } from '../stores/team-store.js'

	import UiBackdrop from '../ui/ui-backdrop.svelte'
	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	import TeamEmpty from '../settings/team-empty.svelte'
	import TeamEntry from '../settings/team-entry.svelte'

	import TeamInviteOverlay from '../settings/team-invite-overlay.svelte'

	let overlays = {
		invite: TeamInviteOverlay
	},
	overlayEl,
	overlayComponent,
	entryIdActive,

	newTeamTitle = ''



	onMount(() => {

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
				<UiButton label="Invite Member" on:click={e => openOverlayComponent({ component: 'invite', id: null })} />
			</div>
		</header>


		<ul class="entries">
			{#each $teamStore.active.admins as admin, i}
				<TeamEntry data={$teamStore.active.memberData[admin] ? $teamStore.active.memberData[admin] : { id: admin }}
					first={i == 0}
					last={i == $teamStore.active.admins.length - 1}
					on:open={e => openOverlayComponent(e.detail)} />
			{/each}
		</ul>

		{#if Object.keys($teamStore.invitations).length > 0}
			<h3>
				Invitations to the team
			</h3>
			<ul class="entries">
				{#each Object.keys($teamStore.invitations) as invitation, i}
					<TeamEntry data={$teamStore.invitations[invitation]}
						invitation={true}
						first={i == 0}
						last={i == Object.keys($teamStore.invitations).length - 1} />
				{/each}
			</ul>
		{/if}
	{/if}

</section>


{#if overlayComponent}
	<svelte:component
		this={overlayComponent}
		bind:this={overlayEl}
		id={entryIdActive}
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

	h3 {
		font-size:20px;
		line-height: 24px;
		margin:48px 0 0 0;
		padding:0;
	}

</style>