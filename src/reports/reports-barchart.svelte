<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { routerStore } from '../stores/router-store.js'
	import { timesStore, timesStoreNewTime } from '../stores/times-store.js'
	import { dateToDatestring, dateStringToDate, dateGetHumanDate, datePrevDate, dateNextDate, dateGetHours, dateGetMinutes, dateDaysBetweenDates } from '../helpers/helpers.js'

	import UiButton from '../ui/ui-button.svelte'

	const startDateWritable = writable({
		startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1, 0, 0, 0)
	})

	let el,
	innerEl,
	intersectionObserver,
	daysArray = [],
	timeout,
	firstDate = (() => {
		let dateTmp = new Date($startDateWritable.startDate)
		dateTmp.setYear(dateTmp.getFullYear() - 5)
		return dateTmp
	})()

	$: daysBetween = dateDaysBetweenDates(firstDate, $startDateWritable.startDate)

	onMount(() => {
		
		startDateWritable.subscribe(data => {

			let tmp = Date.now()

			let dateTmp = new Date(data.startDate)
			dateTmp.setDate(dateTmp.getDate() - 31)

			let daysSince = dateDaysBetweenDates(firstDate, $startDateWritable.startDate),
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
			innerEl.style['width'] = (dateDaysBetweenDates(firstDate, $startDateWritable.startDate) + 62) * (960 / 31) +'px'
			el.scrollLeft = innerEl.getBoundingClientRect().width - 960
		})
		
	})

	function scroll(e) {
		if(timeout) {
			clearTimeout(timeout)
		}

		startDateWritable.update(data => {
			let dateTmp = new Date(firstDate)
			dateTmp.setDate(dateTmp.getDate() + Math.floor(el.scrollLeft / (960 / 31) - 31) )
			data.startDate = dateTmp
			return data
		})

	}

</script>

<div
	class="barchart"
	bind:this={el}
	on:wheel={e => scroll(e)}>
	<div
		class="inner"
		bind:this={innerEl}>
		{#each daysArray as day, i (day.daysSince)}
			<div class="day" style="{'left:'+ ((day.daysSince) * 960/31) +'px'}">
				{day.date.getDate()}<br />
				{day.date.getMonth() + 1}
			</div>
		{/each}
	</div>
</div>



<style>
	.barchart {
		background:#FFF;
		height:400px;
		width:100%;
		overflow-x:auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		backface-visibility: hidden;
	}

	.barchart::-webkit-scrollbar {
		/* display: none; */
	}

	.inner {
		position: relative;
		height: 100%;
		backface-visibility: hidden;
	}

	.day {
		position:absolute;
		top:0;
		border-right:1px #CCC solid;
		width:calc(960px / 31);
		height:100%;
		scroll-snap-align: start;
		text-align: center;
		font-size:14px;
	}
</style>