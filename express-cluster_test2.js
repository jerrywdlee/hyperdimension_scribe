'use strict';

const http = require('http');
const express = require('express');
const cluster = require('express-cluster');
const useragent = require('express-useragent');

let app = express();
let server = http.createServer(app);

//let host = process.env.HOST || '127.0.0.1';//if use 127, cannot access by local ip
let host = process.env.HOST
let port = process.env.PORT || 3000;

cluster(function(worker) {
  app.use(useragent.express());
  server.listen(port, host, () => {
    console.log('Server running on http://' + host + ':' + port + ' with pid ' + process.pid + ' with wid ' + worker.id);
  });
  app.get('/', function(req, res) {
      //console.log(req.useragent);
      res.send('hello from worker #' + worker.id +"<br/>" +JSON.stringify(req.useragent,null,"<br/>"));
  });
});
