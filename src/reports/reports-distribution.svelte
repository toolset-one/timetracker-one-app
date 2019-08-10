<script>
	import { onMount } from 'svelte';
	import { reportsStoreBarchartData } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	let el

	$: tasks = Object.keys($reportsStoreBarchartData.tasks).map(taskId => {
		return {
			taskId,
			duration: $reportsStoreBarchartData.tasks[taskId]
		}
	}).sort((a, b) => b.duration - a.duration)


	onMount(() => {

		
	})

</script>

<h2>
	{dateGetHours($reportsStoreBarchartData.total)}:{dateGetMinutes($reportsStoreBarchartData.total)} total
</h2>

<div class="distribution-wrapper">
	{#each tasks as task}
		<div class="segment" style="
			width:{task.duration / ($reportsStoreBarchartData.total / 100)}%;
			background:{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].color : '#333'};">
				{dateGetHours(task.duration)}:{dateGetMinutes(task.duration)}
				<span>
					{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].title : 'No Task'}
				</span>
		</div>
	{/each}
</div>

<style>

	h2 {
		margin-top:24px;
	}

	.distribution-wrapper {
		position: relative;
		width:100%;
		display:flex;
		flex-direction: row wrap;
	}

	.segment {
		position: relative;
		height:42px;
		line-height: 42px;
		font-size:14px;
		color:#FFF;
		padding:0 0 0 3px;
	}

	.segment:first-child {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	.segment:last-child {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.segment span {
		display:block;
		position: absolute;
		top:100%;
		left:0;
		line-height:24px;
		font-size: 14px;
		color:#66625C;
		max-width:100%;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	
</style>