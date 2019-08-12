<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'


	const dispatch = createEventDispatcher()


	onMount(async () => {

	})



</script>
<div
	class="backdrop"
	transition:fade="{{delay: 0, duration: 100}}"
	on:click={e => dispatch('close', '')}></div>

<style>
	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .5);
		z-index:1000;
	}
</style>