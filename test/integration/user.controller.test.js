const chai = require("chai");
const chaiHttp = require("chai-http");
let server = require("../../index");
let database = [];

chai.should();
chai.use(chaiHttp);

describe("Manage users", () => {
	describe("UC-201 add user /api/user", () => {
		beforeEach((done) => {
			database = [];
			done();
		});

		it("When a required input is missing, a valid error should be returned", (done) => {
			chai
				.request(server)
				.post("/api/user")
				.send({
					//name: "Daan van der Meulen",
					emailAdress: "daanvdm@hotmail.com",
				})
				.end((err, res) => {
					res.should.be.an("object");
					let { status, result } = res.body;
					status.should.equals(400);
					result.should.be
						.a("string")
						.that.equals("Name must be a string!");
					done();
				})
		})
	})
})