import { quadInOut } from 'svelte/easing'

export function mobileOverlayTransition(node, params) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '');

	return {
		delay: params.delay || 0,
		duration: params.duration || 100,
		easing: params.easing || quadInOut,
		css: (t, u) => `transform: ${existingTransform} translateY(${(1 - t) * 100}%)`
	}
}