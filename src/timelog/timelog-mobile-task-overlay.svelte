<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { timesStoreChangeTask } from '../stores/times-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import UiIcon from '../ui/ui-icon.svelte'

	export let id = null
	export let task = 0

	const dispatch = createEventDispatcher()

	let opened = false,
		tasksEl

	onMount(async () => {
		opened = true

		setTimeout(() => {
			tasksStore.subscribe(data => {

				var index = 0

				data.array.forEach((val, i) => {
					if(val.id === task) {
						index = i
					}
				})

				tasksEl.scrollTop = index * 42
			})
		})
	})


	function save() {
		const index = Math.round(tasksEl.scrollTop / 42)
		const unsubscribe = tasksStore.subscribe(data =>
			timesStoreChangeTask(id, data.array[index].id)
		)
		unsubscribe()

		opened = false
		setTimeout(() => {
			dispatch('close', '')
		}, 100)
	}

	export function externalClose() {
		save()
	}

</script>

<div class="wrapper {opened ? 'opened' : ''}">
	<header on:click={e => save()}>
		Edit Task
	</header>

	<div class="swiper">
		<div class="options tasks" bind:this={tasksEl}>
			<ul>
				<li></li>
				<li></li>
				<li></li>
				{#each $tasksStore.array as task}
					<li>
						{task.title}
					</li>
				{/each}
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<div class="indicator"></div>
	</div>
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
		transition: transform 100ms ease, opacity 100ms ease;
	}

	.opened {
		transform:translateY(0);
		opacity:1;
	}

	header {
		position: relative;
		height:42px;
		background:#FaFaFa;
		line-height: 42px;
		font-size:14px;
		padding:0 12px;
	}

	header .icon {
		position: absolute;
		top:0;
		right:0;
		padding:15px;
		cursor: pointer;
	}

	header:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		header:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.swiper {
		position: relative;
		display:flex;
		flex-direction: row;
	}

	.swiper:before, .swiper:after {
		content:'';
		display:block;
		height:126px;
		width:100%;
		position: absolute;
		top:0;
		left:0;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 12px,rgba(255, 255, 255, .5) 66.66666%);
		pointer-events: none;
	}

	.swiper:after {
		top:auto;
		bottom:0;
		transform:rotate(180deg);
	}

	.indicator {
		position: absolute;
		top:50%;
		left:50%;
		width:100%;
		height:42px;
		line-height: 42px;
		font-size:18px;
		text-align:center;
		transform:translateX(-50%) translateY(-50%);
		border-top:#E6E4E1 1px solid;
		border-bottom:#E6E4E1 1px solid;
		pointer-events: none;
	}

	.options {
		width:100%;
		max-height:294px;
		overflow-x:hidden;
		overflow-y:auto;
		-webkit-overflow-scrolling:touch;
		scroll-snap-type: y mandatory;
	}

	.options::-webkit-scrollbar {
		display: none;
	}

	ul {
		list-style: none;
		margin:0;
		padding:0;
		scroll-snap-align: start;
	}

	li {
		margin:0;
		padding:0 24px;
		height:42px;
		line-height:42px;
		font-size:18px;
		scroll-snap-align: start;
	}
</style>