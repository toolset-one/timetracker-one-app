const functions = require('firebase-functions')
const admin = require('firebase-admin')

const { newUserTrigger } = require('./user.new.js')

admin.initializeApp()

exports.newUserTrigger = newUserTrigger