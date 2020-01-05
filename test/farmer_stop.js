const request = require('request')
const Mam = require('@iota/mam')
const defaultProvider = 'https://nodes.devnet.iota.org'
const {
  asciiToTrytes,
  trytesToAscii
} = require('@iota/converter')

const test = async () => {
  try {

    const data = {
      product_id: process.argv[2],
      timestamp: (new Date()).toLocaleString(),
      status: 'Stop',
    }
    const options = {
      url: 'http://localhost:5000/Stop',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      json: data
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

test()