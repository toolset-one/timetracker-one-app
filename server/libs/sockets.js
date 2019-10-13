
let socketsClients = []
exports.socketsClients = socketsClients

let socketsTeams = {}
exports.socketsTeams = socketsTeams



exports.socketsInit = ({ wss, ACTIONS }) => {


  wss.on('connection', ws => {
    socketsAdd(ws)

    ws.on('message', async req => {
      const data = JSON.parse(req)

      const test = ACTIONS[data.action](ws, socketsClients, data).then(res => {
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


    ws.on('close', function() {
      socketsClean(this.clientId, this.userData)
    })
  })


}


const socketsAdd = ws => {
  ws.clientId = Math.round(Math.random() * 1000000000)
  socketsClients.push(ws)
}


exports.socketsAddToTeam = (ws, teamId) => {
  if(!socketsTeams[teamId]) {
    socketsTeams[teamId] = []
  }
  socketsTeams[teamId].push(ws)
}


const socketsClean = (clientId, userData) => {

  socketsClients = socketsClients.filter(ws => ws.clientId != clientId)

  if(userData) {
    Object.keys(userData.teams).forEach(teamId => {
      socketsTeams[teamId] = socketsTeams[teamId].filter(ws => ws.clientId != clientId)
    })
  }

}