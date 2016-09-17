const yaml = require('js-yaml');
const fs   = require('fs');


// redis
var redis = require("redis");
var redis_config = {}
try {
  redis_config = yaml.safeLoad(fs.readFileSync(__dirname+'/configs/redis_config.yml', 'utf8'));
  //console.log(redis_config);
} catch (e) {
  console.log(e);
  redis_config = {
    host : "127.0.0.1",
    port : 6379,
    auth_pass : "hyper_scribe"
  }
}


var redis_client = redis.createClient(redis_config);

// mysql
var mysql = require('mysql');
var sql = require(__dirname+'/my_modules/sql_lib/sql_select.js')
var mysql_config = {}
try {
  mysql_pool_config = yaml.safeLoad(fs.readFileSync(__dirname+'/configs/mysql_config.yml', 'utf8'));
  //console.log(mysql_pool_config);
} catch (e) {
  console.log(e);
  mysql_pool_config = {
    connectionLimit : 10,
    host     : 'localhost',
    port     : 3306,
    user     : 'hyper_scribe',
    password : 'hyper_scribe',
    database : 'hyper_scribe'
  }
}
var mysql_pool  = mysql.createPool(mysql_pool_config);


const http = require('http');
const express = require('express');
const cluster = require('express-cluster');
const useragent = require('express-useragent');
const acceptLanguage = require('accept-language');

let app = express();
let server = http.createServer(app);
let port = process.env.PORT || 3030;

var counter = 0;

cluster(function(worker) {
  app.use(useragent.express());
  server.listen(port, () => {
    console.log('Server running on http://localhost:' + port + ' with pid ' + process.pid + ' with wid ' + worker.id);
  });
  app.get('/', function(req, res) {
      //console.log(req.useragent);
      /*
      get_val_redis("admin_users","SELECT * FROM `admin_users`").then((value) => {
        console.log("Promise OK: ")
        console.log(value);
      }).catch((err) => {
        console.log("Promise Error: ")
        console.log(err);
      })
      */
      judge_user_agent(req, res)
      .then((value) => {console.log(value);}).catch((err) => {console.log(err);})
      var send_msg = 'hello from worker #' + worker.id +"<br/>"
      send_msg += 'My User-Agent : '  +"<br/>"
      send_msg += JSON.stringify(req.useragent,null,"<br/>")
      res.send(send_msg);
      //ソースIPの取得
      console.log("address is "+req.connection.remoteAddress);
      //User-Agentの取得
      console.log("ua is "+JSON.stringify(req.headers['user-agent']));
      //他ヘッダー
      //console.log("headers is "+JSON.stringify(req.headers));
      //言語
      console.log("lang is " + req.headers["accept-language"]);
      console.log(acceptLanguage.parse(req.headers["accept-language"]))
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


// Functions

function get_val_redis(redis_key, sql, sql_params = []) {
  return new Promise(function (resolve,reject) {
    redis_client.get(redis_key,function (err, reply) {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (reply) {
        //var rows = JSON.parse(reply.toString());
        resolve(JSON.parse(reply.toString()))
        console.log("Redis!");
        //console.log(reply);
        redis_client.ttl(redis_key, function (err, ttl) {
          if (ttl < 10) {
            redis_client.expire(redis_key, 3600);//reset expire time to 1 hour
          }
        });
      }else {
        mysql_pool.query(sql, sql_params, function(err, rows, fields) {
          console.log("Mysql : "+sql);
          //console.log(sql_params);
          if (err) {
            console.error(err);
            reject(err)
          }
          //console.log(rows);
          if (rows[0]) {
            resolve(rows)
            redis_client.set(redis_key, JSON.stringify(rows), redis.print);
            redis_client.expire(redis_key, 3600);//expire time to 1 hour
          }else {
            reject(404)
          }
        });
      }
    })
  })
}


function judge_user_agent(req, res) {
  var redis_key = "_conditions"
  var user_agent_code = "default"
  return new Promise((resolve ,reject)=>{
    get_val_redis(redis_key,sql.condition_for_judge)
    .then((value ,error) => {
      if (error) {
        reject(error);
      }else {
        //console.log(value);
        //console.log(value.length);
        for (var i = 0; i <= value.length; i++) {
          if (i < value.length) {
            if(eval(value[i].conditions)){
              resolve(value[i].user_agent_code)
              break;
            }
          }else {
            resolve(user_agent_code)
          }
        }
      }
    })
  })
}

function redirect_target(req, res) {
  counter ++
  var scenario_uuid = req.params.param
  var target_urls = {}
  Promise.all([judge_user_agent(req, res),get_val_redis(scenario_uuid,sql.item_urls_plus,[scenario_uuid])])
  .then((value) => {
    //console.log(value[0]);
    //console.log(value[1]);
    var val = value[0]
    value[1] = value[1][0]? value[1][0] :value[1];
    //console.log(value);
    console.log(counter);
    console.log("ua is "+JSON.stringify(req.headers['user-agent']));
    console.log("lang is " + req.headers["accept-language"]);
    console.log(acceptLanguage.parse(req.headers["accept-language"]))

    var target_urls = JSON.parse(value[1].variety_item_pages);
    target_urls["item_page"] = value[1].item_page
    //console.log(target_urls[val]);
    if (target_urls[val] && target_urls[val] != "") {
      res.status(302).redirect(target_urls[val])
    }else if (target_urls["item_page"] && target_urls["item_page"] != "") {
      res.status(302).redirect(target_urls["item_page"])
    }else {
      res.status(404).send("Whoops!")
    }
  }).catch((err) => {
    catch_error(res,err)
    console.log(err);
  })
  /*
  judge_user_agent(req, res)
  .then((val) => {
    get_val_redis(scenario_uuid,sql.item_urls_plus,[scenario_uuid])
    .then((value) => {
      value = value[0]? value[0] :value;
      //console.log(value);
      console.log(counter);
      console.log("ua is "+JSON.stringify(req.headers['user-agent']));
      var target_urls = JSON.parse(value.variety_item_pages);
      target_urls["item_page"] = value.item_page
      //console.log(target_urls[val]);
      if (target_urls[val] && target_urls[val] != "") {
        res.status(302).redirect(target_urls[val])
      }else if (target_urls["item_page"] && target_urls["item_page"] != "") {
        res.status(302).redirect(target_urls["item_page"])
      }else {
        res.status(404).send("Whoops!")
      }
    }).catch((err) => {
      catch_error(res,err)
      console.log(err);
    })
    //console.log(val);
  }).catch((err) => {
    catch_error(res,err)
    console.log(err);
  })
  */
}

function catch_error(res,err) {
  if (err == 404) {
    res.status(404).send("Whoops!")
  }else {
    res.status(500).send("Server Error : "+err)
  }
}
