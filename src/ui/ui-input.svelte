<script>
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher()

	export let label = 'No Label'
	export let type = 'text'
	export let value = ''

	let focussed = false

</script>

<div class="input-wrapper {focussed ? 'focussed' : ''} {value.length > 0 ? 'filled' : ''}">
	<label>
		{label}
	</label>
	{#if type === 'email'}
		<input type="email" bind:value={value} on:focus={e => focussed = true} on:blur={e => focussed = false}>
	{:else if type === 'password'}
		<input type="password" bind:value={value} on:focus={e => focussed = true} on:blur={e => focussed = false}>
	{:else}
		<input type="text" bind:value={value} on:focus={e => focussed = true} on:blur={e => focussed = false}>
	{/if}
</div>

<style>
.input-wrapper {
	position:relative;
	margin:0 0 30px 0;
	max-width:100%;
}

.input-wrapper label {
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

.input-wrapper.focussed label,
.input-wrapper.filled label {
	top:15px;
	color:#26231E;
}

.input-wrapper.focussed input,
.input-wrapper.filled input {
	padding:22px 17px 6px 17px;
}

.input-wrapper input {
	-webkit-appearance:none;
	width:100%;
	max-width:100%;
	margin:0;
	border:0;
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
}

.input-wrapper:hover input, .input-wrapper:focus input {
	border-color:#26231E;
}
</style>