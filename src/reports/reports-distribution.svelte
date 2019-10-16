<script>
	import { onMount } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { reportsStore, reportsStoreBarchartData } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	let hoveredId = null

	$: tasks = Object.keys($reportsStoreBarchartData.tasks).map(taskId => {
		return {
			taskId,
			duration: $reportsStoreBarchartData.tasks[taskId]
		}
	}).sort((a, b) => b.duration - a.duration)

</script>

<h2>
	{dateGetHours($reportsStoreBarchartData.total)}:{dateGetMinutes($reportsStoreBarchartData.total)} total
</h2>

<div class="distribution-wrapper">
	{#each tasks as task, i (task.taskId)}
		<div
			class="segment {$reportsStore.active === task.taskId || !$reportsStore.active ? '' : 'inactive'}"
			on:mouseenter={e => hoveredId = task.taskId}
			on:mouseleave={e => hoveredId = null}
			style="width:{task.duration / ($reportsStoreBarchartData.total / 100)}%;">
				<div class="bar" style="background:{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].color : '#333'};">
					{dateGetHours(task.duration)}:{dateGetMinutes(task.duration)}
				</div>
				<span class="title">
					{!$tasksStore.json[task.taskId] 
						? 'No Task'
						: $tasksStore.json[task.taskId].title.length > 0 
							? $tasksStore.json[task.taskId].title 
							: 'No Title'}
				</span>

				{#if hoveredId === task.taskId || $reportsStore.active === task.taskId}
					<div
						class="tooltip"
						style="background:{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].color : '#333'};">		
						<span class="tooltip-title">
							{!$tasksStore.json[task.taskId] 
								? 'No Task'
								: $tasksStore.json[task.taskId].title.length > 0 
									? $tasksStore.json[task.taskId].title 
									: 'No Title'}
						</span>
						{dateGetHours(task.duration)}:{dateGetMinutes(task.duration)}
					</div>
				{/if}
		</div>
	{/each}

	{#if tasks.length === 0}
		<p>
			There are no times logged for the choosen filters.
		</p>
	{/if}
</div>

<style>

	.distribution-wrapper {
		position: relative;
		width:100%;
		display:flex;
		flex-direction: row wrap;
		height:42px;
		background:rgba(0, 0, 0, .1);
		border-radius: 6px;
	}

	p {
		padding:6px;
		width:100%;
		text-align: center;
	}

	.segment {
		position: relative;
		transition: opacity 100ms ease;
	}

	.segment.inactive {
		opacity: .25;
	}

	.segment:first-child .bar {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.segment:last-child .bar {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.segment .bar {
		height:42px;
		line-height: 42px;
		font-size:14px;
		color:#FFF;
		padding:0 0 0 6px;
		max-width: 100%;
		overflow:hidden;
		text-overflow:ellipsis;
	}

	.segment .title {
		display:block;
		line-height:24px;
		font-size: 14px;
		color:var(--x-middlegrey);
		max-width:100%;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.tooltip {
		position: absolute;
		bottom:100%;
		left:50%;
		max-width:240px;
		padding:6px 12px;
		border-radius: 6px;
		transform:translateX(-50%);
		color:#FFF;
		line-height:18px;
		font-size: 14px;
		text-align:center;
		margin:-6px 0 6px 0;
		box-shadow:var(--shadow-overlay);
	}

	.tooltip:after {
		content:'';
		display:block;
		width:6px;
		height:6px;
		background:inherit;
		transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
		position: absolute;
		top:100%;
		left:50%;
	}

	.tooltip-title {
		display:block;
		font-weight:600;
	}

	
</style>