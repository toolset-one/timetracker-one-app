<script>
	import Page from 'page'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { i18n } from '../stores/i18n-store.js'
	import { authSignOut } from '../stores/auth-store.js'
	import { uiStore } from '../stores/ui-store.js'
	import { userStore, userStoreSetLanguage } from '../stores/user-store.js'
	import { teamStoreGetUsername, teamStoreSetUsername } from '../stores/team-store.js'

	import UiButton from '../ui/ui-button.svelte'
	import UiInput from '../ui/ui-input.svelte'
	import UiRadio from '../ui/ui-radio.svelte'

	const LANGUAGE_OPTIONS = [{
		title: 'English',
		value: 'en'
	}, {
		title: 'Deutsch',
		value: 'de'
	}],

	DATE_FORMAT_OPTIONS = [{
		title: 'DD.MM.YYYY',
		value: 'DD.MM.YYYY'
	}, {
		title: 'MM/DD/YYYY',
		value: 'MM/DD/YYYY'
	}, {
		title: 'DD/MM/YYYY',
		value: 'DD/MM/YYYY'
	}, {
		title: 'YYYY/MM/DD',
		value: 'YYYY/MM/DD'
	}, {
		title: 'YYYY-MM-DD',
		value: 'YYYY-MM-DD'
	}],

	FIRST_WEEKDAY_OPTIONS = [{
		title: 'SATURDAY',
		value: 'SAT'
	}, {
		title: 'SUNDAY',
		value: 'SUN'
	}, {
		title: 'MONDAY',
		value: 'MON'
	}]


	let username = '',
		usernameFocused = false,
		usernameInfo = '',
		usernameDebounce,
		languageNow = 'en',
		dateFormatNow = 'DD.MM.YYYY',
		firstWeekdayNow = 'MON'


	$: FIRST_WEEKDAY_OPTIONS_I18N = JSON.parse(JSON.stringify(FIRST_WEEKDAY_OPTIONS)).map(option => {
		option.title = $i18n[option.title]
		return option
	})


	onMount(() => {
		userStore.subscribe(data => {
			languageNow = data.language
		})

		username = teamStoreGetUsername()
	})

	function usernameFocus(e) {
		const { USERNAME_UP_TO_DATE } = get(i18n)
		usernameInfo = USERNAME_UP_TO_DATE
		usernameFocused = true
	}

	function usernameBlur(e) {
		usernameInfo = usernameDebounce ? usernameInfo : ''
		usernameFocused = false
	}

	function usernameKeydown(e) {

		const { USERNAME_WILL_BE_UPDATED } = get(i18n)
		usernameInfo = USERNAME_WILL_BE_UPDATED

		if(usernameDebounce) {
			clearTimeout(usernameDebounce)
		}

		const { USERNAME_UP_TO_DATE } = get(i18n)

		usernameDebounce = setTimeout(async () =>
			teamStoreSetUsername(username).then(() => {
				usernameInfo = USERNAME_UP_TO_DATE
				usernameDebounce = setTimeout(() => {
					usernameInfo = usernameFocused ? USERNAME_UP_TO_DATE : ''
				}, 1000)
			}).catch(err => {
				console.log('ERR', err)
			})
		, 500)
	}


	function languageChanged() {
		userStoreSetLanguage(languageNow)
	}

	function dateFormatChanged() {
		console.log(dateFormatNow)
	}

	function firstWeekdayChanged() {
		console.log(firstWeekdayNow)
	}

</script>

<header class="bp-{$uiStore.breakpoint}">
	<!--<div class="subview-title">
		<h2>
			Account
		</h2>
	</div>-->
	<div class="sign-out-button-wrapper">
		<UiButton label="{$i18n.SIGN_OUT}" on:click={e => authSignOut()} />
	</div>
</header>

<section>

	<div class="container">
		<h2>
			{$i18n.YOUR_ACCOUNT}
		</h2>

		
		<UiInput
			label="{$i18n.USERNAME}"
			type="text"
			bind:value={username}
			on:focus={e => usernameFocus(e)}
			on:blur={e => usernameBlur(e)}
			on:keydown={e => usernameKeydown(e)} />
		<small class="hidden-small">
			{usernameInfo}
		</small>

	</div>


	<div class="container">
		<h2>
			{$i18n.MAIN_NAV[2]}
		</h2>


		<small class="label-small">
			{$i18n.LANGUAGE}
		</small>
		<UiRadio
			options={LANGUAGE_OPTIONS}
			bind:value={languageNow}
			on:change={e => languageChanged()} />


		<small class="label-small">
			{$i18n.DATE_FORMAT}
		</small>
		<UiRadio
			options={DATE_FORMAT_OPTIONS}
			bind:value={dateFormatNow}
			on:change={e => dateFormatChanged()} />


		<small class="label-small">
			{$i18n.FIRST_WEEKDAY}
		</small>
		<UiRadio
			options={FIRST_WEEKDAY_OPTIONS_I18N}
			bind:value={firstWeekdayNow}
			on:change={e => firstWeekdayChanged()} />
	</div>

	<!-- <p>	
		Sprache<br />
		Währung<br />
		Stunden exportieren Format<br />
		Zeitzone<br />

		E-Mail<br />
		Name<br />
		Password<br />
	</p> -->
</section>

<style>

	header {
		display:flex;
		flex-flow: row wrap;
		height:42px;
		max-width:960px;
		margin:24px auto 24px auto;
	}

	header.bp-xs {
		margin:12px;
	}

	.subview-title {
		display:flex;
		flex-flow: row wrap;
		font-size:0;
		width:50%;
	}

	.sign-out-button-wrapper {
		flex: 1;
		text-align: right;
	}

	section {
		max-width:960px;
		margin:24px auto 24px auto;
	}

	.container {
		position: relative;
		margin:0 auto 24px auto;
		border-radius: 6px;
		background:#FFF;
		padding:0 30px 30px 30px;
		box-shadow:var(--shadow-box);
	}

	h2 {
		padding:24px 0;
	}

	.hidden-small {
		margin:6px 0 -12px 0;
		display:block;
		height:18px;
	}

	.label-small {
		display:block;
		margin:24px 0 6px 0;
	}

</style>