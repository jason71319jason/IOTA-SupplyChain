const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const Mam = require('@iota/mam')
const Utils = require('./utils.js')

const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'
const delayTime = 10
const fakeSeed = 'RKQ9XOHTYYTXL9ALBJVMVPGGECLADASJRTNNAFHXSWLYFJSUFSZFNRMLRCARUJHMLZNZNMHNBPXAQEBAU'

const app = express()
let currentRoot
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

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

app.get('/root', async (req, res) => {
  try {
    res.send({
      root: currentRoot,
      side_key: defaultKey.padEnd(81, '9')
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

server.listen(3000)

const publish = async (mamState, data) => {
  let trytes = asciiToTrytes(JSON.stringify(data))

  const message = await Mam.create(mamState, trytes)
  const depth = 3
  const minWeightMagnitude = 9

  try {
    mamState = message.state
    await Mam.attach(message.payload, message.address, depth, minWeightMagnitude)
    return message
  } catch (error) {
    console.log('[Error] MAM', error)
    return null
  }
}

const run = async () => {
  try {
    mamState = await Mam.init(defaultProvider, fakeSeed)
    mamState = await Mam.changeMode(mamState, defaultMode, defaultKey)
    while (true) {

      let temp = await Utils.getTempature()
      let hum = await Utils.getHumidity()
      let msg = await publish(mamState, {
        Tempature: temp,
        Humidity: hum,
        Timestamp: (new Date()).toLocaleString()
      });
      await Utils.delay(delayTime)
      console.log(msg)
      currentRoot = msg.root
    }
  } catch (error) {
    console.log(error)
  }
}

run()