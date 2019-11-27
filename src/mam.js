const Mam = require('@iota/mam')                                                                                               
const Utils = require('./utils.js')
const DataGen = require('./data-generator.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const initMam = (prodiver) => {
    return Mam.init(prodiver);
}

const publish = async (mamState, data) => {
    const trytes = asciiToTrytes(JSON.stringify(data))
    const message = await Mam.create(mamState, trytes)
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

const sensorPublish = async (mamState, numberOfRecord, delayTimePerRecord) => {
    try {    
        let temp = await DataGen.getTempature()
//        console.log('temp= '+temp);    
        let hum = await DataGen.getHumidity()
//        console.log('hum= '+hum);    
 
        let msg = await publish(mamState, {
                Tempature: temp,
                Humidity: hum,
                Timestamp: (new Date()).toLocaleString()});
        
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

const humanPublish = async (mamState, data) => {
    try {
        const message = await publish(mamState, data);    
        return message    
    } catch (error) {
        console.log('[Human Publish Error]', error)    
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
