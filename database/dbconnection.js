const mysql = require('mysql');
require('dotenv').config();

var pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

module.exports = pool;

// pool.getConnection(function (err, connection) {
// 	if (err) throw err;

// 	// Use the connection
// 	connection.query(
// 		'SELECT name, id FROM meal;',
// 		function (error, results, fields) {
// 			// When done with the connection, release it.
// 			connection.release();

// 			// Handle error after the release.
// 			if (error) throw error;

// 			// Print the results
// 			console.log(results);

// 			// End the pool
// 			pool.end(function (err) {
// 				// all connections in the pool have ended
// 				console.log('Pool was closed.');
// 			});
// 		}
// 	);
// });

pool.on('acquire', function (connection) {
	console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
	console.log('Connection %d released', connection.threadId);
});
