var redis = require('redis')
    , redis_config = {
      host : "127.0.0.1",
      port : 6379,
      auth_pass : "hyper_scribe"
    }
    , client = redis.createClient(redis_config);

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on('connect', runSample);

function runSample() {
    // Set a value with an expiration
    client.set('string key', '{"key":"Hello World"}', redis.print);
    // Expire in 3 seconds
    client.expire('string key', 3);
    var life_prolonging = setTimeout(function () {
      client.expire('string key', 4);
    }, 2500);
    // This timer is only to demo the TTL
    // Runs every second until the timeout
    // occurs on the value
    var myTimer = setInterval(function() {
        client.get('string key', function (err, reply) {
            if(reply) {
                console.log('I live: ' + reply.toString());
                console.log(JSON.parse(reply.toString()).key)
                client.ttl('string key', writeTTL);
            } else {
                clearTimeout(myTimer);
                console.log('I expired');
                client.quit();
            }
        });
    }, 1000);
}

function writeTTL(err, data) {
    console.log('I live for this long yet: ' + data);
}
