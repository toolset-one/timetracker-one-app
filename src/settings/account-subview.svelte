<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { userStore, userStoreSetUsername } from '../stores/user-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'

	let username = '',
		usernameFocused = false,
		usernameInfo = '',
		usernameDebounce

	onMount(() => {
		userStore.subscribe(data =>
			setTimeout(() => username = data.username || '')
		)
	})

	function usernameFocus(e) {
		usernameInfo = 'Username is up to date.'
		usernameFocused = true
	}

	function usernameBlur(e) {
		usernameInfo = usernameDebounce ? usernameInfo : ''
		usernameFocused = false
	}

	function usernameKeydown(e) {

		usernameInfo = 'Username will be updated…'

		if(usernameDebounce) {
			clearTimeout(usernameDebounce)
		}

		usernameDebounce = setTimeout(() =>
			userStoreSetUsername(username, success => {
				usernameInfo = 'Username is up to date.'
				usernameDebounce = setTimeout(() => {
					usernameInfo = usernameFocused ? 'Username is up to date.' : ''
				}, 1000)
			})
		, 500)
	}

</script>

<header class="bp-{$uiStore.breakpoint}">
	<!--<div class="subview-title">
		<h2>
			Account
		</h2>
	</div>-->
	<div class="sign-out-button-wrapper">
		<UiButton label="Sign Out" on:click={e => authSignOut()} />
	</div>
</header>

<section>

	<div class="container">
		<h2>
			Your Account
		</h2>
		
		<UiInput
			label="Username"
			type="text"
			bind:value={username}
			on:focus={e => usernameFocus(e)}
			on:blur={e => usernameBlur(e)}
			on:keydown={e => usernameKeydown(e)} />
		<small>
			{usernameInfo}
		</small>
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