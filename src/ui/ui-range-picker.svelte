<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { routerStore } from '../stores/router-store.js'
	import { dateDaysBetweenDates, datePrevDate, dateNextDate, dateGetWeek, dateGetHumanDate, dateNextMonth, datePrevMonth, dateGetMonth } from '../helpers/helpers.js'

	import UiIcon from './ui-icon.svelte'
	import UiDateInput from './ui-date-input.svelte'
	import UiMonth from './ui-month.svelte'

	const dispatch = createEventDispatcher()

	export let firstDate
	export let lastDate
	export let hovered = false

	let el,
		pickStartDate = true,
		hover = false,
		opened = true,
		monthForPicker = new Date(),
		monthForSecondPicker = dateNextMonth(new Date()),
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}


	function isWeek(firstDate, lastDate) {
		return dateDaysBetweenDates(firstDate, lastDate) === 6 
			&& dateGetWeek(datePrevDate(firstDate)) != dateGetWeek(firstDate)
	}

	function isMonth(firstDate, lastDate) {
		return datePrevDate(firstDate).getMonth() != firstDate.getMonth()
			&& dateNextDate(lastDate).getMonth() != lastDate.getMonth()
			&& firstDate.getMonth() === lastDate.getMonth()
	}


	function getPeriodTitle(firstDateNow, lastDateNow) {

		if(isWeek(firstDateNow, lastDateNow)) {
			return 'Week ' + dateGetWeek(firstDateNow) + ', ' + firstDateNow.getFullYear()
		}

		if(isMonth(firstDateNow, lastDateNow)) {
			return dateGetMonth(firstDateNow) + ', ' + firstDateNow.getFullYear()
		}

		return dateGetHumanDate(firstDateNow) +' – '+ dateGetHumanDate(lastDateNow)
	}


	function prevPeriod(firstDateNow, lastDateNow) {

		if(isWeek(firstDateNow, lastDateNow)) {
			firstDate = datePrevDate(firstDateNow, 7)
			lastDate = dateNextDate(firstDate, 6)
		}

		if(isMonth(firstDateNow, lastDateNow)) {
			firstDate = datePrevMonth(firstDateNow)
			lastDate = datePrevDate(dateNextMonth(firstDate))
		}

		dispatch('input', { firstDate, lastDate })
	}


	function nextPeriod(firstDateNow, lastDateNow) {

		if(isWeek(firstDateNow, lastDateNow)) {
			firstDate = dateNextDate(firstDateNow, 7)
			lastDate = dateNextDate(firstDate, 6)
		}

		if(isMonth(firstDateNow, lastDateNow)) {
			firstDate = dateNextMonth(firstDateNow)
			lastDate = datePrevDate(dateNextMonth(firstDate))
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
	<div class="arrow-left" on:click={e => prevPeriod(firstDate, lastDate)}>
		<UiIcon type="arrow-left" color="#26231E" />	
	</div>
	<div class="arrow-right" on:click={e => nextPeriod(firstDate, lastDate)}>
		<UiIcon type="arrow-right" color="#26231E" />	
	</div>
	<span class="title" on:click={e => opened = true}>
		{getPeriodTitle(firstDate, lastDate)}
	</span>
	
	{#if opened}
		<div class="overlay">
			<div class="dates-header">
				<UiDateInput bind:value={firstDate} active={pickStartDate} />
					until
				<UiDateInput bind:value={lastDate}  active={!pickStartDate}/>
			</div>
			<div class="month-wrapper">
				<UiMonth
					mode="range"
					rightArrow={false}
					bind:monthForPicker={monthForPicker}
					bind:firstDate={firstDate}
					bind:lastDate={lastDate}
					on:input={e => inputFirstMonth(e)}
					on:change={e => changeDate(e.detail)}/>
			</div>
			<div class="month-wrapper">
				<UiMonth
					mode="range"
					leftArrow={false}
					bind:monthForPicker={monthForSecondPicker}
					bind:firstDate={firstDate}
					bind:lastDate={lastDate}
					on:input={e => inputSecondMonth(e)}
					on:change={e => changeDate(e.detail)}/>
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
		font-size:14px;
		font-weight:600;
		-webkit-font-smoothing:antialiased;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
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