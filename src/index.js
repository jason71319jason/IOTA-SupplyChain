const Mam = require('./mam.js')
const request = require('request')
const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'

const test = async () => {

    try {    
          
        let mamState = Mam.initMam(defaultProvider)    
        mamState = await Mam.createChannel(mamState, defaultMode, defaultKey)
        let message = await Mam.startRecord(mamState);    
        mamState = message.state    

        const jsonData = {
            state: mamState,
            num: 3,
            delay: 3
        }

        const options = {
            url: 'http://localhost:3001/startgenerate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            json: jsonData
        };
            
        request(options, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log(JSON.stringify(data));
            } else {
                console.log(error);
            }
        })    
        //let pubMamState = Mam.initMam(defaultProvider)    
        //pubMamState = await Mam.createChannel(pubMamState, defaultMode, defaultKey)

        //for (let i=0; i<3; ++i) {    
        //    let resMamState = Mam.initMam(defaultProvider)
        //    resMamState = await Mam.createChannel(resMamState, defaultMode, defaultKey)
        //    let msgs = await Mam.startRecord(resMamState, pubMamState)    
        //    console.log(msgs.resMessage, msgs.pubMessage)    
        //    await Mam.sensorPublish(resMamState, 3, 3) 
        //    let resres = await Mam.fetch(msgs.resMessage.root, defaultMode, defaultKey.padEnd(81, '9'))    
        //    let pubres = await Mam.fetch(msgs.pubMessage.root, defaultMode, defaultKey.padEnd(81, '9'))    
        //    console.log(msgs.resMessage.root, msgs.pubMessage.root)    
        //}
    } catch(error) {
        console.log(error)
    }     
}        

test()
