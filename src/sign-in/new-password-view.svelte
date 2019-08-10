<script>
	import { onMount } from 'svelte';
	import { authStoreNewPassword } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.'
	}

	let email = '',
		error = ''

	onMount(() => {
		
	})

	function getNewPassword(e) {
		
		authStoreNewPassword(email, (success, err) => {
			error = ERROR_MAP[err] || '' + err
		})
	}

</script>

<section class="container">

	<h2>
		New password for Timetracker.One
	</h2>

	{#if error.length > 0}
		<p>
			{error}
		</p>
	{/if}

	<form on:submit|preventDefault={e => getNewPassword(e)}>

		<UiInput label="E-Mail" type="email" bind:value={email} />
		
		<UiButton label="Get New Password" on:click={e => getNewPassword(e)} />
		<span>
			or
			<a href="/sign-in/">
				go to sign in
			</a>
		</span>
	</form>

</section>


<style>
	.container {
		position: relative;
		width:540px;
		margin:60px auto;
		border:#CCC9C4 0px solid;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
	}

	h2 {
		padding:24px 0;
	}

	span {
		display:inline-block;
		padding:0 0 0 12px;
	}

</style>