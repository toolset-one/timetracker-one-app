const { db } = require('../libs/db.js')


db.hookInited(() => {
	db.uniqueIndex({
		collection: 'users',
		object: {
			email: 1
		}
	})

	db.uniqueIndex({
		collection: 'teams',
		object: {
			slug: 1
		}
	})
})


