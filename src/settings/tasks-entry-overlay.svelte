<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { i18n } from '../stores/i18n-store.js'
	import { tasksStore, tasksStoreDeleteEntry } from '../stores/tasks-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiIcon from '../ui/ui-icon.svelte'

	export let id = null

	const dispatch = createEventDispatcher()

	let opened = false,
		hovered = false,
		interval,
		stopwatchDuration = 0

	$: entryData = $tasksStore.json ? $tasksStore.json[id] : {
		task: null
	}

	onMount(async () => {
		opened = true
	})

	function openColor(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileColor',
			id
		})
	}

	function openTitle(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileTitle',
			id
		})
	}


	function close() {
		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
	}

	export function externalClose() {
		close()
	}

</script>

<div class="wrapper {opened ? 'opened' : ''}">
	<div
		class="attr title"
		on:click={e => openTitle(e)}>
		<div class="attr-icon">
			<UiIcon type='pen-big' size="big" color="var(--c-darkgrey)" />
		</div>
		<span class="attr-value">
			{entryData && entryData.title.length > 0
					? entryData.title 
					: $i18n.NO_TITLE}
		</span>
	</div>
	<div class="attr color"
		on:click={e => openColor(e)}>
		<div class="attr-icon">
			<div class="color-icon" style="background-color:{entryData.color}"></div>
		</div>
		<span class="attr-value" style="color:{entryData.color}">
			{$i18n.COLOR}
		</span>
	</div>
	
	<footer>
		<UiButton
			label="Delete"
			color="red"
			on:click={e => tasksStoreDeleteEntry(id) && dispatch('close')} />
	</footer>
</div>

<style>
	.wrapper {
		position: fixed;
		bottom:0;
		left:12px;
		right:12px;
		z-index:1010;
		background:#FFF;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		overflow:hidden;
		opacity:0;
		transform:translateY(100%);
		transition: transform 200ms ease, opacity 200ms ease;
	}

	.opened {
		transform:translateY(0);
		opacity:1;
	}

	.attr {
		position: relative;
		padding:12px;
		display:flex;
		flex-direction: row wrap;
	}

	.attr:after {
		content:'';
		position: absolute;
		bottom:0;
		left:54px;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		.attr:after {
			background:var(--c-grey);
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.attr-icon {
		padding:9px;
		width:42px;
		height:42px;
	}

	.color-icon {
		width:24px;
		height:24px;
		border-radius: 6px;
		background:#333;
	}

	.attr-value {
		flex:1;
		line-height:42px;
		font-size:16.5px;
		font-weight:400;
	}

	.attr.comment .attr-value {
		line-height:24px;
		padding:9px 0;
	}

	.attr-value small {
		position: relative;
		top:-5px;
		padding:0 0 0 2px;
		font-size:10px;
		font-weight:600;
	}

	.attr-button {
		height:42px;
	}

	footer {
		padding:12px;
		text-align: right;
	}
</style>