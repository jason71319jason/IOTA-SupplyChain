const request = require('request')
const Mam = require('@iota/mam')
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

const test = async () => {
  try {

    const jsonData = {
      product_name: process.argv[2],
      farmer_name: process.argv[3],
      timestamp: (new Date()).toLocaleString(),
      status: 'Stop',
    }
    const options = {
      url: 'http://localhost:3001/stop',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      json: jsonData
    };

    request(options, function(error, response, data) {
      if (!error && response.statusCode == 200) {
        console.log(data);
      } else {
        console.log(error);
      }
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: "fail"
    })
  }
}

const logData = async (data) => console.log('fetch and parsed', JSON.parse(
  trytesToAscii(data)), '\n')

const test2 = async () => {
  let root = 'GKSPGZYBJAOVYZHGSECGIYXWLJPBXYEZGYSZWI9C9JXUGJBMEUEEQLYFGACSMY9QDBSTJTJHCMPANNCDW'
  let mode = 'restricted'
  let key = 'KEY'
  console.log('fetching')
  await Mam.fetch(root, mode, key.padEnd(81, '9'), async (res) => {
    const jsonData = JSON.parse(trytesToAscii(res))
    console.log(jsonData)
    result.push(jsonData)
  })
  // const res = await Mam.fetch(root, mode, key.padEnd(81, '9'), async (res) => {
  //   const jsonData = JSON.parse(trytesToAscii(res))
  //   console.log(jsonData)
  //   result.push(jsonData)
  // })
  console.log('end')
}

test()