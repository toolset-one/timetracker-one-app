<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { getWindowWidth } from '../helpers/helpers.js'
	import { teamStoreInvite } from '../stores/team-store.js'

	import UiInput from '../ui/ui-input.svelte'
	import UiButton from '../ui/ui-button.svelte'

	let email = '',
		username = '',
		emailEl,
		top = 0,
		right = 0,
		alreadyClosed = false,
		opened = false,
		el

	$: emailValid = validateEmail(email)

	const dispatch = createEventDispatcher()

	onMount(() => {
		const boundingRect = document.querySelector('.add-button-wrapper').getBoundingClientRect()
		top = boundingRect.top
		right = getWindowWidth() - boundingRect.left - boundingRect.width

		opened = true

		el.querySelector('input[type="email"]').focus()
	})

	/* function keydown(e) {
		if( e.keyCode === 27) { // ESC
			alreadyClosed = true
			dispatch('close', '')
		} else if( e.keyCode === 13) { // ENTER
			save()
		}
	} */

	function save() {
		if(!alreadyClosed) {
			teamStoreInvite(email, username, success => {
				console.log('SUCCESS')
			})

			opened = false
			dispatch('close', '')
		}
	}

	function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

</script>

<div
	bind:this={el}
	style="{
		'top:'+ top +'px;'+
		'right:'+ right +'px;'
	}"
	class="wrapper {opened ? 'opened' : ''}">
	<div bind:this={emailEl}>
		<div class="form-item">
			Please provide the e-mail address of the one you'd like to invite. After clicking the button, we will send an invitation to join your team.
		</div>
		<div class="form-item">
			<UiInput 
				type="email"
				label="E-Mail of new member"
				autofocus={true}
				bind:value={email} />
		</div>
		<div class="form-item">
			<UiInput 
				type="text"
				label="Name of new member"
				bind:value={username} />
		</div>
		<div class="form-item">
			<UiButton
				label="Send Invitation"
				disabled={!emailValid}
				on:click={e => save()} />
		</div>
	</div>
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
		box-shadow:0 1px 1px rgba(0, 0, 0, .05), 0 2px 3px rgba(0, 0, 0, .1);
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