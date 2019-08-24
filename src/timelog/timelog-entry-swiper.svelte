<script>
	import { onMount } from 'svelte';
	import { uiStore } from '../stores/ui-store.js'

	let el

	onMount(() => {
		if(el) {
			el.scrollLeft = 50
		}
	})
	
</script>

{#if $uiStore.isTouchDevice}
	<div class="wrapper" bind:this={el}>
		<div class="inner-before"></div>
		<div class="inner">
			<slot></slot>
		</div>
		<div class="inner-after"></div>
	</div>
{:else}
	<slot></slot>
{/if}



<style>

	.wrapper {
		display:block;
		max-width:100%;
		overflow-x: scroll;
		overflow-y:show;
		scroll-snap-type: x mandatory;
		white-space: nowrap;
		font-size:0;
		display:flex;
		flex-flow:row;
	}

	.inner-before, .inner-after {
		min-width:100%;
		max-width: 100%;
		height:100%;
		background:#EEE;
	}


	.inner {
		display:flex;
		flex-flow:row wrap;
		background:#FFF;
		min-width:100%;
		max-width: 100%;
		margin:0;
		scroll-snap-align: start;
	}	

</style>