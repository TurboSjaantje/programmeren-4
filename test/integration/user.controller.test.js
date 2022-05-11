process.env.DB_DATABASE = process.env.DB_DATABASE || "share-a-meal-testdb";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const assert = require("assert");
require("dotenv").config();
const dbconnection = require("../../database/dbconnection");

chai.should();
chai.use(chaiHttp);

describe("UC-201 Register New User", () => {
    beforeEach((done) => {
        dbconnection.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query("DELETE FROM User;", (error, result, field) => {
                connection.query(
                    "ALTER TABLE user AUTO_INCREMENT = 1;",
                    (error, result, field) => {
                        connection.query(
                            "INSERT INTO user (firstName, lastName, street, city, isActive, emailAdress, password, phoneNumber) VALUES(?, ?, ?, ?, ?, ?, ?, ?);",
                            [
                                "Herman",
                                "Huizinga",
                                1,
                                "h.huizinga@server.nl",
                                "JeMoeder4!",
                                "0631490687",
                                "editor,guest",
                                "hoi",
                                "hoi",
                            ],
                            (error, result, field) => {
                                connection.release();
                                done();
                            }
                        );
                    }
                );
            });
        });
    });

    it("TC-201-1 Required field is missing /api/user", (done) => {
        chai.request(server)
            .post("/api/user")
            .send({
                lastName: "Henk",
                street: "Meulenbroek 21",
                city: "Bleskensgraaf",
                password: "JeMoeder4!",
                emailAdress: "daanvdm@hotmail.com",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                    .a("string")
                    .that.equals("First Name cannot be null!");
                done();
            });
    });

    it("TC 201-2 Non-valid emailAdress /api/user", (done) => {
        chai.request(server)
            .post("/api/user")
            .send({
                firstName: "Ingrid",
                lastName: "Henk",
                street: "Meulenbroek 21",
                city: "Bleskensgraaf",
                password: "JeMoeder4!",
                emailAdress: "daanvdmhotmail.com",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a("string").that.equals("Invalid emailadres");
                done();
            });
    });

    it("TC 201-3 Non-valid password /api/user", (done) => {
        chai.request(server)
            .post("/api/user")
            .send({
                firstName: "Ingrid",
                lastName: "Henk",
                street: "Meulenbroek 21",
                city: "Bleskensgraaf",
                password: "hoi",
                emailAdress: "daanvdm@hotmail.com",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                    .a("string")
                    .that.equals(
                        "Password must contain 8-15 characters which contains at least one lower- and uppercase letter, one special character and one digit"
                    );
                done();
            });
    });

    it("TC 201-4 User already exists /api/user", (done) => {
        chai.request(server)
            .post("/api/user")
            .send({
                firstName: "Herman",
                lastName: "Huizinga",
                isActive: 1,
                emailAdress: "h.huizinga@server.nl",
                password: "JeMoeder4!",
                phoneNumber: "0631490687",
                roles: "editor,guest",
                street: "hoi",
                city: "hoi",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(409);
                result.should.be
                    .a("string")
                    .that.equals(
                        "The email-address: h.huizinga@server.nl has already been taken!"
                    );
                done();
            });
    });

    it("TC 201-5 User added succesfully /api/user", (done) => {
        chai.request(server)
            .post("/api/user")
            .send({
                firstName: "Herman",
                lastName: "Huizinga",
                isActive: 1,
                emailAdress: "r.vandermullen@student.avans.nl",
                password: "JeMoeder4!",
                phoneNumber: "0631490687",
                roles: "editor,guest",
                street: "hoi",
                city: "hoi",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(201);
                result.should.be
                    .a("string")
                    .that.equals("User has been succesfully registered");
                done();
            });
    });
});
