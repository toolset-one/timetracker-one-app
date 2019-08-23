<script>
	import { onMount } from 'svelte';

	const FOCUS_ELS = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';

	let elementConfig,
		x = 0,
		y = 0,
		width = 0,
		height = 0,
		wiggle = false

	const blurFunction = e => {
		removeBlurFunction(e)
	}

	const removeBlurFunction = e => {
		event.target.addEventListener('keydown', keydownFunction, false)
		event.target.addEventListener('blur', blurFunction, false)
	}

	onMount(() => {
		document.addEventListener('focusin', (event) => {

			elementConfig = event.target.dataset.focus ? JSON.parse(event.target.dataset.focus) : {}

			const boundingRect = event.target.getBoundingClientRect()
			x = boundingRect.x - 3 + (elementConfig['box-x'] || 0)
			y = boundingRect.y - 3 + (elementConfig['box-y'] || 0)
			width = boundingRect.width + 6 + (elementConfig['box-width'] || 0)
			height = boundingRect.height + 6 + (elementConfig['box-height'] || 0)

			event.target.addEventListener('blur', blurFunction, false)
			event.target.addEventListener('keydown', keydownFunction, false)
		})
	})


	const keydownFunction = e => {
		// console.log(e.keyCode)

		if(e.keyCode === 9) { // TAB

		} else if (e.keyCode === 37) { // RIGHT
			if(elementConfig.left) {
				doAction(elementConfig.left, e)
			} else {
				initWiggle()
			}
		} else if (e.keyCode === 39) { // RIGHT
			if(elementConfig.right) {
				doAction(elementConfig.right, e)
			} else {
				initWiggle()
			}
		} else if (e.keyCode === 38) { // TOP
			if(elementConfig.top) {
				doAction(elementConfig.top, e)
			} else {
				initWiggle()
			}
		} else if (e.keyCode === 40) { // BOTTOM
			if(elementConfig.bottom) {
				doAction(elementConfig.bottom, e)
			} else {
				initWiggle()
			}
		}
	}


	const doAction = (toDo, e) => {
		e.preventDefault()
		let el = e.target

		try {
			toDo.forEach(val => {
				if(val.act === 'parent') {
					el = el.closest(val.sel)
				} else if(val.act === 'prev') {
					el = el.previousElementSibling
				} else if(val.act === 'next') {
					console.log(el)
					el = el.nextElementSibling
				} else if(val.act === 'query') {
					el = el.querySelector(val.sel)
				} else if(val.act === 'tab') {
					el = getNextFocusable(el)
				} else if(val.act === 'find') {
					console.log(el)
					el = findFocusable(el)
				}
			})

			el.focus()

		} catch(err) {
			initWiggle()
		}
	}

	function initWiggle() {
		wiggle = true
		setTimeout(() => {
			wiggle = false
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


<div
	class="{wiggle ? 'wiggle' : ''}"
	style="
		top:{y}px;
		left:{x}px;
		width:{width}px;
		height:{height}px;
		"></div>
	

<style>

div {
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-radius: 8px;
	border: #477DB3 3px solid;
	opacity: .5;
	z-index: 20000;
	animation: glow 1500ms infinite;
	transition: all 100ms ease;
	pointer-events: none;
}

.wiggle {
	animation: wiggle 200ms normal;
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

@keyframes wiggle {
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

</style>