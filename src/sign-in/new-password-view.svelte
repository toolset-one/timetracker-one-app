<script>
	import { onMount } from 'svelte';
	import { authStoreNewPassword } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.'
	}

	let email = '',
		emailError = '',
		error = ''

	onMount(() => {
		
	})

	function getNewPassword() {
		

		authStoreNewPassword(email).then(res => {

		}).catch(err => {
			if(err.code === 'not-connected') {
				emailError = 'Connection error to the server – please try again'
			} else {
				console.log('ERR', err)
			}
		})
	}

	function keydown(e) {
		if(e.keyCode === 13) {
			getNewPassword()
		}
	}

</script>

<div class="spacer"></div>

<section class="container">

	<h2>
		New password for Timetracker.One
	</h2>

	<form on:keydown={e => keydown(e)}>

		<div class="form-item">
			<UiInput
				label="E-Mail"
				type="email"
				bind:value={email}
				bind:error={emailError} />
		</div>
		
		<UiButton label="Get New Password" on:click={e => getNewPassword()} />
		<span>
			or
			<a href="/sign-in/">
				go to sign in
			</a>
		</span>
	</form>

</section>

<div class="spacer"></div>

<style>
	.container {
		position: relative;
		max-width:540px;
		margin:60px auto;
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

</style>