var redis = require("redis");
var redis_config = {
  host : "127.0.0.1",
  port : 6379,
  auth_pass : "hyper_scribe"
}
var client = redis.createClient(redis_config);


// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

//set up keys
client.set("sample", "www.google.com",function (err, reply) {
  if (err) {
    console.error(err);
  }
  console.log(reply);
});
client.del("missingkey",function (err, reply) {
  if (err) {
    console.error(err);
  }
  console.log(reply);
});

//try to get keys
setTimeout(function () {
  get_key("sample");
  get_key("missingkey")
}, 2000);


/*
client.get("sample", function(err, reply) {
    // reply is null when the key is missing
    console.log(reply);
});

client.get("missingkey", function(err, reply) {
    // reply is null when the key is missing
    console.log(reply);
});
*/

function get_key(key) {
  client.get(key,function (err, reply) {
    if (err) {
      console.error(err);
    }
    if (reply) {
      console.log(reply);
    }else {
      console.log("Not Available");
    }
  })
}

setTimeout(function () {
  client.quit();
}, 5000);
