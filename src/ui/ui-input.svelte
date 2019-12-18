<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let type = 'text'
	export let value = ''
	export let disabled = false
	export let error = ''

	let el,
		focused = false,
		prefilled = false

	$: disabledVal = disabled ? 'disabled' : ''

	onMount(() => {
		setTimeout(() => {
			if(el) {
				const inputEl = el.querySelector('input')
				if(inputEl) {
					inputEl.addEventListener('animationstart', () => prefilled = true)
				}
			}
		})
	})

	export function focus() {
		el.querySelector('input').focus()
	}

	function isFocused(e) {
		focused = true
		dispatch('focus')

		document.querySelector('div').dispatchEvent(new CustomEvent('set-last-input-as-key', {
			bubbles: true
		}))
	}

	function blur(e) {
		focused = false
		dispatch('blur')
	}

	function keydown(e) {
		prefilled = false
		error = ''
		dispatch('keydown', e.keyCode)
	}

	function mouseup(e) {
		if(focused) {
			window.requestAnimationFrame(() => {
				document.querySelector('div').dispatchEvent(new CustomEvent('set-last-input-as-key', {
					bubbles: true
				}))
			})
		}
	}

</script>

<div 
	bind:this={el}
	class="wrapper
		{focused ? 'focused' : ''}
		{disabled ? 'disabled' : ''}
		{value.length > 0 || prefilled ? 'filled' : ''}"
		on:keydown={e => keydown(e)}
		on:mouseup={e => mouseup(e)}>
	<label>
		{label}
	</label>
	{#if type === 'email'}
		<input
			type="email"
			bind:value={value}
			on:focus={e => isFocused(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{:else if type === 'password'}
		<input
			type="password"
			bind:value={value}
			on:focus={e => isFocused(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{:else}
		<input
			type="text"
			bind:value={value}
			on:focus={e => isFocused(e)}
			on:blur={e => blur(e)}
			{disabled}
			data-disable="true">
	{/if}

	{#if error && error.length > 0}
		<div class="error" transition:fade="{{delay: 0, duration: 100}}">
			{error}
		</div>
	{/if}

</div>

<style>
.wrapper {
	position:relative;
	margin:0;
	width:100%;
	max-width:560px;
}

.wrapper label {
	line-height:12px;
	position:absolute;
	top:50%;
	left:18px;
	font-size:12px;
	transform-origin:0 0;
	transform:translateY(-50%);
	padding:0;
	transition:top 100ms ease;
	color:#999;
	pointer-events:none;
}

.wrapper.focussed label,
.wrapper.filled label {
	top:15px;
	color:var(--c-darkgrey);
}

.wrapper.focussed input,
.wrapper.filled input {
	padding:22px 17px 6px 17px;
}

.wrapper.disabled input {
	border-color:var(--c-background);
}

.wrapper.disabled:hover input, .wrapper.disabled:focus input {
	border-color:var(--c-background);
}

.wrapper input {
	-webkit-appearance:none;
	width:100%;
	max-width:100%;
	margin:0;
	border:var(--c-grey) 1px solid;
	padding:14px 17px 14px 17px;
	line-height:24px;
	font-size:16px;
	background:#FFF;
	border-radius:6px;
	box-shadow:none;
	caret-color:var(--c-darkgrey);
	box-shadow:0 0 0 100px #FFF inset;
	outline-style:solid;
	outline-color:rgba(0, 0, 255, .25);
	outline-width:0;
	outline-offset:2px;
	color:var(--c-darkgrey);
	transition: border-color 100ms ease;
}

.wrapper:hover input, .wrapper:focus input {
	border-color:var(--c-darkgrey);
}

.wrapper input:-webkit-autofill {
	animation-duration: 50000s;
	animation-name: onautofillstart;
}

.error {
	position: absolute;
	top:100%;
	left:18px;
	background:var(--c-darkgrey);
	font-size:14px;
	line-height: 24px;
	margin:-3px 0 0 0;
	padding:0 12px;
	border-radius: 6px;
	color:#FFF;
	box-shadow:var(--shadow-overlay);
}

.error:after {
	content:'';
	display: block;
	width:6px;
	height:6px;
	position: absolute;
	top:0;
	left:50%;
	background:var(--c-darkgrey);
	transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
}

@keyframes onautofillstart { from {} }
</style>