var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 20,
  host     : 'localhost',
  user     : 'hyper_scribe',
  password : 'hyper_scribe',
  database : 'hyper_scribe'
});

var sql = require(__dirname+'/my_modules/sql_lib/sql_create_table.js')
//var sql_array = []

/*
setTimeout(function () {
  create_table(sql.admin_users,sql.auths)
}, 1000);
setTimeout(function () {
  create_table(sql.media,sql.items)
}, 2000);

setTimeout(function () {
  create_table(sql.scenarios,sql.view_histories)
  create_table(sql.conversion_histories,'SELECT 1 + 1 AS solution')
}, 3000);
*/

for (var i in sql) {
  create_table(sql[i])
}

function create_table(sql) {
  pool.getConnection(function(err, connection) {
    connection.query(sql,function (err, result) {
      if (err) {
        throw err;
      }
      console.log('success! '+result);
      connection.release();
    })
  })
}

/*
function create_table(sql_1,sql_2) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    var rollback = function () {
      connection.rollback(function() {
        throw err;
        connection.release();
      });
    }
    connection.beginTransaction(function(err) {
      if (err) { throw err; }
      connection.query(sql_1,  function(err, result) {
        if (err) {
          return rollback();
        }
        connection.query(sql_2, function(err, result) {
          if (err) {
            return rollback();
          }
          connection.commit(function(err) {
            if (err) {
              return rollback();
            }
            console.log('success!');
            connection.release();
          });
        });
      });
    });
  });
}
*/
