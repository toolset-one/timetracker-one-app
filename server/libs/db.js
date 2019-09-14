const MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID

const url = 'mongodb://localhost:27017',
  dbName = 'timetracker-one'

let database,
  db = {},
  hooksInited = []

MongoClient.connect(url, {
  useNewUrlParser: true
}, (err, client) => {
  database = client.db(dbName)

  hooksInited.forEach(fn => {
    fn()
  })
})


db.hookInited = fn => {
  if(database) {
    fn()
  } else {
    hooksInited.push(fn)
  }
} 


db.getNewId = () => new ObjectID()


db.create = ({ collection, object, id }) =>
  new Promise((resolve, reject) => {
    let newObj = object
    if(id)
      newObj._id = id

    database.collection(collection).insertOne(newObj, (err, res) => {
      err
        ? reject(err)
        : resolve(res.ops[0])
    })
  })


db.uniqueIndex = ({ collection, object }) =>
  new Promise((resolve, reject) => {
    database.collection(collection).createIndex(object, {
      unique: true
    }, (err, res) => {
      err
        ? reject(err)
        : resolve(res)
    })
  })


db.findOne = ({ collection, object }) =>
  new Promise((resolve, reject) => {
    database.collection(collection).findOne(object, (err, res) => {
      err
        ? reject(err)
        : resolve(res)
    })
  })



exports.db = db