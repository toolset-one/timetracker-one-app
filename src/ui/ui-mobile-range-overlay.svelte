<script>
	import { onMount, createEventDispatcher } from 'svelte'

	import { dateGetHumanDate } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiIcon from '../ui/ui-icon.svelte'

	export let rangeOption = ''
	export let firstDate = new Date()
	export let lastDate = new Date()

	const dispatch = createEventDispatcher()

	let opened = false

	onMount(async () => {
		opened = true
	})

	function openStandardRanges(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileStandardRanges'
		})
	}


	function openFirstDate(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileFirstDate'
		})
	}


	function openLastDate(e) {
		e.stopPropagation()
		dispatch('open', {
			component: 'mobileLastDate'
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
		class="attr standard-ranges"
		on:click={e => openStandardRanges(e)}>
		<div class="attr-icon">
			<UiIcon type='clock-big' size="big" color="#26231E" />
		</div>
		<span class="attr-value">
			{rangeOption}
		</span>
	</div>

	<div
		class="attr first-date"
		on:click={e => openFirstDate(e)}>
		<div class="attr-icon">
			<UiIcon type='clock-big' size="big" color="#26231E" />
		</div>
		<span class="attr-value">
			{dateGetHumanDate(firstDate)}
		</span>
	</div>

	<div
		class="attr last-date"
		on:click={e => openLastDate(e)}>
		<div class="attr-icon">
			<UiIcon type='clock-big' size="big" color="#26231E" />
		</div>
		<span class="attr-value">
			{dateGetHumanDate(lastDate)}
		</span>
	</div>
	
	<footer>

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
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.attr-icon {
		padding:9px;
		width:42px;
		height:42px;
	}

	.attr-value {
		flex:1;
		line-height:42px;
		font-size:16.5px;
		font-weight:400;
	}

	footer {
		padding:12px;
	}
</style>