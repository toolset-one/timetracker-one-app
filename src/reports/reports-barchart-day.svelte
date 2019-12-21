<script>
	import { onMount } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { i18n } from '../stores/i18n-store.js'
	import { routerStore } from '../stores/router-store.js'
	import { reportsStore, reportsStoreBarchartData } from '../stores/reports-store.js'
	import { tasksStore } from '../stores/tasks-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth, dateToDatabaseDate} from '../helpers/helpers.js'

	export let date = new Date()
	export let active = false

	$: databaseDate = dateToDatabaseDate(date)
	$: dayTotal = $reportsStoreBarchartData.days[databaseDate] ? $reportsStoreBarchartData.days[databaseDate].total : 0
	$: barHeight = dayTotal / ($reportsStoreBarchartData.totalDayMax / 100)
	$: hasShortWeekAbbrivations = Object.keys($reportsStore.dates).length > 14
	$: hasNoWeekdays = Object.keys($reportsStore.dates).length > 31


	onMount(() => {

	})

</script>

{#if $reportsStoreBarchartData.days[databaseDate]}
	<div
		class="bar-wrapper">
		
			<div
				class="bar"
				style="{'height:' + barHeight + '%;'}">

				{#each Object.keys($reportsStoreBarchartData.days[databaseDate].tasks) as taskId}
					<div 
						class="segment {$reportsStore.active === taskId || !$reportsStore.active ? '' : 'inactive'}"
						style="{
						'height:' + $reportsStoreBarchartData.days[databaseDate].tasks[taskId] / (dayTotal / 100) +'%;' +
						'background:' + ($tasksStore.json[taskId] ? $tasksStore.json[taskId].color : '#333') + ';'
					} "></div>
				{/each}

				{#if active}
					<div
						class="tooltip">		
						<span class="tooltip-date">
							{dateGetHumanDate($i18n.MONTHS, $i18n.WEEKDAYS_SHORT, date)}
						</span>
						{dateGetHours(dayTotal)}:{dateGetMinutes(dayTotal)}
					</div>
				{/if}


			</div>
		
	</div>
{/if}

{#if !hasNoWeekdays}
	<div class="date">
		<span>
			{dateGetWeekday($i18n.WEEKDAYS_SHORT, date).substr(0, (hasShortWeekAbbrivations ? 1 : 3))}
		</span>
	</div>
{/if}

<style>
	
	.date {
		position: absolute;
		bottom:0;
		left:50%;
		transform: translateX(-50%);
		text-align: center;
		z-index:600;
	}

	.date span {
		position: relative;
		display: inline-block;
		font-size:9px;
		line-height:12px;
		padding:6px 0;
	}

	.bar-wrapper {
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		width:100%;
		z-index:500;
	}

	.bar {
		position: absolute;
		bottom:0;
		left:50%;
		width:90%;
		transform:translateX(-50%);
		display:flex;
		flex-direction: column-reverse;
		max-width:48px;
	}

	.segment {
		width:100%;
		transition: opacity 100ms ease;
	}

	.segment.inactive {
		opacity:.25;
	}

	.tooltip {
		position: absolute;
		bottom:100%;
		left:50%;
		max-width:240px;
		padding:12px 18px;
		border-radius: 6px;
		transform:translateX(-50%);
		color:#FFF;
		line-height:18px;
		font-size: 14px;
		text-align:center;
		margin:-6px 0 6px 0;
		box-shadow:var(--shadow-overlay);
		background:var(--c-darkgrey);
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

	.tooltip-date {
		display:block;
		white-space: nowrap;
	}
</style>