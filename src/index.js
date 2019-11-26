const Mam = require('./mam.js')

const defaultMode = 'restricted'
const defaultKey = 'KEY'
const defaultProvider = 'https://nodes.devnet.iota.org'
const defaultRoot = 'TRP9FBKUFGMMAZGYKNDLJPQIZGAUGPFKJUXPTA9KXHWJLNXLVIXKS9HLRFAWOPGHQZIX9TOFACEDJXXY9'
const test = async () => {
    let mamState = Mam.initMam(defaultProvider)
    mamState = await Mam.createChannel(mamState, defaultMode, defaultKey)
    try {    
        console.log(mamState)    
        let msg = await Mam.startRecord(mamState)    
        //res = await Mam.sensorPublish(mamState, 6, 5, defaultProvider, defaultMode, defaultKey) 
        console.log(msg.state)    
        console.log(msg.root)    
        //Mam.fetch(defaultRoot, defaultMode, defaultKey.padEnd(81, '9'))    
    } catch(error) {
        console.log(error)
    }     
}        

test()
