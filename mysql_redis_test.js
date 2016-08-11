// redis
var redis = require("redis");
var redis_config = {
  host : "127.0.0.1",
  port : 6379,
  auth_pass : "hyper_scribe"
}
var redis_client = redis.createClient(redis_config);

// mysql
var mysql = require('mysql');
var sql = require(__dirname+'/my_modules/sql_lib/sql_select.js')
var mysql_pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'hyper_scribe',
  password : 'hyper_scribe',
  database : 'hyper_scribe'
});


const http = require('http');
const express = require('express');
const cluster = require('express-cluster');
const useragent = require('express-useragent');

let app = express();
let server = http.createServer(app);
let port = process.env.PORT || 3030;

cluster(function(worker) {
  app.use(useragent.express());
  server.listen(port, () => {
    console.log('Server running on http://localhost:' + port + ' with pid ' + process.pid + ' with wid ' + worker.id);
  });
  app.get('/', function(req, res) {
      //console.log(req.useragent);
      res.send('hello from worker #' + worker.id +"<br/>" +JSON.stringify(req.useragent,null,"<br/>"));
  });

  app.get('/:param', function(req, res, next) {
    // do not get any static source
    if (req.params.param.indexOf(".") == -1) {
      redirect_target(req, res);
    }else {
      next()
    }
  });

  app.get('/s/:param', function(req, res) {
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
},{/*count: 1*/});

function redirect_target(req, res) {
  var scenario_uuid = req.params.param
  var targrt_urls = {}
  redis_client.get(scenario_uuid,function (err, reply) {
    if (err) {
      console.error(err);
      res.status(500).send(err)
    }
    if (reply) {
      console.log(reply);
      targrt_urls = JSON.parse(reply.toString());
      res.send(JSON.stringify(targrt_urls,null,'<br/>')) // test send
      redis_client.ttl(scenario_uuid, function (err, ttl) {
        if (ttl < 10) {
          redis_client.expire(scenario_uuid, 3600);//reset expire time to 1 hour
        }
      });
    }else {
      mysql_pool.query(sql.item_urls,[scenario_uuid], function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.status(500).send(err)
        }
        if (rows[0]) {
          targrt_urls = rows[0];
          res.send(JSON.stringify(targrt_urls,null,'<br/>')) // test send
          console.log(rows[0]);
          redis_client.set(scenario_uuid, JSON.stringify(targrt_urls), redis.print);
          redis_client.expire(scenario_uuid, 3600);//expire time to 1 hour
        }else {
          res.status(404).send("Whoops!")
        }
      });
    }
  })
}
