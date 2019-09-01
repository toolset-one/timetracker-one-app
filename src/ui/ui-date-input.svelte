<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { trailingZero } from '../helpers/helpers.js'

	const dispatch = createEventDispatcher()

	export let active = false
	export let value = new Date()

	let year = '2000'
	let month = '01'
	let day = '01'

	onMount(() => {
		year = value.getFullYear()
		month = trailingZero(value.getMonth() + 1)
		day = trailingZero(value.getDate())
	})


</script>

<div class="wrapper {active ? 'active' : ''}" on:click={e => dispatch('click')}>
	<input
		type="text" class="month" bind:value={month} placeholder="mm" min="1" max="12" maxlength="2" disabled>
	<span>–</span>
	<input
		type="text" class="day" bind:value={day} placeholder="dd" min="1" max="31" maxlength="2" disabled>
	<span>–</span>
	<input
		type="text" class="year" bind:value={year} placeholder="yyyy" min="2000" max="2999" maxlength="4" disabled>

</div>

<style>
.wrapper {
	display:inline-block;
	font-variant-numeric: tabular-nums;
	border-radius:6px;
	padding:0px 12px;
}

.wrapper.active {
	background:#F7F5F2;
}

input {
	-webkit-appearance:none;
	display:inline-block;
	margin:0;
	border:0;
	width:2ch;
	padding:9px 0 9px 0;
	line-height:24px;
	font-size:14px;
	background:transparent;
	border-radius:0;
	box-shadow:none;
	caret-color:#26231E;
	color:#26231E;
	font-variant-numeric: tabular-nums;
	font-family: monospace;
	cursor: pointer;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

.year {
	width:4ch;
}
</style>