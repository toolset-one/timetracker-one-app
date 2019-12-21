<script>
	import { onMount } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { i18n } from '../stores/i18n-store.js'
	import { reportsStore, reportsStoreBarchartData, reportsStoreSetActive } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	$: tasks = (Object.keys($reportsStoreBarchartData.tasks).map(taskId => {
		return {
			taskId,
			duration: $reportsStoreBarchartData.tasks[taskId],
			title: $tasksStore.json[taskId] ? $tasksStore.json[taskId].title : 'No Task' 
		}
	})).sort((a, b) => {
    	if(a.title < b.title) {
    		return -1
    	}
    	
    	if(a.title > b.title) {
    		return 1
    	}

    	return 0
	})

</script>

<div class="legend-wrapper">
	{#each tasks as task, i (task.taskId)}
		<div
			class="segment {$reportsStore.active === task.taskId || !$reportsStore.active ? '' : 'inactive'}"
			on:mouseenter={e => reportsStoreSetActive(task.taskId)}
			on:mouseleave={e => reportsStoreSetActive(null)}
			style="background:{$tasksStore.json[task.taskId] ? $tasksStore.json[task.taskId].color : '#333'};">
				{!$tasksStore.json[task.taskId] 
					? $i18n.NO_TASK
					: $tasksStore.json[task.taskId].title.length > 0 
						? $tasksStore.json[task.taskId].title 
						: $i18n.NO_TITLE}
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
		transition: all 100ms ease;
	}

	.segment.inactive {
		opacity:0.5;
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