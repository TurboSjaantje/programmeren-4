const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { restart } = require("nodemon");

app.use(bodyParser.json());

let database = [];
let id = 0;

app.all("*", (req, res, next) => {
    const method = req.method;
    console.log(`method ${method} aangeroepen`);
    next();
});

//simple hello world for empty page
app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello world",
    });
});

//Share A Meal API
//User
app.get("/api/user", (req, res) => {
    res.status(200).json({
        status: 200,
        result: database,
    });
});

app.get("/api/user/:userId", (req, res) => {
    const userId = req.params.userId;
    let user = database.filter((item) => item.id == userId);
    if (user.length > 0) {
        console.log(user);
        res.status(200).json({
            status: 200,
            result: user,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `User with ID: ${userId} not found`,
        });
    }
});

app.post("/api/user", (req, res) => {
    let user = req.body;
    console.log(user);
    user = {
        id,
        ...user,
    };

    id++;

    let email = database.filter(
        (item) => item.emailAdress == user.emailAdress
    );
    if (email != 0) {
        res.status(404).json({
            status: 404,
            result: `The emailaddres: ${user.emailAdress}, has already been used!`,
        });
    } else {
        database.push(user);
        console.log(database);
        res.status(201).json({
            status: 201,
            result: user,
        });
    }
});

app.put("/api/user/:userId", (req,res) => {
    //get updated user
    let user = req.body;
    console.log(user);
    user = {
        id,
        ...user,
    };

    const userId = req.params.userId;
    let users = database.filter((item) => item.id == userId);
    if (users.length != 0) {
        database[database.indexOf(user[0])] = user
        res.status(200).json({
            status: 200,
            result: `User with ID: ${userId} updated succesfully!`,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `Use with ID: ${userId} does not exist!`,
        });
    }
})

app.delete("/api/user/:userId", (req, res) => {
    const userId = req.params.userId;
    let users = database.filter((item) => item.id == userId);
    if (users.length != 0) {
        database.splice(database.indexOf(users[0]), 1);
        res.status(200).json({
            status: 200,
            result: `User with ID: ${userId} deleted succesfully`,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `Use with ID: ${userId} does not exist!`,
        });
    }
});

//User profile
app.get("/api/user/profile", (req, res) => {
    res.status(401).json({
        status: 401,
        result: `Function is not yet implemented!`,
    });
});

app.all("*", (req, res) => {
    res.status(404).json({
        status: 404,
        result: "end-point not found",
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
