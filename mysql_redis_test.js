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
  var target_urls = {}
  redis_client.get(scenario_uuid,function (err, reply) {
    if (err) {
      console.error(err);
      res.status(500).send(err)
    }
    if (reply) {
      target_urls = JSON.parse(reply.toString());
      check_user_agent(req, res, target_urls)
      console.log("Redis!");
      console.log(reply);
      //res.send(JSON.stringify(target_urls,null,'<br/>')) // test send
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
          target_urls = rows[0];
          check_user_agent(req, res, target_urls)
          //res.send(JSON.stringify(target_urls,null,'<br/>')) // test send
          console.log("MySql!");
          console.log(rows[0]);
          redis_client.set(scenario_uuid, JSON.stringify(target_urls), redis.print);
          redis_client.expire(scenario_uuid, 3600);//expire time to 1 hour
        }else {
          res.status(404).send("Whoops!")// test 404
        }
      });
    }
  })
}

function check_user_agent(req, res, target_urls) {
  if (req.useragent.source.indexOf('Line') != -1) {
    //res.status(302).redirect(target_urls.item_page_line)
    redirect_302(res, target_urls.item_page_line, target_urls)
  }else if (req.useragent.source.indexOf('QQ') != -1) {
    //res.status(302).redirect(target_urls.item_page_qq)
    redirect_302(res, target_urls.item_page_qq, target_urls)
  }else if (req.useragent.source.indexOf('MicroMessenger') != -1) {
    //res.status(302).redirect(target_urls.item_page_wechat)
    redirect_302(res, target_urls.item_page_wechat, target_urls)
  }else if (req.useragent.source.indexOf('FB') != -1) {
    if (req.useragent.source.indexOf('Messenger') != -1) {
      //res.status(302).redirect(target_urls.item_page_messenger)
      redirect_302(res, target_urls.item_page_messenger, target_urls)
    }else {
      //res.status(302).redirect(target_urls.item_page_fb)
      redirect_302(res, target_urls.item_page_fb, target_urls)
    }
  }else if (req.useragent.source.indexOf('Alipay') != -1) {
    redirect_302(res, target_urls.item_page_alipay, target_urls)
  }else if (req.useragent.isiPhone || req.useragent.isiPod) {
    redirect_302(res, target_urls.item_page_iphone, target_urls)
  }else if (req.useragent.isAndroid) {
    redirect_302(res, target_urls.item_page_android, target_urls)
  }else {
    //res.status(302).redirect(target_urls.item_page)
    redirect_302(res, target_urls.item_page, target_urls)
  }
}

function redirect_302(res, target, target_urls) {
  if (target && target != "") {
    res.status(302).redirect(target)
  }else {
    if (target_urls.item_page) {
      res.status(302).redirect(target_urls.item_page && target_urls.item_page !="")
    }else {
      res.status(404).send("Whoops!")// test 404
    }
  }
}
