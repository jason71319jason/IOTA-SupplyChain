const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const MyMam = require('./mam.js')
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
      root: currentRoot
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

server.listen(3000)

const run = async () => {
  mamState = await MyMam.initMam(defaultProvider, fakeSeed)
  mamState = await MyMam.createChannel(mamState, defaultMode, defaultKey)
  while (true) {
    msg = await MyMam.sensorPublish(mamState, delayTime)
    console.log(msg)
    currentRoot = msg.root
  }
}

run()