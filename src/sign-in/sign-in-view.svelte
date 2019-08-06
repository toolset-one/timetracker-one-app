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

		<UiInput label="E-Mail" type="email" bind:value={email} />
		<UiInput label="Password" type="password" bind:value={password} />
		
		<UiButton label="Sign In" on:click={e => signIn(e)} />
		<span>
			or
			<a href="/sign-up/">
				create a new account
			</a>
		</span>
	</form>

</section>


<style>
	.container {
		position: relative;
		width:540px;
		margin:60px auto;
		border:#CCC9C4 1px solid;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
	}

	.container:after {
		content:'';
		display:block;
		position: absolute;
		top:calc(100% + 1px);
		left:3px;
		right:3px;
		height:3px;
		background:#FFF;
		border-bottom-right-radius: 3px;
		border-bottom-left-radius: 3px;
		border-right:#CCC9C4 1px solid;
		border-bottom:#CCC9C4 1px solid;
		border-left:#CCC9C4 1px solid;
	}

	h2 {
		padding:23px 0 24px 0;
	}

	span {
		display:inline-block;
		padding:0 0 0 12px;
	}

</style>