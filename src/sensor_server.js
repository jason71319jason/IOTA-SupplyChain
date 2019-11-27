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
    if(req.body) {
        console.log(req.body)    
        await generateData(req.body.state, req.body.num, req.body.delay)
    } else {
        res.send(JSON.stringify({result: 'Fail'}));   
    }
});

server.listen(3001)
