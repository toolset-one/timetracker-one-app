<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { i18n } from '../stores/i18n-store.js'
	import { dateDaysBetweenDates, datePrevDate, dateNextDate, datePrevMonth, dateNextMonth, dateGetWeek } from '../helpers/helpers.js'

	import UiIcon from './ui-icon.svelte'

	const dispatch = createEventDispatcher()

	export let mode = 'picker'
	export let firstDate
	export let lastDate
	export let monthForPicker
	export let leftArrow = true
	export let rightArrow = true

	$: firstDayDate = getFirstDayDate(monthForPicker)
	$: firstWeekdayDate = getFirstWeekdayDate(firstDayDate)
	$: dates = getDates(firstDayDate, firstWeekdayDate)


	function getFirstDayDate(date) {
		while(datePrevDate(date).getMonth() === date.getMonth()) {
			date = datePrevDate(date)
		}
		return date
	}

	function getFirstWeekdayDate(date) {
		while(dateGetWeek(datePrevDate(date)) === dateGetWeek(date)) {
			date = datePrevDate(date)
		}
		return date
	}

	function getDates(firstDayDate, firstWeekdayDate) {
		let dates = [],
			dateTmp = new Date(firstWeekdayDate),
			count = 0
		while( count < 7 || firstDayDate.getMonth() === dateTmp.getMonth() || dateGetWeek(datePrevDate(dateTmp)) === dateGetWeek(dateTmp) ) {
			dates.push({
				date: dateTmp,
				inMonth: firstDayDate.getMonth() === dateTmp.getMonth()
			})



			dateTmp = dateNextDate(dateTmp)
			count++
		}
		return dates
	}


	function prevMonth() {
		monthForPicker = datePrevMonth(monthForPicker)
		dispatch('input', 'monthForPicker')
	}


	function nextMonth() {
		monthForPicker = dateNextMonth(monthForPicker)
		dispatch('input', 'monthForPicker')
	}


	function getClass(date, firstDate, lastDate, mode) {
		let className = ''
		if(mode === 'range') {
			if(date.getYear() === firstDate.getYear() && date.getMonth() === firstDate.getMonth() && date.getDate() === firstDate.getDate()) {
				className += 'range-first '
			} 

			if(date.getYear() === lastDate.getYear() && date.getMonth() === lastDate.getMonth() && date.getDate() === lastDate.getDate()) {
				className += 'range-last '
			} 

			if(date > firstDate && date < lastDate) {
				className += 'range-between'
			}
		}

		return className
	}


	function prevArrowKeydown(e) {
		e.preventDefault()

		if(e.keyCode === 13) {
			prevMonth()
		} else if(e.keyCode === 9) {
			e.preventDefault()
		} else if(e.keyCode === 39) {
			e.target.closest('.overlay').querySelector('.icon-right').focus()
		} else if(e.keyCode === 40) {
			e.target.closest('.month-wrapper').querySelector('.dates .date').focus()
		} else if(e.keyCode === 27) {
			e.stopPropagation()
			dispatch('close')
		}
	}


	function nextArrowKeydown(e) {
		e.preventDefault()

		if(e.keyCode === 13) {
			nextMonth()
		} else if(e.keyCode === 9) {
			e.preventDefault()
		} else if(e.keyCode === 37) {
			e.target.closest('.overlay').querySelector('.icon-left').focus()
		} else if(e.keyCode === 40) {
			e.target.closest('.month-wrapper').querySelector('.dates .date').focus()
		} else if(e.keyCode === 27) {
			e.stopPropagation()
			dispatch('close')
		}
	}


	function dateKeydown(e, date, i) {
		e.preventDefault()

		if(e.keyCode === 13) {
			dispatch('change', date.date)
		} else if(e.keyCode === 38) { // UP
			let tmpEl = e.target,
				count = 0
			while(tmpEl && count < 7) {
				tmpEl = tmpEl.previousElementSibling
				count++
			}
			if(tmpEl) {
				tmpEl.focus()
			} else {
				e.target.closest('.month-wrapper').querySelector('.icon-wrapper').focus()
			}
		} else if(e.keyCode === 40) { // DOWN
			let tmpEl = e.target,
				count = 0
			while(tmpEl && count < 7) {
				tmpEl = tmpEl.nextElementSibling
				count++
			}
			if(tmpEl) {
				tmpEl.focus()
			}
		} else if(e.keyCode === 37) { // LEFT
			if(i % 7 === 0) {
				const prevMonthEl = e.target.closest('.month-wrapper').previousElementSibling

				if(prevMonthEl) {
					const dateEl = prevMonthEl.querySelector('.date:nth-child('+ (Math.ceil(i / 7) * 7 + 7) +')')
					if(dateEl) {
						dateEl.focus()
					}
				}
			} else {
				if(e.target.previousElementSibling) {
					e.target.previousElementSibling.focus()
				}
			}
		} else if(e.keyCode === 39) { // RIGHT
			if((i + 1) % 7 === 0) {
				const nextMonthEl = e.target.closest('.month-wrapper').nextElementSibling

				if(nextMonthEl) {
					const dateEl = nextMonthEl.querySelector('.date:nth-child('+ (Math.floor(i / 7) * 7 + 1) +')')
					if(dateEl) {
						dateEl.focus()
					}
				}
			} else {
				if(e.target.nextElementSibling) {
					e.target.nextElementSibling.focus()
				}
			}
		} else if(e.keyCode === 27) {
			e.stopPropagation()
			dispatch('close')
		}
	}
	

