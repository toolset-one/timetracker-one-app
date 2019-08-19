<script>
	import { onMount } from 'svelte';
	import { authStore, authSignIn } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.',
		'auth/wrong-password': 'The provided password does not match.'
	}

	let email = '',
		password = '',
		error = ''

	onMount(() => {
		
	})

	function signIn(e) {
		
		console.log(email, password)
		authSignIn(email, password, (success, err) => {
			error = ERROR_MAP[err] || '' + err
		})
	}

</script>

<section class="container">

	<h2>
		Sign in to Timetracker.One
	</h2>

	{#if error.length > 0}
		<p>
			{error}
		</p>
	{/if}

	<form on:submit|preventDefault={e => signIn(e)}>

		<div class="form-item">
			<UiInput label="E-Mail" type="email" bind:value={email} />
		</div>
		<div class="form-item">
			<UiInput label="Password" type="password" bind:value={password} />
		</div>
		
		<UiButton label="Sign In" on:click={e => signIn(e)} />
		<span>
			or
			<a href="/sign-up/">
				create a new account
			</a>
		</span>
	</form>

	<div class="password-link">
		<a href="/new-password/">
			Send new password
		</a>
	</div>
</section>


<style>
	.container {
		position: relative;
		max-width:540px;
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

	.password-link {
		position: absolute;
		top:100%;
		left:0;
		margin:12px 0 0 0;
		font-size:14px;
	}

	.password-link a {
		color:#999;
	}

	.form-item {
		margin:0 0 24px 0;
	}

</style>