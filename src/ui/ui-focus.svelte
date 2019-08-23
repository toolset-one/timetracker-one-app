<script>
	import { onMount } from 'svelte';

	let elementConfig,
		x = 0,
		y = 0,
		width = 0,
		height = 0

	const blurFunction = e => {
		removeBlurFunction(e)
	}

	const removeBlurFunction = e => {
		event.target.addEventListener('keydown', keydownFunction, false)
		event.target.addEventListener('blur', blurFunction, false)
	}

	onMount(() => {
		document.addEventListener('focusin', (event) => {

			elementConfig = JSON.parse(event.target.dataset.focus)

			const boundingRect = event.target.getBoundingClientRect()
			x = boundingRect.x - 3 + elementConfig['box-x'] || 0
			y = boundingRect.y - 3 + elementConfig['box-y'] || 0
			width = boundingRect.width + 6 + elementConfig['box-width'] || 0
			height = boundingRect.height + 6 + elementConfig['box-height'] || 0

			event.target.addEventListener('blur', blurFunction, false)
			event.target.addEventListener('keydown', keydownFunction, false)
		})
	})


	const keydownFunction = e => {
		console.log(e.keyCode)

		if(e.keyCode === 9) { // TAB

		} else if (e.keyCode === 37) { // RIGHT
			if(elementConfig.left) {
				doAction(elementConfig.left, e)
			}
		} else if (e.keyCode === 39) { // RIGHT
			if(elementConfig.right) {
				doAction(elementConfig.right, e)
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
					el = el.nextElementSibling
				} else if(val.act === 'query') {
					el = el.querySelector(val.sel)
				}
			})

			el.focus()

		} catch(err) {}
	}

</script>


<div
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

</style>