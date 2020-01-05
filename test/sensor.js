const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const mam = require('@iota/mam')
const utils = require('./utils.js')

const mode = 'restricted'
const key = utils.keyGen(81)
const provider = 'https://nodes.devnet.iota.org'
const delayTime = 10

const app = express()
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

let sensorCurrentRoot
let mamState

app.use(bodyParser.json({
  limit: '1mb'
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

server = http.createServer(app);

app.get('/', function(req, res) {
  res.send('Test Page!');
});

app.get('/CurrentRoot', async (req, res) => {
  try {
    res.send({
      status: "success",
      root: sensorCurrentRoot,
      side_key: key
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

const publish = async (mamState, data) => {
  let trytes = asciiToTrytes(JSON.stringify(data))

  const message = await mam.create(mamState, trytes)
  const depth = 3
  const minWeightMagnitude = 9

  try {
    mamState = message.state
    await mam.attach(message.payload, message.address, depth, minWeightMagnitude)
    return message
  } catch (error) {
    console.log('[Error] MAM', error)
    return null
  }
}

const run = async () => {
  try {
    mamState = mam.init(provider)
    mamState = mam.changeMode(mamState, mode, key)
    while (true) {

      let temp = utils.getTempature()
      let hum = utils.getHumidity()

      let msg = await publish(mamState, {
        Tempature: temp,
        Humidity: hum,
        Timestamp: (new Date()).toLocaleString()
      });
      console.log(msg)
      await utils.delay(delayTime)
      sensorCurrentRoot = msg.root
    }
  } catch (error) {
    console.log(error)
  }
}

server.listen(process.argv[2])
run()