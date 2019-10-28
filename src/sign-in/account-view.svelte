<script>
	import { onMount } from 'svelte'
	import { authStoreNewPassword, authStoreVerifyPasswordCode, authStoreConfirmPasswordReset } from '../stores/auth-store.js'
	import { getUrlParameter } from '../helpers/helpers.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	const ERROR_MAP = {
		'auth/invalid-email': 'The provided email is not valid.'
	}

	let password = '',
		error = '',
		confirmError = '',
		subview = ''

	onMount(() => {
		if(getUrlParameter('mode', window.location.href) === 'resetPassword') {
			const oobCode = getUrlParameter('oobCode', window.location.href)
			authStoreVerifyPasswordCode(oobCode, err => {
				subview = 'resetPassword'
				if(err) {
					error = err.message
				}
			})
		}
	})

	function setNewPassword(e) {
		const oobCode = getUrlParameter('oobCode', window.location.href)
		authStoreConfirmPasswordReset(oobCode, password, err => {
			if(err) {
				confirmError = err.message
			} else {
				subview = 'resetPasswordSuccess'
			}
		})
	}

</script>

<section class="container">

	{#if subview === 'resetPassword'}
		<h2>
			Set password for Timetracker.One
		</h2>
		{#if error && error.length > 0}
			<p>
				{error}
			</p>
		{:else}
			{#if confirmError && confirmError.length > 0}
				<p>
					{confirmError}
				</p>
			{/if}
			<form on:submit|preventDefault={e => setNewPassword(e)}>
				<UiInput label="Password" type="password" bind:value={password} />
				
				<UiButton label="Set New Password" on:click={e => setNewPassword(e)} />
			</form>
		{/if}
	{:else if subview === 'resetPasswordSuccess'}
		<h2>
			New password is set!
		</h2>
		<p>
			<a href="/sign-in/">
				Go to sign in page
			</a>
		</p>
	{:else}
		<h2>
			Loading…
		</h2>
	{/if}

</section>


<style>
	.container {
		position: relative;
		max-width:540px;
		margin:60px auto;
		border:var(--c-grey) 0px solid;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:var(--shadow-box);
	}

	h2 {
		padding:24px 0;
	}

	span {
		display:inline-block;
		padding:0 0 0 12px;
	}

</style>