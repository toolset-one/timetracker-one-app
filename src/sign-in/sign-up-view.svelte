<script>
	import { onMount } from 'svelte';
	import { authStore, authSignUp } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.',
		'auth/email-already-in-use': 'The provied email is already in use.',
		'auth/weak-password': 'The provided password is not long enough.'
	}

	let email = '',
		password = '',
		error = ''

	onMount(() => {
		
	})

	function signUp(e) {
		
		authSignUp(email, password, (success, err) => {
			error = ERROR_MAP[err] || '' + err
		})
	}

</script>

<section class="container">

	<h2>
		Sign up to Timetracker.One
	</h2>

	{#if error.length > 0}
		<p>
			{error}
		</p>
	{/if}

	<form on:submit|preventDefault={e => signUp(e)}>

		<UiInput label="E-Mail" type="email" bind:value={email} />
		<UiInput label="Password" type="password" bind:value={password} />
		
		<UiButton label="Create New Account" on:click={e => signUp(e)} />
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