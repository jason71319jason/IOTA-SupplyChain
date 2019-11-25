
const getTempature = () => {
    return Math.floor(Math.random() * 5 + 18)        
}

const getHumidity = () => {
    return Math.floor(Math.random() * 10 + 45)/100
}

const getQuality = () => {
    return Math.floor(Math.random() * 4 + 1)    
}

module.exports = {
    getTempature,
    getHumidity,
    getQuality
}
