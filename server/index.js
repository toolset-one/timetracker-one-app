process.stdout.write('\033c')

const http = require('http'),
  wsServer = require('ws').Server,
  authInit = require('./libs/auth.js'),
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


let sockets = []



wss.on('connection', ws => {
  sockets.push(ws)

  ws.on('message', async req => {
    const data = JSON.parse(req)

    console.log(data.action)

    const test = ACTIONS[data.action](ws, sockets, data).then(res => {
      ws.send(
        JSON.stringify(
          {
            action: data.action,
            promiseId: data.promiseId,
            answer: res
          } 
        )
      )
    }).catch(err => {
      ws.send(
        JSON.stringify(
          {
            action: data.action,
            promiseId: data.promiseId,
            err
          } 
        )
      )
    })
  })

  ws.on('close', cleanSockets)
})

const cleanSockets = () => {
  for (var i = sockets.length - 1; i >= 0; i--) {
    if (!sockets[i]._socket) {
      sockets.splice(i, 1)
    }
  }
}

this.server = http.createServer((req, res) => res.end('Hello!')).listen(8081)  