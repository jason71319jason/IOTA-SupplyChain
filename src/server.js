const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)

app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/updateroot=$root', function(req, res) {
   console.log(req) 
});
server.listen(3001)
