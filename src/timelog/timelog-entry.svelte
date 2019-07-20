<script>
	import { onMount } from 'svelte';
	import UiButton from '../ui/ui-button.svelte'

	export let data = {}

	let hovered = false

</script>

	<li
		class="{hovered ? 'hovered' : ''}"
		on:mouseenter={e => hovered = true}
		on:mouseleave={e => hovered = false}>
		<div class="stopwatch">
			<UiButton type="entry" icon="play" hovered={hovered} color="{hovered ? '#26231E' : '#E6E4E1'}" />
		</div>
		<div class="duration">
			0<span>:</span>34<small>00</small>
		</div>
		<div class="project">
			<div>
				No Project
			</div>
		</div>
		<div class="comment {data.comment.length === 0 ? 'no-comment' : ''}">
			{data.comment.length > 0 ? data.comment : 'No comment'}
		</div>
		<div class="nav">
			<UiButton type="entry" icon="burger" hovered={hovered} color="{hovered ? '#26231E' : '#E6E4E1'}" />
		</div>
	</li>
<style>

	li {
		display:flex;
		flex-flow: row wrap;
		position: relative;
		margin:0;
		padding:0;
		min-height:48px;
		background:#FFF;
	}

	li:after {
		content:'';
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height: 1px;
		background:#E6E4E1;
	}

	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { 
		li:after {
			background:#CCC9C4;
			transform:scale(1, 0.5);
			transform-origin: 0 100%;
		}
	}

	.hovered {
		background:#F5F3F0;
	}

	.stopwatch {
		height:48px;
		padding:6px;
	}

	.duration {
		width:68px; /* max length for 44:44:44 */
		height:48px;
		line-height:48px;
		padding:0 6px;
		font-size:14px;
		font-weight:600;
		cursor:pointer;
	}

	.duration:hover {
		background:rgba(0, 0, 0, .05);
	}

	.duration span {
		
	}

	.duration small {
		position: relative;
		top:-3px;
		padding:0 0 0 2px;
		font-size:10px;
		font-weight:700;
	}

	.project {
		padding:6px;
		cursor:pointer;
	}

	.project:hover {
		background:rgba(0, 0, 0, .05);
	}

	.project >div {
		line-height:36px;
		font-size:14px;
		background:#68B359;
		border-radius: 6px;
		padding:0 12px;
		font-weight:700;
		color:#FFF;
	}

	.comment {
		flex: 1;
		line-height:48px;
		padding:0 48px 0 6px;
		font-size:14px;
		cursor:pointer;
		white-space: nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}

	.comment:hover {
		background:rgba(0, 0, 0, .05);
	}

	.no-comment {
		color:#99938A;
	}

	.nav {
		position: absolute;
		top:0;
		right:0;
		height:48px;
		padding:6px;
		background:#FFF;
	}

	.hovered .nav {
		background:#F5F3F0;
	}

	/* .nav:after {
		content:'';
		display:block;
		position: absolute;
		top:0;
		right:100%;
		width:12px;
		height:100%;
		background: linear-gradient(to left, rgba(245,243,240,1) 0%,rgba(245,243,240,0) 100%);
	}*/
</style>