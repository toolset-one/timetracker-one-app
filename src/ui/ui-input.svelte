<script>
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let type = 'text'
	export let value = ''
	export let disabled = false

	let focused = false

	$: disabledVal = disabled ? 'disabled' : ''

	function focus(e) {
		focused = true
		dispatch('focus')
	}

	function blur(e) {
		focused = false
		dispatch('blur')
	}

	function keydown(e) {
		dispatch('keydown', e.keyCode)
	}

</script>

<div 
	class="wrapper 
		{focused ? 'focused' : ''}
		{disabled ? 'disabled' : ''}
		{value.length > 0 ? 'filled' : ''}"
	on:keydown={e => keydown(e)}>
	<label>
		{label}
	</label>
	{#if type === 'email'}
		<input
			type="email"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}>
	{:else if type === 'password'}
		<input
			type="password"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}>
	{:else}
		<input
			type="text"
			bind:value={value}
			on:focus={e => focus(e)}
			on:blur={e => blur(e)}
			{disabled}>
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
	color:#26231E;
}

.wrapper.focussed input,
.wrapper.filled input {
	padding:22px 17px 6px 17px;
}

.wrapper.disabled input {
	border-color:#F7F5F2;
}

.wrapper.disabled:hover input, .wrapper.disabled:focus input {
	border-color:#F7F5F2;
}

.wrapper input {
	-webkit-appearance:none;
	width:100%;
	max-width:100%;
	margin:0;
	border:#CCC9C4 1px solid;
	padding:14px 17px 14px 17px;
	line-height:24px;
	font-size:16px;
	background:#FFF;
	border-radius:6px;
	box-shadow:none;
	caret-color:#26231E;
	box-shadow:0 0 0 100px #FFF inset;
	outline-style:solid;
	outline-color:rgba(0, 0, 255, .25);
	outline-width:0;
	outline-offset:2px;
	color:#26231E;
	transition: border-color 100ms ease;
}

.wrapper:hover input, .wrapper:focus input {
	border-color:#26231E;
}
</style>