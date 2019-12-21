<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { isEmailValid } from '../helpers/helpers.js'
	import { i18n } from '../stores/i18n-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { authStore, authSignUp, authSignIn } from '../stores/auth-store.js'
	import { routerStore } from '../stores/router-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let isInvitation = false,
		email = '',
		emailError = '',
		emailEl,
		password = '',
		passwordError = '',
		passwordEl,
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

			if(!get(uiStore).isTouchDevice) {
				passwordEl.focus()
			}
		} else {
			if(!get(uiStore).isTouchDevice) {
				emailEl.focus()
			}
		}
		
	})

	function signUp() {

		const {
			EMAIL_TAKEN,
			EMAIL_NOT_VALID,
			CONNECTION_ERROR
		} = get(i18n)

		authSignUp(email, password, code).then(res => {
			authSignIn(email, password)
				.then(() => Page('/timelog/'))
				.catch(() => Page('/sign-in/'))
		}).catch(err => {
			if(err.code === 'duplicate-key') {
				emailError = EMAIL_TAKEN
			} else if(err.code === 'email-not-valid') {
				emailError = EMAIL_NOT_VALID
			} else if(err.code === 'not-connected') {
				emailError = CONNECTION_ERROR
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
		{isInvitation ? $i18n.SIGN_UP_TO_TEAM : $i18n.SIGN_UP_TO_TIMETRACKER_ONE}
	</h2>

	{#if isInvitation}
		<p>
			{$i18n.INVITATION_GUIDE}
		</p>
	{/if}

	<form on:keydown={e => keydown(e)}>

		<div class="form-item">
			<UiInput
				label="{$i18n.EMAIL}"
				type="email"
				bind:this={emailEl}
				bind:value={email}
				disabled={isInvitation}
				bind:error={emailError} />
		</div>
		<div class="form-item">
			<UiInput
				label="{$i18n.PASSWORD}"
				type="password"
				bind:this={passwordEl}
				bind:value={password}
				bind:error={passwordError} />
		</div>
		
		<UiButton
			label="{isInvitation ? $i18n.JOIN_TEAM : $i18n.CREATE_NEW_ACCOUNT_BUTTON}"
			on:click={e => signUp(e)} />
		{#if !isInvitation}
			<span>
				{$i18n.OR}
				<a href="/sign-in/">
					{$i18n.GO_TO_SIGN_IN_PAGE}
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
		border:var(--c-grey) 0px solid;
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

	p {
		margin:0 0 24px 0;
	}

</style>