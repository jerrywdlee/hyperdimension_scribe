var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'hyper_scribe',
  password : 'hyper_scribe',
  database : 'hyper_scribe'
});

pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});
