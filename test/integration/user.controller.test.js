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
                                "Daan",
                                "van der Meulen",
                                "Kievitstraat 22",
                                "Bleskensgraaf",
                                1,
                                "daanvdm@hotmail.com",
                                "DitIsEenGoedeGrap4!",
                                "06 31490687",
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
                city: "Giessenburg",
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
                firstName: "Daan",
                lastName: "Rietveld",
                street: "Van Wenastraat 31",
                city: "Giessenburg",
                password: "wvqOertE5!",
                emailAdress: "chevygmail.com",
            })
            .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be.a("string").that.equals("Invalid emailadres");
                done();
            });
    });
});
