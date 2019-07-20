<script>
	import { onMount } from 'svelte';
	import { routerStore } from './stores/router-store.js'
	/*
		import { authStore, authInit } from './stores/auth-store.js'
	 */

	import MainNav from './ui/ui-main-nav.svelte'
	import TimelogView from './timelog/timelog-view.svelte'


	onMount(() => {
		// authInit()
		// textsStoreInit()
	})

</script>


	<MainNav />

	{#if $routerStore.view === 'timelog'}
		<TimelogView />
	{:else if $routerStore.view === 'reports'}
		Reports
	{:else if $routerStore.view === 'settings'}
		Settings
	{/if}

<style>
/*	.loading {
		position: absolute;
		top:50%;
		left:50%;
		transform: translateX(-50%) translateY(-50%);
		font-size:60px;
		color:#EEE;
	}

.loader, .loader:before, .loader:after {
	border-radius: 50%;
	width: 12px;
	height: 12px;
	animation: load 1200ms infinite ease-in-out;
	background:transparent;
	box-shadow: 0 -12px 0 0 #999;
}
.loader {
	position: absolute;
	top:50%;
	left:50%;
	animation-delay: 200ms;
	text-indent: -9999px;
	margin:6px 0 0 -6px;
}
.loader:before,
.loader:after {
	display:block;
	content: '';
	position: absolute;
	top: 0;
}
.loader:before {
	left: -18px;
	animation-delay: 0ms;
}
.loader:after {
	left:18px;
	animation-delay: 400ms;
}

@keyframes load {
	0%,
	80%,
	100% {
		box-shadow: 0 -12px 0 0 #999;
	}
	40% {
		box-shadow: 0 -24px 0 0 #999;
	}
}*/
</style>