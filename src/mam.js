const Mam = require('@iota/mam')                                                                                               
const Utils = require('./utils.js')
const DataGen = require('./data-generator.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const initMam = (prodiver) => {
    return Mam.init(prodiver);
}

const publish = async (mamState, data) => {
    const trytes = asciiToTrytes(JSON.stringify(data))
    const message = Mam.create(mamState, trytes)
    const depth = 3
    const minWeightMagnitude = 9

    try {
        mamState = message.state
        await Mam.attach(message.payload, message.address, depth, minWeightMagnitude)
        return message

    } catch(error) {
        console.log('[Error] MAM', error)
        return null    
    }

}
 
const createChannel = async (mamState, mode, key) => {
    const newMamState = Mam.changeMode(mamState, mode, key)
    return newMamState
}

const startRecord = async (mamState) => {
   const startData = {
       Producer: 'ProducerA',
       Location: 'LocationA',    
       Tiimestamp: (new Date()).toLocaleString()    
   }
   try {
        const message = await publish(mamState, startData)   
        return message   
   } catch(error) {
        console.log('[Error] Start', error)   
        return null   
   }
}

const appendToChannel = async (mamState, data) => {
    const newMamState = {
        subscribed: [],
        channel: {
            side_key: mamState.channel.side_key,
            mode: 'restricted',
            next_root: mamState.channel.next_root,
            security: 2,
            start: mamState.channel.start,
            count: 1,
            next_count: 1,
            index: 0,
        },
        seed: mamState.seed,
    }
    try {
        mamState = newMamState
        const message = await publish(mamState, data)    
        return mamState    
    } catch(error) {
        console.log('[Error] Append', error);
        return null    
    }
}

const sensorPublish = async (mamState, numberOfRecord, delayTimePerRecord, provider, mode, key) => {
    try {    
        let temp = await DataGen.getTempature()
        let hum = await DataGen.getHumidity()
 
        let msg = await publish(mamState, {
                Tempature: temp,
                Humidity: hum,
                Timestamp: (new Date()).toLocaleString()});
        const root = msg.root

        for(let i=0; i<numberOfRecord-1; i++) {
            temp = await DataGen.getTempature()
            hum = await DataGen.getHumidity()
            msg = await publish(mamState, {
                Tempature: temp,
                Humidity: hum,
                Timestamp: (new Date()).toLocaleString()});
            await Utils.delay(delayTimePerRecord)
        }
        return msg    
    } catch(error) {
        console.log(error)
        return null    
    }
}

const fetch = async (root, mode, key) => {
    try {    
        const result = await Mam.fetch(root, mode, key)
        console.log(result)    
        return result    
    } catch(error) {
        console.log(error)    
        return null
    }
}

module.exports = {
    initMam,
    createChannel,
    sensorPublish,
    publish,
    fetch,
    startRecord    
}
