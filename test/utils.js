const crypto = require('crypto')

const delay = async (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

const getTempature = () => {
  return Math.floor(Math.random() * 5 + 18)
}

const getHumidity = () => {
  return Math.floor(Math.random() * 10 + 45) / 100
}

const getQuality = () => {
  return Math.floor(Math.random() * 4 + 1)
}

const keyGen = length => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
  let key = ''
  while (key.length < length) {
    let byte = crypto.randomBytes(1)
    if (byte[0] < 243) {
      key += charset.charAt(byte[0] % 27)
    }
  }
  return key
}

module.exports = {
  delay,
  getTempature,
  getHumidity,
  getQuality,
  keyGen
}