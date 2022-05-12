process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
require('dotenv').config();
const dbconnection = require('../../database/dbconnection');

chai.should();
chai.use(chaiHttp);

// Clearing query's
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
const CLEAR_DB =
	CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

//INSERT USER
const INSERT_USER =
	'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `phoneNumber`, `street`, `city` ) VALUES' +
	'(1, "first", "last", "name@server.nl", "Password1!", "0000000000", "street", "city");';
const INSERT_USER2 =
	'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `phoneNumber`, `street`, `city` ) VALUES' +
	'(2, "second", "secondlast", "secondname@server.nl", "Password1!", "0000000000", "secondstreet", "secondcity");';

describe('CRUD Users /api/user', () => {
	describe('UC-201 Register New User', () => {
		beforeEach((done) => {
			console.log('beforeEach called');
			// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err; // not connected!

				// Use the connection
				connection.query(
					CLEAR_DB + INSERT_USER,
					function (error, results, fields) {
						// When done with the connection, release it.
						connection.release();

						// Handle error after the release.
						if (error) throw error;
						// Let op dat je done() pas aanroept als de query callback eindigt!
						console.log('beforeEach done');
						done();
					}
				);
			});
		});

		it('TC-201-1 Required field is missing /api/user', (done) => {
			chai.request(server)
				.post('/api/user')
				.send({
					lastName: 'Henk',
					street: 'Meulenbroek 21',
					city: 'Bleskensgraaf',
					password: 'JeMoeder4!',
					emailAdress: 'daanvdm@hotmail.com',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals('First Name cannot be null!');
					done();
				});
		});

		it('TC 201-2 Non-valid emailAdress /api/user', (done) => {
			chai.request(server)
				.post('/api/user')
				.send({
					firstName: 'Ingrid',
					lastName: 'Henk',
					street: 'Meulenbroek 21',
					city: 'Bleskensgraaf',
					password: 'JeMoeder4!',
					emailAdress: 'daanvdmhotmail.com',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals('Invalid emailadres');
					done();
				});
		});

		it('TC 201-3 Non-valid password /api/user', (done) => {
			chai.request(server)
				.post('/api/user')
				.send({
					firstName: 'Ingrid',
					lastName: 'Henk',
					street: 'Meulenbroek 21',
					city: 'Bleskensgraaf',
					password: 'hoi',
					emailAdress: 'daanvdm@hotmail.com',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals(
							'Password must contain 8-15 characters which contains at least one lower- and uppercase letter, one special character and one digit'
						);
					done();
				});
		});

		it('TC 201-4 User already exists /api/user', (done) => {
			chai.request(server)
				.post('/api/user')
				.send({
					firstName: 'first',
					lastName: 'last',
					isActive: 1,
					emailAdress: 'name@server.nl',
					password: 'Password1!',
					phoneNumber: '0631490687',
					roles: 'editor,guest',
					street: 'street',
					city: 'city',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(409);
					message.should.be
						.a('string')
						.that.equals(
							'The email-address: name@server.nl has already been taken!'
						);
					done();
				});
		});

		//did not implement tokens
		it('TC 201-5 User added succesfully /api/user', (done) => {
			chai.request(server)
				.post('/api/user')
				.send({
					firstName: 'Daan',
					lastName: 'van der Meulen',
					isActive: 1,
					emailAdress: 'daanvdm@hotmail.com',
					password: 'JeMoeder4!',
					phoneNumber: '0631490687',
					roles: 'editor,guest',
					street: 'Meulenbroek',
					city: 'Bleksensgraaf',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(201);
					message.should.be
						.a('string')
						.that.equals('User has been succesfully registered');
					done();
				});
		});
	});

	describe('UC-202 User Overview /api/user', () => {
		//created two seperate describes so i could test on an empty db
		describe('UC-202-1 Show 0 users/api/user', () => {
			beforeEach((done) => {
				console.log('beforeEach called');
				// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
				dbconnection.getConnection(function (err, connection) {
					if (err) throw err; // not connected!

					// Use the connection
					connection.query(
						CLEAR_DB,
						function (error, results, fields) {
							// When done with the connection, release it.
							connection.release();

							// Handle error after the release.
							if (error) throw error;
							// Let op dat je done() pas aanroept als de query callback eindigt!
							console.log('beforeEach done');
							done();
						}
					);
				});
			});

			it('TC-202-2 Show 2 users /api/user', (done) => {
				chai.request(server)
					.get('/api/user')
					.end((err, res) => {
						res.should.be.an('object');
						let { status, result } = res.body;
						status.should.equals(200);
						assert.deepEqual(result, []);
						done();
					});
			});
		});

		describe('UC-202-2 Show 2 users/api/user', () => {
			beforeEach((done) => {
				console.log('beforeEach called');
				// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
				dbconnection.getConnection(function (err, connection) {
					if (err) throw err; // not connected!

					// Use the connection
					connection.query(
						CLEAR_DB + INSERT_USER + INSERT_USER2,
						function (error, results, fields) {
							// When done with the connection, release it.
							connection.release();

							// Handle error after the release.
							if (error) throw error;
							// Let op dat je done() pas aanroept als de query callback eindigt!
							console.log('beforeEach done');
							done();
						}
					);
				});
			});

			it('TC-202-2 Show 2 users /api/user', (done) => {
				chai.request(server)
					.get('/api/user')
					.end((err, res) => {
						res.should.be.an('object');
						let { status, result } = res.body;
						status.should.equals(200);
						assert.deepEqual(result, [
							{
								id: 1,
								firstName: 'first',
								lastName: 'last',
								isActive: 1,
								emailAdress: 'name@server.nl',
								password: 'Password1!',
								phoneNumber: '0000000000',
								roles: 'editor,guest',
								street: 'street',
								city: 'city',
							},
							{
								id: 2,
								firstName: 'second',
								lastName: 'secondlast',
								isActive: 1,
								emailAdress: 'secondname@server.nl',
								password: 'Password1!',
								phoneNumber: '0000000000',
								roles: 'editor,guest',
								street: 'secondstreet',
								city: 'secondcity',
							},
						]);
						done();
					});
			});
		});

		//did not implement the searchterm functionality since it was not neede in swagger.ui
	});

	describe('UC-203 Get User Profile /api/user', () => {
		beforeEach((done) => {
			console.log('beforeEach called');
			// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err; // not connected!

				// Use the connection
				connection.query(
					CLEAR_DB + INSERT_USER,
					function (error, results, fields) {
						// When done with the connection, release it.
						connection.release();

						// Handle error after the release.
						if (error) throw error;
						// Let op dat je done() pas aanroept als de query callback eindigt!
						console.log('beforeEach done');
						done();
					}
				);
			});
		});

		//not implemented because token functionality was not required
	});

	describe('UC-204 Get User Details /api/user/?:id', () => {
		beforeEach((done) => {
			console.log('beforeEach called');
			// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err; // not connected!

				// Use the connection
				connection.query(
					CLEAR_DB + INSERT_USER,
					function (error, results, fields) {
						// When done with the connection, release it.
						connection.release();

						// Handle error after the release.
						if (error) throw error;
						// Let op dat je done() pas aanroept als de query callback eindigt!
						console.log('beforeEach done');
						done();
					}
				);
			});
		});

		//not implemented because token functionality was not required yet
		// xit('TC-204-1 Invalid token /api/user', (done) => {});

		it('TC-204-2 Invalid userId /api/user', (done) => {
			chai.request(server)
				.get('/api/user/2')
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(404);
					message.should.be
						.a('string')
						.that.equals('User with ID 2 not found');
					done();
				});
		});

		it('TC-204-3 Valid userId, get one user back /api/user', (done) => {
			chai.request(server)
				.get('/api/user/1')
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(200);
					assert.deepEqual(message, {
						id: 1,
						firstName: 'first',
						lastName: 'last',
						isActive: 1,
						emailAdress: 'name@server.nl',
						password: 'Password1!',
						phoneNumber: '0000000000',
						roles: 'editor,guest',
						street: 'street',
						city: 'city',
					});
					done();
				});
		});
	});

	describe('UC-205 Edit User Details /api/user', () => {
		beforeEach((done) => {
			console.log('beforeEach called');
			// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err; // not connected!

				// Use the connection
				connection.query(
					CLEAR_DB + INSERT_USER,
					function (error, results, fields) {
						// When done with the connection, release it.
						connection.release();

						// Handle error after the release.
						if (error) throw error;
						// Let op dat je done() pas aanroept als de query callback eindigt!
						console.log('beforeEach done');
						done();
					}
				);
			});
		});

		it('TC-205-1 Email missing /api/user', (done) => {
			chai.request(server)
				.put('/api/user/1')
				.send({
					firstName: 'Daan',
					lastName: 'van der Meulen',
					isActive: 1,
					password: 'JeMoeder4!',
					phoneNumber: '0631490687',
					roles: 'editor,guest',
					street: 'Meulenbroek',
					city: 'Bleksensgraaf',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals('emailAdress cannot be null!');
					done();
				});
		});

		it('TC-205-3 Invalid phoneNumber /api/user', (done) => {
			chai.request(server)
				.put('/api/user/1')
				.send({
					firstName: 'Daan',
					lastName: 'van der Meulen',
					isActive: 1,
					emailAdress: 'daanvdm@hotmail.com',
					password: 'JeMoeder4!',
					phoneNumber: '631490687',
					roles: 'editor,guest',
					street: 'Meulenbroek',
					city: 'Bleksensgraaf',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals('Phonenumber should be 10 digits');
					done();
				});
		});

		it('TC-205-4 User does not exist /api/user', (done) => {
			chai.request(server)
				.put('/api/user/2')
				.send({
					firstName: 'Daan',
					lastName: 'van der Meulen',
					isActive: 1,
					emailAdress: 'daanvdm@hotmail.com',
					password: 'JeMoeder4!',
					phoneNumber: '0631490687',
					roles: 'editor,guest',
					street: 'Meulenbroek',
					city: 'Bleksensgraaf',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(400);
					result.should.be
						.a('string')
						.that.equals(
							'Update failed, user with ID 2 does not exist'
						);
					done();
				});
		});

		//Could not implement this one yet becuase token functionality was not yet required
		// xit('TC-205-5 User not signed in /api/user', (done) => {});

		it('TC-205-6 User succesfully edited /api/user', (done) => {
			chai.request(server)
				.put('/api/user/1')
				.send({
					firstName: 'Daan',
					lastName: 'van der Meulen',
					isActive: 1,
					emailAdress: 'daanvdm@hotmail.com',
					password: 'JeMoeder4!',
					phoneNumber: '0631490687',
					roles: 'editor,guest',
					street: 'Meulenbroek',
					city: 'Bleksensgraaf',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(200);
					assert.deepEqual(result, {
						id: 1,
						firstName: 'Daan',
						lastName: 'van der Meulen',
						isActive: 1,
						emailAdress: 'daanvdm@hotmail.com',
						password: 'JeMoeder4!',
						phoneNumber: '0631490687',
						roles: 'editor,guest',
						street: 'Meulenbroek',
						city: 'Bleksensgraaf',
					});
					done();
				});
		});
	});

	describe('UC-206 Delete User', () => {
		beforeEach((done) => {
			console.log('beforeEach called');
			// maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err; // not connected!

				// Use the connection
				connection.query(
					CLEAR_DB + INSERT_USER,
					function (error, results, fields) {
						// When done with the connection, release it.
						connection.release();

						// Handle error after the release.
						if (error) throw error;
						// Let op dat je done() pas aanroept als de query callback eindigt!
						console.log('beforeEach done');
						done();
					}
				);
			});
		});

		it('TC-206-1 User does not exist /api/user', (done) => {
			chai.request(server)
				.delete('/api/user/2')
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(400);
					result.should.be
						.a('string')
						.that.equals('User was not found!');
					done();
				});
		});

		//not implemented because token functionality was not required yet
		// xit('TC-206-2 Not logged in /api/user', (done) => {});

		//not implemented because token functionality was not required yet
		// xit('TC-206-3 Actor is not owner /api/user', (done) => {});

		it('TC-206-3 User deleted succesfully /api/user', (done) => {
			chai.request(server)
				.delete('/api/user/1')
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(200);
					result.should.be
						.a('string')
						.that.equals('User with ID 1 deleted successfuly!');
					done();
				});
		});
	});
});
