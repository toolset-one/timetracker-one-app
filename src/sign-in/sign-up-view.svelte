<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { isEmailValid } from '../helpers/helpers.js'
	import { authStore, authSignUp, authSignIn } from '../stores/auth-store.js'
	import { routerStore } from '../stores/router-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let isInvitation = false,
		email = '',
		emailError = '',
		password = '',
		passwordError = '',
		error = '',
		code = ''

	onMount(() => {
		const routerStoreData = get(routerStore)

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

	function signUp() {
		authSignUp(email, password, code).then(res => {
			authSignIn(email, password)
				.then(() => Page('/timelog/'))
				.catch(() => Page('/sign-in/'))
		}).catch(err => {
			if(err.code === 'duplicate-key') {
				emailError = 'This email already belongs to an account'
			} else if(err.code === 'email-not-valid') {
				emailError = 'Please provide a correct email address'
			} else if(err.code === 'not-connected') {
				emailError = 'Connection error to the server – please try again'
			} else {
				console.log('ERR', err)
			}
		})
	}

	function keydown(e) {
		if(e.keyCode === 13) {
			signUp()
		}
	}

</script>

<div class="spacer"></div>

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

	<form on:keydown={e => keydown(e)}>

		<div class="form-item">
			<UiInput
				label="E-Mail"
				type="email"
				bind:value={email}
				disabled={isInvitation}
				bind:error={emailError} />
		</div>
		<div class="form-item">
			<UiInput
				label="Password"
				type="password"
				bind:value={password}
				bind:error={passwordError} />
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

<div class="spacer"></div>

<style>
	.container {
		position: relative;
		max-width:540px;
		margin:0 auto;
		border:#CCC9C4 0px solid;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
	}

	.spacer {
		height:60px;
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