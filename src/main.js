import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
})

/*
if (!navigator.serviceWorker.controller) {
	navigator.serviceWorker.register('/service-worker.js', {
		scope: '/'
	}).then(reg => {
		console.log(reg.scope, 'register')
	})
}
*/

export default app