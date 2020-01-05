const request = require('request')

const test = async () => {
  try {

    const data = {
      product_id: process.argv[2],
    }

    const options = {
      url: 'http://localhost:5000/Search',
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