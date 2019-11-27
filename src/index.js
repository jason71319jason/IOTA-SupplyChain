const Mam = require('./mam.js')
const mamlib = require('@iota/mam')
const request = require('request')
const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'

const test = async () => {

    try {    
		// send request example          
        let mamState = Mam.initMam(defaultProvider)    
        mamState = await Mam.createChannel(mamState, defaultMode, defaultKey)
        let msg = await Mam.startRecord(mamState);    
        mamState = msg.state    

        const jsonData = {
            mamState: mamState,
            num: 3,
            delay: 1    
        }
        const options = {
            url: 'http://localhost:30000/startgenerate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            json: jsonData
        };
        request(options, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log(data);
				// fetch example 
				console.log(msg.root)
        		Mam.fetch(msg.root, defaultMode, defaultKey.padEnd(81, '9'))
            		.then((res) => {
                		console.log(res)
            		})
            } else {
                console.log(error);
            }
        })    
    } catch(error) {
        console.log(error)
    }     
}        

test()
