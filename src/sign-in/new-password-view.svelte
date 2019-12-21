<script>
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { i18n } from '../stores/i18n-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { authStoreNewPassword } from '../stores/auth-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let email = '',
		emailError = '',
		emailEl

	$: ERROR_MAP = {
		'auth/invalid-email': $i18n.EMAIL_NOT_VALID
	}

	onMount(() => {
		if(!get(uiStore).isTouchDevice) {
			emailEl.focus()
		}
	})

	function getNewPassword() {

		const { CONNECTION_ERROR } = get(i18n )
		

		authStoreNewPassword(email).then(res => {

		}).catch(err => {
			if(err.code === 'not-connected') {
				emailError = CONNECTION_ERROR
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
		{$i18n.NEW_PASSWORD_FOR}
	</h2>

	<form on:keydown={e => keydown(e)}>

		<div class="form-item">
			<UiInput
				label="{$i18n.EMAIL}"
				type="email"
				bind:this={emailEl}
				bind:value={email}
				bind:error={emailError} />
		</div>
		
		<UiButton label="{$i18n.GET_NEW_PASSWORD}" on:click={e => getNewPassword()} />
		<span>
			{$i18n.OR}
			<a href="/sign-in/">
				{$i18n.GO_TO_SIGN_IN_PAGE}
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

	.form-item {
		margin:0 0 24px 0;
	}

</style>