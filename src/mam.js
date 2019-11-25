const Mam = require('@iota/mam')                                                                                               
const FS = require('fs')
const Utils = require('utils')
const DataGen = require('./data-generator.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
 
const defaultMode = 'restricted'
const defaultKey = 'key'
const defaultProvider = 'https://nodes.devnet.iota.org'

const initMam = (prodiver) => {
    return Mam.init(prodiver);
}

const publish = async (data, mamState) => {
    const trytes = asciiToTrytes(JSON.stringify(data))
    const message = Mam.create(mamState, trytes)
    const depth = 3
    const minWeightMagnitude = 9

    try {
        mamState = message.state
        await Mam.attach(message.payload, message.address, depth, minWeightMagnitude)
        console.log(`Publish ${data}`)
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

const appendToChannel = async (data, mamState) => {
    const newMamState = {
        subscribed: [],
        channel: {
            side_key: mamState.secretKey,
            mode: 'restricted',
            next_root: mamState.next,
            security: 2,
            start: mamState.start,
            count: 1,
            next_count: 1,
            index: 0,
        },
        seed: mamState.seed,
    }
    try {
        mamState = newMamState
        const message = await publish(data);    
        return null    
    } catch(error) {
        console.log('[Error] Append', error);
        return null    
    }
}

const sensorPublish = async (mamState) => {
    let temp = await getTempature()
    let hum = await getHumidity()
 
    let msg = await publish({
        ▏   Tempature: temp,
        ▏   Humidity: hum,
        ▏   Timestamp: (new Date()).toLocaleString()},
        mamState);
 
 
    for(let i=0; i<numberOfRecord-1; i++) {
        temp = await getTempature()
        hum = await getHumidity()
        msg = await publish({
        ▏   Tempature: temp,
        ▏   Humidity: hum,
        ▏   Timestamp: (new Date()).toLocaleString()},
        mamState);
        await Utils.delay(delayTimePerRecord)
    }
}

const humanPublish = async (mamState) => {
}
 
const fetch = async (root, key, callback) => {
    const mamState = Mam.init(provider)
    const result = await Mam.fetch(root, mode, key, callback)
}
 
