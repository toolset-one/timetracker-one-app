<script>
	import { onMount } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { reportsStoreBarchartData } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	$: tasks = Object.keys($reportsStoreBarchartData.tasks).map(taskId => {
		return {
			taskId,
			duration: $reportsStoreBarchartData.tasks[taskId]
		}
	}).sort((a, b) => b.duration - a.duration)

</script>

<div class="legend-wrapper">
	{#each tasks as task, i (task.taskId)}
		<div
			class="segment"
			style="background:{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].color : '#333'};">
				{!$tasksStore.json[task.taskId] 
					? 'No Task'
					: $tasksStore.json[task.taskId].title.length > 0 
						? $tasksStore.json[task.taskId].title 
						: 'No Title'}
				<span>
					{dateGetHours(task.duration)}:{dateGetMinutes(task.duration)}
				</span>
		</div>
	{/each}
</div>

<style>

	.legend-wrapper {

	}

	p {
		padding:6px;
		width:100%;
		text-align: center;
	}

	.segment {
		float:left;
		height:30px;
		line-height: 30px;
		font-size:14px;
		font-weight:600;
		color:#FFF;
		padding:0 0 0 12px;
		border-radius: 6px;
		margin:0 6px 6px 0;
		-webkit-font-smoothing:antialiased;
	}

	span {
		display: inline-block;
		background:rgba(0, 0, 0, .1);
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding:0 6px;
		margin:0 0 0 6px;
		font-weight:400;
	}

	
</style>