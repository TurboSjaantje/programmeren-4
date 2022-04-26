const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const userRouter = require("./src/routes/user.routes");

//Log all requests
app.all("*", (req, res, next) => {
	const method = req.method;
	console.log(`method ${method} aangeroepen`);
	next();
});

//All valid routes, 200
app.use(userRouter);

//All unvalid routes, 404
app.all("*", (req, res) => {
	res.status(404).json({
		status: 404,
		result: "end-point not found",
	});
});

//Start server
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
