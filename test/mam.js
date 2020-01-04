const Mam = require('@iota/mam')
const Utils = require('./utils.js')
const fakeRoot = 'GKSPGZYBJAOVYZHGSECGIYXWLJPBXYEZGYSZWI9C9JXUGJBMEUEEQLYFGACSMY9QDBSTJTJHCMPANNCDW'
const fakeNextRoot = 'FAJWZCWLJBPIRYBMDGICXLUCNYCPWATWYNYNZZKMLFRFCADLRLNUJYJHXWDTISEZBJVERMTLDQBYKUHCJ'
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

const initMam = (prodiver, seed) => {
  return Mam.init(prodiver, seed);
}

const publish = async (mamState, data) => {
  let trytes = asciiToTrytes(JSON.stringify(data))

  const message = await Mam.create(mamState, trytes)
  const depth = 3
  const minWeightMagnitude = 9

  try {
    mamState = message.state
    await Mam.attach(message.payload, message.address, depth, minWeightMagnitude)
    return message
  } catch (error) {
    console.log('[Error] MAM', error)
    return null
  }
}

const sensorPublish = async (mamState, delayTimePerRecord) => {
  try {
    let temp = await Utils.getTempature()
    let hum = await Utils.getHumidity()
    let msg = await publish(mamState, {
      Tempature: temp,
      Humidity: hum,
      Timestamp: (new Date()).toLocaleString()
    });
    await Utils.delay(delayTimePerRecord)
    return msg
  } catch (error) {
    console.log(error)
    return null
  }
}

const createChannel = async (mamState, mode, key) => {
  const newMamState = Mam.changeMode(mamState, mode, key)
  return newMamState
}

const fetch = async (root, mode, key) => {
  try {
    let result = []
    console.log('fetching', root)
    await Mam.fetch(root, mode, key, async (res) => {
      const jsonData = JSON.parse(trytesToAscii(res))
      console.log(jsonData)
      result.push(jsonData)
    })
    return result

  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = {
  initMam,
  publish,
  sensorPublish,
  createChannel,
  fetch
}