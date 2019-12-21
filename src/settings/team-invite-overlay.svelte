<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { getWindowWidth, isEmailValid } from '../helpers/helpers.js'
	import { i18n } from '../stores/i18n-store.js'
	import { teamStoreInvite } from '../stores/team-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let email = '',
		username = '',
		top = 0,
		right = 0,
		alreadyClosed = false,
		opened = false,
		el

	$: emailValid = isEmailValid(email)

	const dispatch = createEventDispatcher()

	onMount(() => {
		const boundingRect = document.querySelector('.add-button-wrapper').getBoundingClientRect()
		top = boundingRect.top
		right = getWindowWidth() - boundingRect.left - boundingRect.width

		opened = true

		el.querySelector('input[type="email"]').focus()
	})

	function save() {
		if(!alreadyClosed) {
			teamStoreInvite(email, username, (err, res) => {
				console.log('SUCCESS?', err)
			})

			opened = false
			dispatch('close', '')
		}
	}

	function keydown(e) {
		console.log(e.keyCode)
		if( e.keyCode === 13) {
			save()
		}
	}

</script>

<div
	bind:this={el}
	style="{
		'top:'+ top +'px;'+
		'right:'+ right +'px;'
	}"
	class="wrapper {opened ? 'opened' : ''}">
	<form on:keydown={e => keydown(e)}>
		<div class="form-item">
			{$i18n.NEW_TEAM_GUIDE}
		</div>
		<div class="form-item">
			<UiInput 
				type="email"
				label="{$i18n.EMAIL_OF_NEW_MEMBER}"
				autofocus={true}
				bind:value={email} />
		</div>
		<div class="form-item">
			<UiInput 
				type="text"
				label="{$i18n.NAME_OF_NEW_MEMBER}"
				bind:value={username} />
		</div>
		<div class="form-item">
			<UiButton
				label="{$i18n.SEND_INVITATION}"
				disabled={!emailValid}
				on:click={e => save()} />
		</div>
	</form>
</div>

<style>

	.wrapper {
		position: absolute;
		top:0;
		right:0;
		width:560px;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:var(--shadow-box);
		transform: scale(0);
		transform-origin: 100% 0;
		transition: transform 100ms ease;
	}

	.opened {
		transform: scale(1);
	}

	.form-item {
		padding:24px;
	}

	.form-item + .form-item {
		padding-top:0;
	}
</style>