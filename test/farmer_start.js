const request = require('request')

const test = async () => {
  try {

    const jsonData = {
      product_name: process.argv[2],
      farmer_name: process.argv[3],
      timestamp: (new Date()).toLocaleString(),
      status: 'Start',
      sensors: ['Temp', 'Humi']
    }
    const options = {
      url: 'http://localhost:3001/start',
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

test()