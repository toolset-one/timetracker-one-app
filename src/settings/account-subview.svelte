<script>
	import Page from 'page'
	import { onMount } from 'svelte';
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'

	import UiButton from '../ui/ui-button.svelte'


	onMount(() => {

	})

</script>

<header class="bp-{$uiStore.breakpoint}">
	<div class="subview-title">
		<h2>
			Account
		</h2>
	</div>
	<div class="sign-out-button-wrapper">
		<UiButton label="Sign Out" on:click={e => authSignOut()} />
	</div>
</header>

<section>
	<p>
		Sprache<br />
		Währung<br />
		Stunden exportieren Format<br />
		Zeitzone<br />

		E-Mail<br />
		Name<br />
		Password<br />
	</p>
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

	.sign-out-button-wrapper {
		flex: 1;
		text-align: right;
	}

</style>