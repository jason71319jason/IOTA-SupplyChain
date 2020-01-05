const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const request = require('request')
const mam = require('@iota/mam')
const utils = require('./utils')
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

const mode = 'restricted'
const provider = 'https://nodes.devnet.iota.org'

const sensor2url = {
  Farm: 'http://localhost:3000/CurrentRoot',
  Ship: 'http://localhost:3001/CurrentRoot'
}
const app = express()
const id2data = {}

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

app.post('/Start', async (req, res) => {
  try {
    const key = utils.keyGen(81)
    mamState = mam.init(provider)
    mamState = mam.changeMode(mamState, mode, key)

    const product_id = req.body.product_id
    const product_name = req.body.product_name
    const farmer_name = req.body.farmer_name
    const sensor = req.body.sensor

    const options = {
      url: sensor2url[sensor],
      method: 'GET'
    }

    const msg = await publish(mamState, req.body)

    const product_data = {
      product_name: product_name,
      product_root: msg.root,
      product_key: key,
      farmer_name: farmer_name,
      sensor: sensor,
      state: mamState
    }

    request(options, async (error, response, data) => {
      try {

        if (!error && response.statusCode == 200) {
          data = JSON.parse(data)
          product_data["sensor_root"] = data.root
          product_data["sensor_key"] = data.side_key
          id2data[product_id] = product_data
          console.log(product_data)
          res.send({
            status: 'success'
          })
        } else {
          console.log(error);
        }

      } catch (error) {
        console.log(error)
      }
    })

  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

app.post('/Stop', async (req, res) => {
  try {
    const product_id = req.body.product_id
    const product_data = id2data[product_id]
    //mamState = mam.init(provider)
    mamState = product_data.state
    //mamState = mam.changeMode(mamState, mode, product_data.product_key)
    console.log(product_data)
    await mam.fetch(product_data.sensor_root, mode, product_data.sensor_key, async (res) => {
      try {
        const data = JSON.parse(trytesToAscii(res))
        publish(mamState, data)
      } catch (error) {
        console.log(error)
      }
    })
    // result.forEach(async (data) => {
    //   console.log(data)
    //   msg = await publish(mamState, data)
    //   console.log(msg)
    // })
    res.send({
      status: 'success',
      product_id: product_id,
      product_name: product_data.product_name,
      product_root: product_data.product_root,
      product_key: product_data.product_key,
      farmer_name: product_data.farmer_name
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
});

server.listen(5000)