const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const request = require('request')
const Mam = require('@iota/mam')
const defaultMode = 'public'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'
const fakeSeed = 'MPIXIZL9PYFRROIDUVLNFQIMCZEPDLDJGKEGUUDWYDFRSXSULYJDFWGWLEFQCZHBYSGFIZMLOMUWEKKER'
const app = express()
let mamState
let mamExplorerLink = 'empty'
let currentRoot = 'DMDFYJMAYJEFWIGNPKKGDQEWVOFASQZLCA9YCMDZD9YIDGMOXWAEDHRLJN9VTREJRZXXGFPUNVQVJKCEX'
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

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

app.post('/start', async (req, res) => {
  try {

    mamState = await Mam.init(defaultProvider)
    mamState = await Mam.changeMode(mamState, defaultMode)

    const options = {
      url: 'http://localhost:3000/root',
      method: 'GET'
    }

    console.log(req.body)
    let msg = await publish(mamState, req.body)
    console.log(msg)
    //currentRoot = msg.root
    mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(defaultProvider)}&mode=${defaultMode}&root=${msg.root}`
    request(options, async (error, response, data) => {
      if (!error && response.statusCode == 200) {
        console.log(data);
        res.send({
          status: 'success',
          varify: mamExplorerLink
        })
      } else {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

app.post('/stop', async (req, res) => {
  try {
    const provider = 'https://nodes.devnet.iota.org'
    const mode = 'restricted'
    let tmpMamState = Mam.init(provider)
    tmpMamState = await Mam.changeMode(tmpMamState, mode, defaultKey)
    console.log(currentRoot)
    result = []
    await Mam.fetch(currentRoot, mode, defaultKey.padEnd(81, '9'), async (res) => {
      const data = JSON.parse(trytesToAscii(res))
      console.log(data)
      result.push(data)
    })
    result.forEach(async (data) => {
      console.log(data)
      msg = await publish(mamState, data)
      console.log(msg)
    })
    res.send({
      status: 'success',
      varify: mamExplorerLink
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

server.listen(3001)