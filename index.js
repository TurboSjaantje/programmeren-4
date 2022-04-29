const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const userRouter = require('./src/routes/user.routes');

//Log all requests
app.all('*', (req, res, next) => {
	const method = req.method;
	console.log(`method ${method} aangeroepen`);
	next();
});

//All valid routes
app.use(userRouter);

//All unvalid routes
app.all('*', (req, res) => {
	res.status(404).json({
		status: 404,
		result: 'end-point not found',
	});
});

//Error Handling
app.use((err, req, res, next) => {
	res.status(err.status).json(err);
});

//Start server
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
