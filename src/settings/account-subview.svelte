<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { i18n } from '../stores/i18n-store.js'
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { userStore, userStoreSetUsername, userStoreSetLanguage } from '../stores/user-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'
	import UiRadio from '../ui/ui-radio.svelte'

	const LANGUAGE_OPTIONS = [{
		title: 'English',
		value: 'en'
	}, {
		title: 'Deutsch',
		value: 'de'
	}]

	let username = '',
		usernameFocused = false,
		usernameInfo = '',
		usernameDebounce,
		languageNow = 'en'

	onMount(() => {
		userStore.subscribe(data => {
			languageNow = data.language
		})
	})

	function usernameFocus(e) {
		const { USERNAME_UP_TO_DATE } = get(i18n)
		usernameInfo = USERNAME_UP_TO_DATE
		usernameFocused = true
	}

	function usernameBlur(e) {
		usernameInfo = usernameDebounce ? usernameInfo : ''
		usernameFocused = false
	}

	function usernameKeydown(e) {

		const { USERNAME_WILL_BE_UPDATED } = get(i18n)
		usernameInfo = USERNAME_WILL_BE_UPDATED

		if(usernameDebounce) {
			clearTimeout(usernameDebounce)
		}

		const { USERNAME_UP_TO_DATE } = get(i18n)

		usernameDebounce = setTimeout(() =>
			userStoreSetUsername(username, success => {
				usernameInfo = USERNAME_UP_TO_DATE
				usernameDebounce = setTimeout(() => {
					usernameInfo = usernameFocused ? USERNAME_UP_TO_DATE : ''
				}, 1000)
			})
		, 500)
	}


	function languageChanged() {
		userStoreSetLanguage(languageNow)
	}

</script>

<header class="bp-{$uiStore.breakpoint}">
	<!--<div class="subview-title">
		<h2>
			Account
		</h2>
	</div>-->
	<div class="sign-out-button-wrapper">
		<UiButton label="{$i18n.SIGN_OUT}" on:click={e => authSignOut()} />
	</div>
</header>

<section>

	<div class="container">
		<h2>
			{$i18n.YOUR_ACCOUNT}
		</h2>
		
		<UiInput
			label="{$i18n.USERNAME}"
			type="text"
			bind:value={username}
			on:focus={e => usernameFocus(e)}
			on:blur={e => usernameBlur(e)}
			on:keydown={e => usernameKeydown(e)} />
		<small>
			{usernameInfo}
		</small>


		<p>
			{$i18n.LANGUAGE}
		</p>
		<UiRadio
			options={LANGUAGE_OPTIONS}
			bind:value={languageNow}
			on:change={e => languageChanged()} />
	</div>

	<!-- <p>	
		Sprache<br />
		Währung<br />
		Stunden exportieren Format<br />
		Zeitzone<br />

		E-Mail<br />
		Name<br />
		Password<br />
	</p> -->
</section>

<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	header.bp-xs {
		margin:12px;
	}

	.subview-title {
		display:flex;
		flex-flow: row wrap;
		font-size:0;
		width:50%;
	}

	.sign-out-button-wrapper {
		flex: 1;
		text-align: right;
	}

	section {
		max-width:960px;
		margin:24px auto 24px auto;
	}

	.container {
		position: relative;
		margin:0 auto 24px auto;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:var(--shadow-box);
	}

	h2 {
		padding:24px 0;
	}

	small {
		margin:6px 0 24px 0;
		display:block;
		height:18px;
	}

</style>