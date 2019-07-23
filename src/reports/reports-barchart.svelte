<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { routerStore } from '../stores/router-store.js'
	import { reportsStore } from '../stores/reports-store.js'

	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates, dateGetWeekday, dateGetDay, dateGetMonth} from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'

	let el,
	innerEl,
	intersectionObserver,
	daysArray = [],
	timeout

	$: daysBetween = dateDaysBetweenDates($reportsStore.firstDate, $reportsStore.startDate)

	onMount(() => {
		
		reportsStore.subscribe(data => {

			let tmp = Date.now()

			let dateTmp = new Date(data.startDate)
			dateTmp.setDate(dateTmp.getDate() - 31)

			let daysSince = dateDaysBetweenDates($reportsStore.firstDate, $reportsStore.startDate),
				arrayTmp = []

			for(var i = -31; i <= 31; i++) {
				arrayTmp.push({
					date: dateTmp,
					daysSince
				})

				dateTmp = dateNextDate(dateTmp)
				daysSince++
			}
			daysArray = arrayTmp
		})

		setTimeout(() => {
			innerEl.style['width'] = (dateDaysBetweenDates($reportsStore.firstDate, $reportsStore.startDate) + 62) * (960 / 31) +'px'
			el.scrollLeft = innerEl.getBoundingClientRect().width - 960
		})
		
	})

	function scroll(e) {
		if(timeout) {
			clearTimeout(timeout)
		}

		reportsStore.update(data => {
			let dateTmp = new Date($reportsStore.firstDate)
			dateTmp.setDate(dateTmp.getDate() + Math.floor(el.scrollLeft / (960 / 31) - 31) )
			data.startDate = dateTmp
			return data
		})

	}

</script>

<div class="barchart-wrapper">

<div class="legend"></div>

<div
	class="barchart"
	bind:this={el}
	on:wheel={e => scroll(e)}>
	<div
		class="inner"
		bind:this={innerEl}>
		{#each daysArray as day, i (day.daysSince)}
			<div class="day-container" style="{'left:'+ ((day.daysSince) * 960/31) +'px'}">

				<div class="date">
					<span>
						{dateGetWeekday(day.date)}
					</span>
					<small>
						{dateGetDay(day.date)} {dateGetMonth(day.date)}
					</small>
				</div>
			</div>
		{/each}
	</div>
</div>

</div>



<style>
	.barchart-wrapper {
		position: relative;
		width:100%;
		background:#FFF;
	}

	.barchart {
		position: relative;
		height:400px;
		width:100%;
		overflow-x:auto;
		overflow-y:show;
		scroll-snap-type: x mandatory;
		backface-visibility: hidden;
	}

	.barchart::-webkit-scrollbar {
		display: none;
	}

	.inner {
		position: relative;
		height: 100%;
		backface-visibility: hidden;
	}

	.day-container {
		position:absolute;
		top:0;
		/* border-right:1px #CCC solid; */
		width:calc(960px / 31);
		height:100%;
		scroll-snap-align: start;
		text-align: center;
		font-size:14px;
	}

	/* .day-container:nth-child(odd) .date {
		display:none;
	}*/

	.day-container:hover {
		background:#F5F3F0;
	}

	.day-container:hover .date small {
		opacity: 1;
	}

	.date {
		position: absolute;
		bottom:0;
		left:50%;
		transform: translateX(-50%);
		text-align: center;
	}

	.date span {
		display: block;
		font-size:12px;
		line-height:12px;
		padding:6px 0;
	}

	.date small {
		background:#F5F3F0;
		display: block;
		padding:0 6px;
		font-size:12px;
		line-height:24px;
		white-space: nowrap;
		font-weight:600;
		opacity:0;
		border-radius: 6px;
	}

	.legend {
		position: absolute;
		bottom:0;
		left:0;
		width:100%;
		height:48px;
		background:#FAF9F7;
	}
</style>