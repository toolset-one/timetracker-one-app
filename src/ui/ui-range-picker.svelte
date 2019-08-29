<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { routerStore } from '../stores/router-store.js'
	import { dateDaysBetweenDates, datePrevDate, dateNextDate, dateGetWeek, dateGetHumanDate } from '../helpers/helpers.js'

	import UiIcon from './ui-icon.svelte'

	const dispatch = createEventDispatcher()

	export let firstDate
	export let lastDate
	export let hovered = false

	let el,
		hover = false,
		mousePosition = {
			x: 0,
			y: 0
		}

	$: boundingRect = el ? el.getBoundingClientRect() : {
		top: 0,
		left: 0
	}


	function getPeriodTitle(firstDateNow, lastDateNow) {

		if( dateDaysBetweenDates(firstDateNow, lastDateNow) === 7 ) {
			if( dateGetWeek(datePrevDate(firstDateNow)) != dateGetWeek(firstDateNow)) {
				return 'Week Number ' + dateGetWeek(firstDateNow)
			} else {
				return dateGetHumanDate(firstDateNow) +' – '+ dateGetHumanDate(firstDateNow)
			}
		} /* else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				return dateGetMonth(date) + ' ' + date.getFullYear()
			} else {
				return dateGetHumanDate(date) +' – '+ dateGetHumanDate(dateNextDate(date, 30))
			}
		}
*/
		return dateGetHumanDate(firstDateNow) +' – '+ dateGetHumanDate(lastDateNow)
	}


	function prevPeriod(firstDateNow, lastDateNow) {

		var firstDateTmp = new Date(firstDateNow)
		var lastDateTmp = new Date(lastDateNow)

		if( dateDaysBetweenDates(firstDate, lastDate) === 7 ) {
			if( dateGetWeek(datePrevDate(firstDateTmp)) != dateGetWeek(firstDateTmp)) {
				firstDate = datePrevDate(firstDateTmp, 7)
				lastDate = dateNextDate(firstDate, 7)
			} else {
				while(dateGetWeek(datePrevDate(firstDateTmp)) === dateGetWeek(firstDateTmp)) {
					firstDateTmp = datePrevDate(firstDateTmp)
				}
				firstDate = firstDateTmp
				lastDate = dateNextDate(firstDate, 7)

			}
		} /*else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				date = datePrevDate(date)
			} 

			while(datePrevDate(date).getMonth() === date.getMonth()) {
				date = datePrevDate(date)
			}
			var newDate = date
		}*/
	}


	function nextPeriod(firstDateNow, lastDateNow) {

		var firstDateTmp = new Date(firstDateNow)
		var lastDateTmp = new Date(lastDateNow)

		if( dateDaysBetweenDates(firstDate, lastDate) === 7 ) {
			if( dateGetWeek(datePrevDate(firstDateTmp)) != dateGetWeek(firstDateTmp)) {
				firstDate = dateNextDate(firstDateTmp, 7)
				lastDate = dateNextDate(lastDateTmp, 7)
			} else {
				while(dateGetWeek(datePrevDate(firstDateTmp)) === dateGetWeek(firstDateTmp)) {
					firstDateTmp = dateNextDate(firstDateTmp)
					lastDateTmp = dateNextDate(lastDateTmp)
				}
				firstDate = firstDateTmp
				lastDate = lastDateTmp

			}
		} /*else if(period === 'month') {
			if( (datePrevDate(date)).getMonth() != date.getMonth()) {
				date = datePrevDate(date)
			} 

			while(datePrevDate(date).getMonth() === date.getMonth()) {
				date = datePrevDate(date)
			}
			var newDate = date
		}*/
	}

</script>

<div
	class="{hovered ? 'hovered': ''}"
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
	<span class="title">
		{getPeriodTitle(firstDate, lastDate)}
	</span>
	
</div>

<style>
	div {
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

	div:before {
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

	.arrow-left, .arrow-right {
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

	.disabled span {
		color:#CCC9C4;
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

</style>