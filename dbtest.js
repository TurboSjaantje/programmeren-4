const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'shareameal',
});

connection.connect();

connection.query(
	'SELECT name, id FROM meal;',
	function (error, results, fields) {
		if (error) throw error;
		for (let i = 0; i < results.length; i++)
			console.log(results[i].name + ' - ' + results[i].id);
	}
);

connection.end();
