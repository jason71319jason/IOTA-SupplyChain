const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const request = require('request')
const MyMam = require('./mam.js')
const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'
const fakeSeed = 'MPIXIZL9PYFRROIDUVLNFQIMCZEPDLDJGKEGUUDWYDFRSXSULYJDFWGWLEFQCZHBYSGFIZMLOMUWEKKER'
const app = express()
let mamState
let currentRoot = 'DMDFYJMAYJEFWIGNPKKGDQEWVOFASQZLCA9YCMDZD9YIDGMOXWAEDHRLJN9VTREJRZXXGFPUNVQVJKCEX'

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

    mamState = await MyMam.initMam(defaultProvider, fakeSeed)
    mamState = await MyMam.createChannel(mamState, defaultMode, defaultKey)

    const options = {
      url: 'http://localhost:3000/root',
      method: 'GET'
    }
    console.log(req.body)
    let msg = await MyMam.publish(mamState, req.body)
    console.log(msg)
    request(options, async (error, response, data) => {
      if (!error && response.statusCode == 200) {
        console.log(data);
        currentRoot = data.root
        res.send({
          status: 'success'
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

    await MyMam.fetch(currentRoot, defaultMode, defaultKey.padEnd(81, '9'))
      .then((response) => {
        console.log(response)
      })
    res.send({
      status: 'success'
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

server.listen(3001)