</script>

<div class="wrapper">
	<header>
		{#if leftArrow}
			<div
				class="icon-wrapper icon-left"
				on:click={e => prevMonth()}
				on:keydown={e => prevArrowKeydown(e)}
				tabindex="0"
				data-disable="true">
				<UiIcon type="arrow-left" />
			</div>
		{/if}
		<div class="title-wrapper">
			{$i18n.MONTHS[monthForPicker.getMonth()]}, {monthForPicker.getFullYear()}
		</div>
		{#if rightArrow}
			<div
				class="icon-wrapper icon-right"
				on:keydown={e => nextArrowKeydown(e)}
				on:click={e => nextMonth()}
				tabindex="0"
				data-disable="true">
				<UiIcon type="arrow-right" />
			</div>
		{/if}
	</header>
	<div class="dates">
		{#each dates as date, i}
			<div
				class="date {date.inMonth ? 'in-month' : ''} {getClass(date.date, firstDate, lastDate, mode)}"
				on:keydown={e => dateKeydown(e, date, i)}
				on:click={e => dispatch('change', date.date)}
				tabindex="0"
				data-disable="true">
				{date.date.getDate()}
			</div>
		{/each}
	</div>
</div>
<style>

	header {
		display: flex;
		flex:row;
		padding:0 0 6px 0;
	}

	.icon-wrapper {
		padding:15px;
		cursor:pointer;
		border-radius: 6px;
	}

	.icon-wrapper:hover {
		background:#F5F5F5;
	}

	.title-wrapper {
		line-height: 42px;
		font-size:14px;
		font-weight:600;
		text-align: center;
		flex:1;
	}

	.wrapper {
		min-width:294px;
		max-width:294px;
	}

	.dates {
		display: flex;
		flex:row;
		flex-wrap: wrap;
	}

	.date {
		min-width:42px;
		max-width:42px;
		height:42px;
		line-height: 42px;
		text-align: center;
		font-size:14px;
		color:#CCC;
		cursor:pointer;
		border-radius: 6px;
	}

	.date:hover {
		background:#F5F5F5;
	}

	.date.in-month {
		color:#333;
	}

	.date.range-first {
		background:#68B359;
		border-top-right-radius:0;
		border-bottom-right-radius:0;
		color:#FFF;
		border-top:#FFF 3px solid;
		border-bottom:#FFF 3px solid;
		border-left:#FFF 3px solid;
		line-height: 36px;
		padding-right:3px;
	}

	.date.range-last {
		background:#68B359;
		border-top-left-radius:0;
		border-bottom-left-radius:0;
		color:#FFF;
		border-top:#FFF 3px solid;
		border-bottom:#FFF 3px solid;
		border-right:#FFF 3px solid;
		line-height: 36px;
		padding-left:3px;
	}

	.date.range-first.range-last {
		border-radius: 6px;
	}

	.date.range-between {
		background:#68B359;
		border-radius: 0;
		color:#FFF;
		border-top:#FFF 3px solid;
		border-bottom:#FFF 3px solid;
		line-height: 36px;
	}

</style>