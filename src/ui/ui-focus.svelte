<script>
	import { onMount } from 'svelte'
	import { KEYS_CONFIG } from '../helpers/keyyboad-configurations.js'
	import { uiStore } from '../stores/ui-store.js'

	const FOCUS_ELS = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';

	let show = false,
		targetEl,
		lastTargets = [],
		elementConfig,
		x = 0,
		y = 0,
		width = 0,
		height = 0,
		wiggleClass = '',
		isLastInputAKey = false

	const blurFunction = e => {
		removeBlurFunction(e)

		setTimeout(() => {
			if(!document.body.contains(targetEl)) {

				let lastTarget,
					found = false
				while(!found && lastTargets.length > 0) {
					lastTarget = lastTargets.pop()
					found = document.body.contains(lastTarget)
				}
				if(document.body.contains(lastTarget)) {
					lastTarget.focus()
				} else {
					show = false
				}
			}
		})
	}

	const removeBlurFunction = e => {
		e.target.addEventListener('keydown', keydownFunction, false)
		e.target.addEventListener('blur', blurFunction, false)
	}

	onMount(() => {
		document.addEventListener('focusin', e => {
			show = true

			lastTargets.push(targetEl)
			if(lastTargets.length > 100) {
				lastTargets.shift()
			}

			targetEl = e.target
			elementConfig = targetEl.dataset.config ? KEYS_CONFIG[targetEl.dataset.config] : {}

			setTargetBoundingRect()
			setTimeout(setTargetBoundingRect)

			targetEl.addEventListener('blur', blurFunction, false)

			if(!targetEl.dataset.disable) {
				targetEl.addEventListener('keydown', keydownFunction, false)
			}
		})

		document.querySelector('body').addEventListener('trigger-focus-resize', () => {
			setTargetBoundingRect()
		}, false)


		document.querySelector('body').addEventListener('keydown', e => {
			if( ([9, 37, 39, 38, 40, 13, 27, 8]).includes(e.keyCode) ) {
				if(!targetEl || !document.body.contains(targetEl)) {
					findFocusable(e.target).focus()
				}
			}
			isLastInputAKey = true
		}, false)

		document.querySelector('body').addEventListener('set-last-input-as-key', e => isLastInputAKey = true)
		document.querySelector('body').addEventListener('mouseup', e => isLastInputAKey = false)
		document.querySelector('body').addEventListener('mousedown', e => isLastInputAKey = false)
	})


	function setTargetBoundingRect() {
		const boundingRect = targetEl.getBoundingClientRect()
		x = boundingRect.x - 3 + (elementConfig['box-x'] || 0)
		y = boundingRect.y - 3 + (elementConfig['box-y'] || 0)
		width = boundingRect.width + 6 + (elementConfig['box-width'] || 0)
		height = boundingRect.height + 6 + (elementConfig['box-height'] || 0)
	}


	const keydownFunction = e => {
		if(targetEl.dataset.disable) {
			return
		}

		if(e.keyCode === 9) { // TAB

		} else if (e.keyCode === 37) { // LEFT
			if(targetEl.dataset.left) {
				doAction(KEYS_CONFIG[targetEl.dataset.left], e, true)
			} else if(elementConfig.left) {
				doAction(elementConfig.left, e, false)
			} else {
				initWiggle(false)
			}
		} else if (e.keyCode === 39) { // RIGHT
			if(targetEl.dataset.right) {
				doAction(KEYS_CONFIG[targetEl.dataset.right], e, true)
			} else if(elementConfig.right) {
				doAction(elementConfig.right, e, false)
			} else {
				initWiggle(false)
			}
		} else if (e.keyCode === 38) { // TOP
			if(targetEl.dataset.top) {
				doAction(KEYS_CONFIG[targetEl.dataset.top], e, true)
			} else if(elementConfig.top) {
				doAction(elementConfig.top, e, true)
			} else {
				initWiggle(true)
			}
		} else if (e.keyCode === 40) { // BOTTOM
			if(elementConfig.bottom) {
				doAction(elementConfig.bottom, e, true)
			} else {
				initWiggle(true)
			}
		} else if (e.keyCode === 13) { // ENTER
			if(elementConfig.enter) {
				doAction(elementConfig.enter, e)
			} else {
				e.stopPropagation()
				e.preventDefault()
				e.target.dispatchEvent(new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window
				}))
			}
		} else if (e.keyCode === 27) { // ESC
			if(elementConfig.esc) {
				doAction(elementConfig.esc, e)
			}
		} else if(e.keyCode === 8) { // BACKSPACE
			if(elementConfig.backspace) {
				if(typeof elementConfig.backspace === 'function') {
					elementConfig.backspace(e)
				} else {
					doAction(elementConfig.backspace, e)
				}
			}
		}
	}


	const doAction = (toDo, e, vertically) => {
		e.preventDefault()
		e.stopPropagation()
		let el = e.target

		try {
			toDo.forEach(val => {
				if(val[0] === 'parent') {
					el = el.closest(val[1])
				} else if(val[0] === 'prev') {
					el = el.previousElementSibling
				} else if(val[0] === 'next') {
					el = el.nextElementSibling
				} else if(val[0] === 'query') {
					el = el.querySelector(val[1])
				} else if(val[0] === 'tab') {
					el = getNextFocusable(el)
				} else if(val[0] === 'find') {
					el = findFocusable(el)
				}
			})

			el.focus()

		} catch(err) {
			initWiggle(vertically)
		}
	}

	function initWiggle(vertically) {
		wiggleClass = 'wiggle-' + (vertically ? 'vertically' : 'horizontally')
		setTimeout(() => {
			wiggleClass = ''
		}, 200)
	}



	function getNextFocusable (el) {

		const focusableEls = document.querySelectorAll(FOCUS_ELS)

		var activeIndex
		focusableEls.forEach((val, key) => {
			if(el === val) {
				activeIndex = key
			}
		})

		return focusableEls[(activeIndex + 1)] || el
	}


	function findFocusable(el) {
		return el.querySelector(FOCUS_ELS)
	}

</script>

{#if show && isLastInputAKey && !$uiStore.isTouchDevice}
	<div
		class="{wiggleClass}"
		style="
			top:{y}px;
			left:{x}px;
			width:{width}px;
			height:{height}px;
			"></div>
{/if}

<style>

div {
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-radius: 10px;
	border: var(--c-blue) 3px solid;
	opacity: .5;
	z-index: 20000;
	animation: glow 1500ms infinite;
	transition: all 100ms ease;
	pointer-events: none;
}

.wiggle-horizontally {
	animation: wiggleHorizontally 200ms normal;
}

.wiggle-vertically {
	animation: wiggleVertically 200ms normal;
}

@keyframes glow {
	0% {
		opacity: .5;
	}
	50% {
		opacity:.8;
	}
	100% {
		opacity: .5;
	}
}

@keyframes wiggleHorizontally {
  20%  { 
	transform: translateX(4px);  
  }
  40%  {
	transform: translateX(-4px); 
  }
  60%  {
	transform: translateX(2px);  
  }
  80%  {
	transform: translateX(-1px); 
  }
  100% { 
	transform: translateX(0);
  }
}

@keyframes wiggleVertically {
  20%  { 
	transform: translateY(4px);  
  }
  40%  {
	transform: translateY(-4px); 
  }
  60%  {
	transform: translateY(2px);  
  }
  80%  {
	transform: translateY(-1px); 
  }
  100% { 
	transform: translateY(0);
  }
}

</style>