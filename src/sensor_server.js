const express = require('express')
const app = express()
const http = require('http')
const Mam = require('./mam.js')
const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'
const bodyParser = require('body-parser');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

app.use(bodyParser.json({limit: '1mb'}));

app.use(bodyParser.urlencoded({            
   extended: false 
}));

server = http.createServer(app);

const generateData = async (mamState, totalNum, delayTime) => {
    try {
        const msg = await Mam.sensorPublish(mamState, totalNum, delayTime)
        return msg    
    } catch (error) {
        console.log(error)
        return null 
    }
}

app.get('/', function(req, res) {
    res.send('Test Page!');
});

app.post('/startgenerate', async (req, res) => {
    try {
        let mamState = Mam.initMam(defaultProvider)
        mamState = await Mam.createChannel(mamState, defaultMode, defaultKey)
        mamState  = req.body.mamState
        const num = req.body.num
        const delay = req.body.delay
        let msg = await generateData(mamState, num, delay)
        res.send({status: "success"})
    } catch (error) {
        console.log(error)
		res.send({status: "fail"})
    }
});

server.listen(30000)
