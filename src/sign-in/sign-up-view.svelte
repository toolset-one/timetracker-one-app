<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { isEmailValid } from '../helpers/helpers.js'
	import { authStore, authSignUp, authSignIn } from '../stores/auth-store.js'
	import { routerStore } from '../stores/router-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.',
		'auth/email-already-in-use': 'The provied email is already in use.',
		'auth/weak-password': 'The provided password is not long enough.'
	}

	let isInvitation = false,
		email = '',
		password = '',
		error = '',
		code = ''

	onMount(() => {
		const routerStoreData = get(routerStore)

		/* if(routerStoreData.key && routerStoreData.email && isEmailValid(routerStoreData.email)) {
			// TODO: Why is UiInput not reactive without setTimeout?
			setTimeout(() => {
				isInvitation = true
				email = routerStoreData.email
			}, 10)
		}*/

		const url = new URL(window.location.href),
			urlEmail = url.searchParams.get('email'),
			urlCode = url.searchParams.get('code')

		if(urlEmail && urlCode) {
			// TODO: Why is UiInput not reactive without setTimeout?
			setTimeout(() => {
				email = urlEmail.toLowerCase()
				code = urlCode
				isInvitation = true
			}, 10)
		}
		
	})

	function signUp(e) {
		authSignUp(email, password, code).then(res => {
			authSignIn(email, password)
				.then(() => Page('/timelog/'))
				.catch(() => Page('/sign-in/'))
		}).catch(err => {
			error = ERROR_MAP[err] || '' + err
		})
	}

</script>

<section class="container">

	<h2>
		Sign up to {isInvitation ? 'your team' : 'Timetracker.One'}
	</h2>

	{#if isInvitation}
		<p>
			You followed an invitation email to timetracker.one. Please set a passwort below, and you'll be added directly to the team.
		</p>
	{/if}

	{#if error.length > 0}
		<p>
			{error}
		</p>
	{/if}

	<form on:submit|preventDefault={e => signUp(e)}>

		<div class="form-item">
			<UiInput
				label="E-Mail"
				type="email"
				bind:value={email}
				disabled={isInvitation} />
		</div>
		<div class="form-item">
			<UiInput label="Password" type="password" bind:value={password} />
		</div>
		
		<UiButton
			label="{isInvitation ? 'Join The Team' : 'Create New Account'}"
			on:click={e => signUp(e)} />
		{#if !isInvitation}
			<span>
				or
				<a href="/sign-in/">
					go to sign in
				</a>
			</span>
		{/if}
	</form>

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

	.form-item {
		margin:0 0 24px 0;
	}

	p {
		margin:0 0 24px 0;
	}

</style>