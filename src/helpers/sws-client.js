import { swsServer, setSWS } from '../helpers/sws-server.js'

export let sws = {}

setSWS(sws)



sws.init = async ({ server, models }) => {
	return sws.bridge.send({
		action: 'init',
		server,
		models
	})
}



sws.auth = {

	user: null,
	teams: null,

	authStateHooks: [],
	teamStateHooks: [],

	hookIntoAuthState: fn => {
		sws.auth.authStateHooks.push(fn)
		fn(sws.auth.user)
	},

	updateAuth: (user, jwt) => {
		sws.auth.user = user
		sws.auth.authStateHooks.forEach(fn => fn(sws.auth.user))
	},

	signUp: (email, password) => {
		return sws.bridge.send({
			action: 'signUp',
			email,
			password
		})
	},

	signIn: (email, password) => {
		return sws.bridge.send({
			action: 'signIn',
			email,
			password
		})
	},

	signOut: () => {
		return sws.bridge.send({
			action: 'signOut'
		}).then(() => location.reload(true))
	},

	hookIntoTeamState: fn => {
		sws.auth.teamStateHooks.push(fn)
		fn(sws.auth.teams)
	},

	updateTeams: (teams) => {
		sws.auth.teams = teams
		sws.auth.teamStateHooks.forEach(fn => fn(sws.auth.teams))
	},

	setTeamTitle: ({ id, title }) => {
		return sws.bridge.send({
			action: 'setTeamTitle',
			id,
			title
		})
	},

	inviteMember: ({ teamId, email, name }) => {
		return sws.bridge.send({
			action: 'inviteMember',
			teamId,
			email,
			name
		})
	}
}


sws.db = {

	hooks: {},

	new: async ({ col, data, id }) => {
		return sws.bridge.send({
			action: 'new',
			col,
			id,
			data
		})
	},

	update: async ({ col, id, data }) => {
		return sws.bridge.send({
			action: 'update',
			col,
			id,
			data
		})
	},

	get: async ({ col, id }) => {
		return sws.bridge.send({
			action: 'get',
			col,
			id
		})
	},


	query: async ({ col, query }) => {
		return sws.bridge.send({
			action: 'query',
			col,
			query
		})
	},


	hook: async ({ col, query, hook, fn }) => {
		sws.db.hooks[hook] = fn
		return sws.bridge.send({
			action: 'hook',
			col,
			query,
			hook
		})
	},


	unhook: async ({ hook }) => {
		delete sws.db.hooks[hook]
		return sws.bridge.send({
			action: 'unhook',
			hook
		})
	},


	delete: async ({ col, id }) => {
		return sws.bridge.send({
			action: 'update',
			col,
			id,
			data: {
				__deleted: true
			}
		})
	},


	getReportData: async ({ team, dates, filterTasks }) => {
		return sws.bridge.send({
			action: 'getReportData',
			team,
			dates,
			filterTasks
		})
	},


	__processHook: async (hook, obj) => {
		if(sws.db.hooks[hook]) {
			sws.db.hooks[hook](obj)
		}
	},
}


sws.bridge = {
	promises: {},
	send: async json => {
		json.promiseId = Math.floor(Math.random() * 1000000000000)
		return new Promise((resolve, reject) => {
			sws.bridge.promises[json.promiseId] = {
				resolve,
				reject
			}
			swsServer.bridge.postMessage(JSON.stringify(json))
		})
	},

	postMessage: jsonString => {
		const json = JSON.parse(jsonString)
		if(sws.bridge.promises[json.promiseId]) {
			sws.bridge.promises[json.promiseId][json.err ? 'reject' : 'resolve'](json.err ? json.err : json.answer)
			delete sws.bridge.promises[json.promiseId]
		} else {
			switch(json.action) {
				case 'updateAuth':
					sws.auth.updateAuth(json.answer.user, json.answer.jwt)
					break;
				case 'updateTeams':
					sws.auth.updateTeams(json.answer)
					break;
				case 'processHook':
					sws.db.__processHook(json.answer.hook, json.answer.obj)
					break;
			}
		}
	}
}