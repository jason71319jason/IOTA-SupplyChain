const request = require('request')

const test = async () => {
  try {

    const data = {
      product_id: process.argv[2],
      product_name: process.argv[3],
      farmer_name: process.argv[4],
      timestamp: (new Date()).toLocaleString(),
      status: 'Start',
      sensor: 'Farm'
    }

    const options = {
      url: 'http://localhost:5000/Start',
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