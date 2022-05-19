const express = require('express');
const app = express();

const authRoutes = require('./src/routes/authentication.routes');
const logger = require('./src/config/config').logger;

require('dotenv').config();
const port = process.env.PORT;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const userRouter = require('./src/routes/user.routes');

//Log all requests
app.all('*', (req, res, next) => {
	const method = req.method;
	logger.debug(`Method ${method} is aangeroepen`);
	next();
});

//All valid routes
app.use(userRouter);
app.use(authRoutes);

//All unvalid routes
app.all('*', (req, res) => {
	res.status(404).json({
		status: 404,
		result: 'End-point not found',
	});
});

//Error Handling
app.use((err, req, res, next) => {
	logger.debug('Error handler called.');s
	res.status(err.status).json(err);
});

//Start server
app.listen(port, () => {
	logger.debug(`Example app listening on port ${port}`)
});

//SIGN IN
process.on('SIGINT', () => {
    logger.debug('SIGINT signal received: closing HTTP server')
    dbconnection.end((err) => {
        logger.debug('Database connection closed')
    })
    app.close(() => {
        logger.debug('HTTP server closed')
    })
})

module.exports = app;
