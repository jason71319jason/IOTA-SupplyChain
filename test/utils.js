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

module.exports = {
  delay,
  getTempature,
  getHumidity
}