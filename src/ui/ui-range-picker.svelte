<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { get } from 'svelte/store'
	import { fade } from 'svelte/transition'
	import { routerStore } from '../stores/router-store.js'
	import { uiStore } from '../stores/ui-store.js'

	import { dateDaysBetweenDates, datePrevDate, dateNextDate, dateGetWeek, dateGetHumanDate, dateNextMonth, datePrevMonth, dateGetMonth, dateIsWeek, dateIsMonth, dateGetWeekStart, dateGetMonthStart } from '../helpers/helpers.js'

	import UiIcon from './ui-icon.svelte'
	import UiDateInput from './ui-date-input.svelte'
	import UiMonth from './ui-month.svelte'
	import UiMobileRangeOverlay from './ui-mobile-range-overlay.svelte'

	const dispatch = createEventDispatcher()

	export let firstDate
	export let lastDate
	export let hovered = false

	let el,
		pickStartDate = true,
		hover = false,
		opened = false,
		monthForPicker = new Date(firstDate),
		monthForSecondPicker = dateNextMonth(new Date(firstDate)),
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}


	function open() {

		monthForPicker = new Date(firstDate)
		monthForSecondPicker = dateNextMonth(new Date(firstDate))

		opened = true
		setTimeout(() => {
			const { isTouchDevice } = get(uiStore)
			if(!isTouchDevice) {
				el.querySelector('.icon-wrapper').focus()
			}
		})
	}


	function getPeriodTitle(firstDateNow, lastDateNow) {

		if(dateIsWeek(firstDateNow, lastDateNow)) {
			return 'Week ' + dateGetWeek(firstDateNow) + ', ' + firstDateNow.getFullYear()
		}

		if(dateIsMonth(firstDateNow, lastDateNow)) {
			return dateGetMonth(firstDateNow) + ', ' + firstDateNow.getFullYear()
		}

		return dateGetHumanDate(firstDateNow, true) +' – '+ dateGetHumanDate(lastDateNow, true)
	}


	function prevPeriod(firstDateNow, lastDateNow) {

		if(dateIsWeek(firstDateNow, lastDateNow)) {
			firstDate = datePrevDate(firstDateNow, 7)
			lastDate = dateNextDate(firstDate, 6)
		} else if(dateIsMonth(firstDateNow, lastDateNow)) {
			firstDate = datePrevMonth(firstDateNow)
			lastDate = datePrevDate(dateNextMonth(firstDate))
		} else {
			if(dateDaysBetweenDates(firstDateNow, lastDateNow) <= 7) {
				firstDate = dateGetWeekStart(firstDateNow)
				lastDate = dateNextDate(firstDate, 6)
			} else {
				firstDate = dateGetMonthStart(firstDateNow)
				lastDate = datePrevDate(dateNextMonth(firstDate))
			}
		}

		dispatch('input', { firstDate, lastDate })
	}


	function nextPeriod(firstDateNow, lastDateNow) {

		if(dateIsWeek(firstDateNow, lastDateNow)) {
			firstDate = dateNextDate(firstDateNow, 7)
			lastDate = dateNextDate(firstDate, 6)
		} else if(dateIsMonth(firstDateNow, lastDateNow)) {
			firstDate = dateNextMonth(firstDateNow)
			lastDate = datePrevDate(dateNextMonth(firstDate))
		} else {
			if(dateDaysBetweenDates(firstDateNow, lastDateNow) <= 7) {
				firstDate = dateNextDate(dateGetWeekStart(firstDateNow), 7)
				lastDate = dateNextDate(firstDate, 6)
			} else {
				firstDate = dateNextMonth(dateGetMonthStart(firstDateNow))
				lastDate = datePrevDate(dateNextMonth(firstDate))
			}
		}

		dispatch('input', { firstDate, lastDate })
	}



	function inputFirstMonth(e) {
		if(e.detail === 'monthForPicker') {
			monthForSecondPicker = dateNextMonth(monthForPicker)
		}
	}

	function inputSecondMonth(e) {
		if(e.detail === 'monthForPicker') {
			monthForPicker = datePrevMonth(monthForSecondPicker)
		}
	}

	function changeDate(date) {
		if(pickStartDate) {
			firstDate = date
			if(lastDate < firstDate) {
				lastDate = firstDate
			}
		} else {
			lastDate = date
			if(firstDate > lastDate) {
				firstDate = lastDate
			}
		}

		pickStartDate = !pickStartDate

		dispatch('input', { firstDate, lastDate })
	}

</script>

