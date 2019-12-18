<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { uiStore } from '../stores/ui-store.js'
	import { authStore, authSignIn } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let email = '',
		emailError = '',
		emailEl,
		password = '',
		passwordError = '',
		error = ''


	onMount(() => {
		if(!get(uiStore).isTouchDevice) {
			emailEl.focus()
		}
	})

	function signIn() {
		authSignIn(email, password).then(res => {
			error = ''
			Page('/timelog/')
		}).catch(err => {
			if(err.code === 'user-not-found') {
				emailError = 'Account not found'
			} else if(err.code === 'email-not-valid') {
				emailError = 'Please provide a correct email address'
			} else if(err.code === 'not-connected') {
				emailError = 'Connection error to the server – please try again'
			} else if(err.code === 'password-not-correct') {
				passwordError = 'Password does not match'
			} else {
				console.log('ERR', err)
			}
		})
	}

	function keydown(e) {
		if(e.keyCode === 13) {
			signIn()
		}
	}

</script>

<div class="spacer"></div>

<section class="container">

	<h2>
		Sign in to Timetracker.One
	</h2>

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
				bind:this={emailEl}
				bind:value={email}
				bind:error={emailError} />
		</div>
		<div class="form-item">
			<UiInput
				label="Password"
				type="password"
				bind:value={password}
				bind:error={passwordError} />
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

<div class="spacer"></div>


<style>
	.container {
		position: relative;
		max-width:540px;
		margin:0 auto;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:var(--shadow-box);
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