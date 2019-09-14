<script>
	import { onMount } from 'svelte';
	import { routerStore } from './stores/router-store.js'
	import { authStore, authInit } from './stores/auth-store.js'
	import { timesStoreInit } from './stores/times-store.js'
	import { tasksStoreInit } from './stores/tasks-store.js'
	import { userStoreInit } from './stores/user-store.js'
	import { teamStore, teamStoreInit } from './stores/team-store.js'
	import { reportsStoreInit } from './stores/reports-store.js'
	import { uiStore, uiStoreInit, uiStoreSetBreakpoint } from './stores/ui-store.js'
	import { getWindowWidth } from './helpers/helpers.js'
	import { sws } from './helpers/sws-client.js'

	import UiFocus from './ui/ui-focus.svelte'

	import SignUp from './sign-in/sign-up-view.svelte'
	import SignIn from './sign-in/sign-in-view.svelte'
	import NewPasswordView from './sign-in/new-password-view.svelte'
	import AccountView from './sign-in/account-view.svelte'

	import MainNav from './ui/ui-main-nav.svelte'
	import TimelogView from './timelog/timelog-view.svelte'
	import ReportsView from './reports/reports-view.svelte'
	import SettingsView from './settings/settings-view.svelte'

	let resizing = false,
		debounceTimeout

const MODELS = {
	'teams': {
		col: 'teams',
		attributes: {
			title: '',
			members: {}
		},
		indexes: []
	}, 
	'settings': {
		col: 'settings',
		attributes: {
			language: 'EN',
			stopwatchEntryId: null,
			stopwatchStartTime: 0,
		},
		indexes: []
	}, 
	'times': {
		col: 'times',
		attributes: {
			duration: 0,
			day: 20000000,
			task: null,
			comment: '',
			user: null,
			team: null
		},
		indexes: [
			['day', 'team'],
			['task', 'team'],
			['user', 'team']
		]
	}, 
	'tasks': {
		col: 'tasks',
		attributes: {
			title: '',
			project: null,
			color: '#333',
			archived: false,
			user: null,
			team: null
		},
		indexes: [
			['team'],
			['project', 'team']
		]
	}
}

	onMount(() => {

		sws.init({
			server: 'ws://localhost:8080/',
			models: MODELS
		})

		uiStoreInit()
		uiStoreSetBreakpoint(getWindowWidth())

		setTimeout(() => {
			authInit()
			timesStoreInit()
			tasksStoreInit()
			userStoreInit()
			teamStoreInit()
			reportsStoreInit()
		}, 200)
	})

	function resize() {
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			//resizing = true;
			setTimeout(() => {
				resizing = false
			}, 10)

			uiStoreSetBreakpoint(getWindowWidth())
		}, 300)
	}

const COLORS = [
  '#B33C24', '#B37D47', '#B3A147', '#A1B347', '#7DB347',
  '#68B359', '#47B359', '#47B37D', '#47B3A1', '#47A1B3',
  '#477DB3', '#4759B3', '#5947B3', '#7D47B3', '#A147B3',
  '#B359A4', '#B3477D', '#B34759', '#4D4D4D'
]

</script>

{#if !resizing}

	{#if $routerStore.view === 'account'}
		<AccountView />
	{:else if $authStore.inited && !$authStore.hasAuth}
		{#if $routerStore.view === 'sign-up'}
			<SignUp />
		{:else if $routerStore.view === 'new-password'}
			<NewPasswordView />
		{:else}
			<SignIn />
		{/if}
	{:else}
		<MainNav />

		{#if $routerStore.view === 'timelog'}
			<TimelogView />
		{:else if $routerStore.view === 'reports'}
			<ReportsView />
		{:else if $routerStore.view === 'settings'}
			<SettingsView />
		{/if}
	{/if}

{/if}

<UiFocus />

<svelte:window on:resize={e => resize()} />