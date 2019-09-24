process.stdout.write('\033c')

const http = require('http'),
  wsServer = require('ws').Server,
  authInit = require('./libs/auth.js'),

  { socketsInit } = require('./libs/sockets.js'),

  { signUp } = require('./libs/auth/sign-up.js'),
  { signIn } = require('./libs/auth/sign-in.js'),
  { signInWithToken } = require('./libs/auth/sign-in-with-token.js'),
  { syncToServer } = require('./libs/sync/sync-to-server.js'),
  { syncToClient, verifySyncToClient } = require('./libs/sync/sync-to-client.js')

  let ACTIONS = {
    signUp,
    signIn,
    syncToServer,
    syncToClient,
    signInWithToken,
    verifySyncToClient
  }

const wss = new wsServer({
  port: 8080
})

socketsInit({
  wss,
  ACTIONS
})


this.server = http.createServer((req, res) => res.end('Hello!')).listen(8081)  