<script>
	import { onMount } from 'svelte';
	import { authStore, authSendEmail, authAnonymous } from '../stores/auth-store.js'

	import UiButton from '../ui/ui-button.svelte'

	let internSubview = 'welcome',
		email = '',
		emailSuccessfullySent = false

	onMount(() => {
		
	})

	function submit(e) {
		e.preventDefault()
		authSendEmail(email, success => {
			if(success) {
				emailSuccessfullySent = true
			}
		})
	}

</script>

<section class="container">

	{#if internSubview === 'welcome'}
		<h2>
			Welcome to Timetracker.One
		</h2>
		<div class="decisions-wrapper">
			<div class="anonymous">
				<UiButton label="Try App For Free" on:click={e => authAnonymous()} />
				<p>
					If you are new, you can try the app without creating an account.
				</p>
			</div>
			<div class="email">
				<UiButton label="Sign In To Account" />
				<p>
					If you already have an account, you can sign to your account.
				</p>
			</div>
		</div>
	{/if}


	<!--<h2>
		Sign In
	</h2>

	{#if !emailSuccessfullySent}

	<p>
		Type in your email address. You'll get an link to sign in to your mailbox.
	</p>

	<form on:submit|preventDefault={e => submit(e)}>

		<div class="input-wrapper">
			<input type="email" placeholder=" " bind:value={email}>
			<label>
				E-Mail
			</label>
		</div>

		<button class="button">
			Sign In →
		</button>

	</form>

	{:else}

	<p>
		We just sent an email to your address. It contains a link to sign you in. This window can be closed now.
	</p>
	{/if}-->

</section>


<style>
	.container {
		position: relative;
		width:540px;
		margin:60px auto;
		border:#CCC9C4 1px solid;
		border-radius: 6px;
		background:#FFF;
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
		text-align: center;
		padding:23px 23px 24px 23px;
	}

	.decisions-wrapper {
		display:flex;
		flex-direction: row wrap;
		text-align:center;
	}

	.decisions-wrapper >div {
		width:50%;
		padding:0 23px 23px 23px;
	}

	.decisions-wrapper >div p {
		padding:12px 0 0 0;
	}
</style>