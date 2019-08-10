<script>
	import { onMount } from 'svelte';
	import { routerStore } from '../stores/router-store.js'
	import { reportsStoreBarchartData } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	export let date = new Date()

	$: databaseDate = dateToDatabaseDate(date)
	$: dayTotal = $reportsStoreBarchartData.days[databaseDate] ? $reportsStoreBarchartData.days[databaseDate].total : 0
	$: barHeight = dayTotal / ($reportsStoreBarchartData.totalDayMax / 100)


	onMount(() => {

	})

</script>

{#if $reportsStoreBarchartData.days[databaseDate]}
	<div class="bar-wrapper">
		{#if dayTotal > 0}
			<div
				class="bar"
				style="{'height:' + barHeight + '%;'}">

					{#each Object.keys($reportsStoreBarchartData.days[databaseDate].tasks) as taskId}
						<div class="segment" style="{
							'height:' + $reportsStoreBarchartData.days[databaseDate].tasks[taskId] / (dayTotal / 100) +'%;' +
							'background:' + ($tasksStore.json[taskId] ? $tasksStore.json[taskId].color : '#333') + ';'
						} "></div>
					{/each}
				</div>
		{/if}
	</div>
{/if}

<div class="date">
	<span>
		{dateGetWeekday(date)}
	</span>
	<small>
		{dateGetDay(date)} {dateGetMonth(date)}
	</small>
</div>

<style>
	
	.date {
		position: absolute;
		bottom:0;
		left:50%;
		transform: translateX(-50%);
		text-align: center;
	}

	.date span {
		position: relative;
		display: inline-block;
		font-size:12px;
		line-height:12px;
		padding:6px 0;
	}

	.date small {
		display: block;
		padding:0 6px;
		font-size:12px;
		line-height:24px;
		white-space: nowrap;
		font-weight:600;
		opacity:0;
		border-radius: 6px;
	}

	.bar-wrapper {
		position: absolute;
		top:0;
		bottom:48px;
		left:0;
		width:100%;
		z-index:500;
	}

	.bar-wrapper:hover + .date small {
		opacity:1;
	}

	.bar {
		position: absolute;
		bottom:0;
		left:50%;
		width:90%;
		background:rgba(0, 0, 0, .1);
		transform:translateX(-50%);
	}

	.segment {
		width:100%;
	}
</style>