<div
	class="wrapper {hovered ? 'hovered': ''}"
	style="{
		'--x:'+ (mousePosition.x - boundingRect.left) +'px;' +
		'--y:'+ (mousePosition.y - boundingRect.top) +'px;'
	}"
	bind:this={el}
	on:mouseenter={e => hover = true}
	on:mouseleave={e => hover = false}
	on:mousemove={e => mousePosition = {
		x: e.pageX,
		y: e.pageY
	}}>
	<em></em>
	<div
		class="arrow-left"
		on:click={e => prevPeriod(firstDate, lastDate)}
		tabindex="0"
		data-config="REPORTS_RANGE_ARROW_LEFT">
		<UiIcon type="arrow-left" color="#26231E" />	
	</div>
	<div
		class="arrow-right"
		on:click={e => nextPeriod(firstDate, lastDate)}
		tabindex="0"
		data-config="REPORTS_RANGE_ARROW_RIGHT">
		<UiIcon type="arrow-right" color="#26231E" />	
	</div>
	<span
		class="title"
		on:click={e => open()}
		tabindex="0"
		data-config="REPORTS_RANGE_TITLE">
		{getPeriodTitle(firstDate, lastDate)}
	</span>
	
	{#if opened && !$uiStore.isTouchDevice}
		<div class="overlay">
			<div class="dates-header">
				<UiDateInput
					bind:value={firstDate} 
					active={pickStartDate} 
					on:click={e => pickStartDate = true}/>
					until
				<UiDateInput
					bind:value={lastDate} 
					active={!pickStartDate} 
					on:click={e => pickStartDate = false}/>
			</div>
			<div class="month-wrapper">
				<UiMonth
					mode="range"
					rightArrow={false}
					bind:monthForPicker={monthForPicker}
					bind:firstDate={firstDate}
					bind:lastDate={lastDate}
					on:input={e => inputFirstMonth(e)}
					on:change={e => changeDate(e.detail)}
					on:close={e => opened = false} />
			</div>
			<div class="month-wrapper">
				<UiMonth
					mode="range"
					leftArrow={false}
					bind:monthForPicker={monthForSecondPicker}
					bind:firstDate={firstDate}
					bind:lastDate={lastDate}
					on:input={e => inputSecondMonth(e)}
					on:change={e => changeDate(e.detail)}
					on:close={e => opened = false} />
			</div>
		</div>
	{/if}
</div>


{#if opened}
	<div
		class="backdrop"
		transition:fade="{{delay: 0, duration: 100}}"
		on:click={e => opened = false}></div>
{/if}


{#if opened && $uiStore.isTouchDevice}
	<UiMobileRangeOverlay />
{/if}

<style>
	.wrapper {
		display:flex;
		flex-flow: row;
		position: relative;
		padding:1px;
		border:0;
		border-radius: 6px;
		background:#CCC9C4;
		cursor: pointer;
		box-shadow: 0 6px 0 -3px rgba(0, 0, 0, .05);
		transition: all 100ms ease;
		outline:none;
		max-width:100%;
	
		user-select: none;
	}

	.wrapper:before {
		content:'';
		display:block;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, 0);
		position: absolute;
		top:2px;
		left:0;
		transition: all 100ms ease;
	}

	.dates-header {
		text-align: center;
		min-width:100%;
		max-width: 100%;
		padding:12px 6px;
	}

	.arrow-left, .arrow-right {
		position: relative;
		margin-right:1px;
		width:40px;
		padding:14px;
		background:#FFF;
		border-radius: 0;
		outline:none;
	}

	.arrow-left {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;		
	}

	.title {
		display: block;
		position: relative;
		border-radius: 5px;
		line-height:40px;
		background:#FFF;
		padding:0 18px;
		max-width:calc(100% - 42px - 40px);
		font-size:14px;
		font-weight:600;
		-webkit-font-smoothing:antialiased;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		outline:none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	em {
		display:block;
		width:100%;
		height:100%;
		position: absolute;
		top:0;
		left:0;
		background:transparent;
		border-radius: 6px;
		overflow:hidden;
	}

	em:after {
		content: '';
		display:block;
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: 120px;
		height: 120px;
		background: radial-gradient(circle closest-side, #FAD000, transparent);
		transform: translate(-50%, -50%) scale(0);
		transition: transform 500ms ease;
		pointer-events: none;
	}

	a:hover em:after {
		transform: translate(-50%, -50%) scale(1);
	}


	.overlay {
		position: absolute;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		top:0;
		left:0;
		z-index:1010;
		background:#FFF;
		border-radius: 6px;
		box-shadow:0 4px 0 -2px rgba(0, 0, 0, .05),  0 3px 6px rgba(0, 0, 0, .1);
		overflow:hidden;
		width:612px;
	}

	.month-wrapper {
		position: relative;
		min-width:50%;
		max-width:50%;
		padding:6px;
	}

	.month-wrapper + .month-wrapper:after {
		content:"";
		position: absolute;
		top:6px;
		bottom:6px;
		left:0;
		width:1px;
		background:#CCC;
	}

	.backdrop {
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0, 0, 0, .15);
		z-index:1000;
	}

</style>