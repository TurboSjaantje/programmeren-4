const dbconnection = require("../../database/dbconnection");
const assert = require("assert");

// let database = [];
// let id = 0;

let controller = {
    validateUser: (req, res, next) => {
        let user = req.body;

        let { firstName, emailAdress } = user;
        try {
            assert(typeof firstName === "string", "Name must be a string!");
            assert(
                typeof emailAdress === "string",
                "emailAdress must be a string!"
            );
            next();
        } catch (err) {
            const error = { status: 400, result: err.message };
            next(error);
        }
    },
    addUser: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            let user = req.body;
            if (err) throw err;
            connection.query(
                "INSERT INTO user (firstName, lastName, street, city, phoneNumber, emailAdress, password) VALUES(?, ?, ?, ?, ?, ?, ?);",
                [
                    user.firstName,
                    user.lastName,
                    user.street,
                    user.city,
                    user.phoneNumber,
                    user.emailAdress,
                    user.password,
                ],
                function (error, result, fields) {
                    if (error) {
                        connection.release();
                        res.status(409).json({
                            status: 409,
                            result: `The email-address: ${user.emailAdress} has already been taken!`,
                        });
                    } else {
                        connection.release();
                        res.status(201).json({
                            status: 201,
                            result: `User has been succesfully registered`,
                        });
                    }
                }
            );
        });
    },
    getUserFromId: (req, res, next) => {
        const userId = req.params.userId;
        dbconnection.getConnection(function (err, connection) {
            if (err) throw error; //not connected

            //Use the connection
            connection.query(
                "SELECT * FROM User WHERE id = " + userId + "",
                function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error afther the release.
                    if (error) throw error;

                    // Don't use the connection here, it has been returned to the pool.
                    console.log("#results = ", results.length);
                    if (results.length < 1) {
                        const error = {
                            status: 401,
                            result: `User with ID ${userId} not found`,
                        };
                        next(error);
                        return;
                    }
                    res.status(200).json({
                        statusCode: 200,
                        results: results[0],
                    });
                }
            );
        });
    },
    getAllUsers: (req, res, next) => {
        dbconnection.getConnection(function (err, connection) {
            if (err) throw error; //not connected

            //Use the connection
            connection.query(
                "SELECT * from user",
                function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error afther the release.
                    if (error) throw error;

                    // Don't use the connection here, it has been returned to the pool.
                    console.log("#results = ", results.length);
                    res.status(200).json({
                        statusCode: 200,
                        results: results,
                    });
                }
            );
        });
    },
    getUserProfileFromId: (req, res) => {
        res.status(401).json({
            status: 401,
            result: `Function is not yet implemented!`,
        });
    },
    updateUserFromId: (req, res) => {
        const userId = req.params.userId;
        const updateUser = req.body;
        console.log(`User with ID ${userId} requested to be updated`);
        dbconnection.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                "UPDATE user SET firstName=?, lastName=?, isActive=?, emailAdress=?, password=?, phoneNumber=?, street=?, city=? WHERE id = ?;",
                [
                    updateUser.firstName,
                    updateUser.lastName,
                    updateUser.isActive,
                    updateUser.emailAdress,
                    updateUser.password,
                    updateUser.phoneNumber,
                    updateUser.street,
                    updateUser.city,
                    userId,
                ],
                function (error, results, fields) {
                    if (error) {
                        res.status(401).json({
                            status: 401,
                            result: `Email ${user.emailAdress} has already been taken!`,
                        });
                        return;
                    }
                    if (results.affectedRows > 0) {
                        connection.query(
                            "SELECT * FROM user WHERE id = ?;",
                            [userId],
                            function (error, results, fields) {
                                res.status(200).json({
                                    status: 200,
                                    result: results[0],
                                });
                            }
                        );
                    } else {
                        res.status(400).json({
                            status: 400,
                            result: `Update failed, user with ID ${userId} does not exist`,
                        });
                    }
                }
            );
            connection.release();
        });
    },
    deleteUserFromId: (req, res) => {
        const userId = req.params.userId;
        dbconnection.getConnection(function (err, connection) {
            if (err) throw error; //not connected

            //Use the connection
            connection.query(
                "DELETE IGNORE FROM User WHERE Id = " + userId,
                function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error afther the release.
                    if (error) throw error;

                    // Don't use the connection here, it has been returned to the pool.
                    console.log("#results = ", results.length);
                    if (results.affectedRows > 0) {
                        res.status(200).json({
                            status: 200,
                            result: `User with ID ${userId} deleted successfuly!`,
                        });
                    } else {
                        res.status(400).json({
                            status: 400,
                            result: `User with ID:${userId} was not found!`,
                        });
                    }
                }
            );
        });
        // const userId = req.params.userId;
        // let users = database.filter((item) => item.id == userId);
        // if (users.length != 0) {
        //     database.splice(database.indexOf(users[0]), 1);
        //     res.status(206).json({
        //         status: 206,
        //         result: `User with ID: ${userId} deleted succesfully`,
        //     });
        // } else {
        //     res.status(404).json({
        //         status: 404,
        //         result: `Use with ID: ${userId} does not exist!`,
        //     });
        // }
    },
};

module.exports = controller;
