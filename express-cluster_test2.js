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

  app.get('/ana/:param', function(req, res) {
      //res.send('respond user Info params:' + req.params.params);
      //res.end();
      res.redirect("http://www.google.com/?rd=ssl#q="+req.params.param);
      console.log("Function: Search "+req.params.param);
  });
  //http://153.120.158.89:3033
  app.get('/demo/:param', function(req, res) {
      //res.send('respond user Info params:' + req.params.params);
      //res.end();
      res.redirect("http://153.120.158.89:3033/"+req.params.param);
      console.log("Function: demo "+req.params.param);
  });
});
