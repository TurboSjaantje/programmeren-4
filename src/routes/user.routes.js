const express = require('express')
const router = express.Router()

let database = [];
let id = 0

router.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Welcome to Share-a-meal API",
    });
});

router.post("/api/user", (req, res) => {
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

router.get("/api/user", (req, res, next) => {
    res.status(202).json({
        status: 200,
        result: database
    })
})

router.get("/api/user/:userId", (req, res) => {
    const userId = req.params.userId;
    let user = database.filter((item) => item.id == userId);
    if (user.length > 0) {
        console.log(user);
        res.status(204).json({
            status: 204,
            result: user,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `User with ID: ${userId} not found`,
        });
    }
});

router.get("/api/user/profile", (req, res) => {
    res.status(401).json({
        status: 401,
        result: `Function is not yet implemented!`,
    });
});

router.put("/api/user/:userId", (req, res) => {
    //get updated user
    let user = req.body;
    console.log(user);
    user = {
        id,
        ...user,
    }

    const userId = req.params.userId;
    let users = database.filter((item) => item.id == userId);
    if (users.length != 0) {
        database[database.indexOf(users[0])] = user
        res.status(205).json({
            status: 205,
            result: `User with ID: ${userId} updated succesfully`,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `Use with ID: ${userId} does not exist!`,
        });
    }
});

router.delete("/api/user/:userId", (req, res) => {
    const userId = req.params.userId;
    let users = database.filter((item) => item.id == userId);
    if (users.length != 0) {
        database.splice(database.indexOf(users[0]), 1);
        res.status(206).json({
            status: 206,
            result: `User with ID: ${userId} deleted succesfully`,
        });
    } else {
        res.status(404).json({
            status: 404,
            result: `Use with ID: ${userId} does not exist!`,
        });
    }
});

module.exports = router;