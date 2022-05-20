process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';
process.env.LOGLEVEL = 'warn';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
require('dotenv').config();
const dbconnection = require('../../database/dbconnection');
const jwt = require('jsonwebtoken');
const { jwtSecretKey, logger } = require('../../src/config/config');

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

//INSERT MEAL
const INSERT_MEAL = `INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, name, description) VALUES (1, 1, 1, 1, 1, '2022-05-20 06:36:27', 6, 6.75, 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg', 1, 'Spaghetti Bolognese', 'Dé pastaklassieker bij uitstek.')`;
const INSERT_MEAL2 = `INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, name, description) VALUES (2, 0, 0, 0, 0, '2022-06-20 06:36:27', 7, 7.75, 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg', 2, 'Spaghetti Bolognese 2', 'Dé pastaklassieker bij uitstek 2.')`;

describe('CRUD Meals /api/meal', () => {
	describe('UC-301 Register Meal', () => {
		beforeEach((done) => {
			logger.debug('beforeEach called');
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err;
				connection.query(
					'ALTER TABLE meal AUTO_INCREMENT = 1;',
					(error, result, field) => {
						connection.query(
							'ALTER TABLE user AUTO_INCREMENT = 1;',
							function (error, result, fields) {
								connection.query(
									CLEAR_DB + INSERT_USER + INSERT_MEAL,
									function (error, results, fields) {
										connection.release();
										if (error) throw error;
										logger.debug('beforeEach done');
										done();
									}
								);
							}
						);
					}
				);
			});
		});

		it('TC-301-1 Required field missing', (done) => {
			chai.request(server)
				.post('/api/meal')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey)
				)
				.send({
					maxAmountOfParticipants: 4,
					price: 12.75,
					imageUrl:
						'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
					name: 'Je Dikke Moeder',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals('Description should be a string!');
					done();
				});
		});

		it('TC-301-2 Not logged in', (done) => {
			chai.request(server)
				.post('/api/meal')
				.send({
					maxAmountOfParticipants: 4,
					price: 12.75,
					imageUrl:
						'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
					name: 'Je Dikke Moeder',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(401);
					message.should.be
						.a('string')
						.that.equals('Authorization header missing!');
					done();
				});
		});

		it('TC-301-3 Meal added succesfully', (done) => {
			chai.request(server)
				.post('/api/meal')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
				)
				.send({
					dateTime: '2022-03-22 16:35:00',
					maxAmountOfParticipants: 4,
					price: 12.75,
					imageUrl:
						'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
					name: 'Pasta Bolognese met tomaat, spekjes en kaas',
					description:
						'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
					isActive: 1,
					isVega: 0,
					isVegan: 0,
					isToTakeHome: 1,
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(201);
					console.log(result.cookId);
					assert.deepEqual(result, {
						id: 2,
						isActive: 1,
						isVega: 0,
						isVegan: 0,
						isToTakeHome: 1,
						dateTime: result.dateTime,
						maxAmountOfParticipants: 4,
						price: '12.75',
						imageUrl:
							'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
						cookId: 1,
						createDate: result.createDate,
						updateDate: result.updateDate,
						name: 'Pasta Bolognese met tomaat, spekjes en kaas',
						description:
							'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
						allergenes: '',
					});
					done();
				});
		});
	});

	describe('UC-301 Register Meal', () => {
		beforeEach((done) => {
			logger.debug('beforeEach called');
			dbconnection.getConnection(function (err, connection) {
				if (err) throw err;
				connection.query(
					'ALTER TABLE meal AUTO_INCREMENT = 1;',
					(error, result, field) => {
						connection.query(
							'ALTER TABLE user AUTO_INCREMENT = 1;',
							function (error, result, fields) {
								connection.query(
									CLEAR_DB +
										INSERT_USER +
										INSERT_USER2 +
										INSERT_MEAL,
									function (error, results, fields) {
										connection.release();
										if (error) throw error;
										logger.debug('beforeEach done');
										done();
									}
								);
							}
						);
					}
				);
			});
		});

		it('TC-302-1 Required field missing', (done) => {
			chai.request(server)
				.put('/api/meal/1')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
				)
				.send({
					price: 69.69,
					name: 'Een leuke test',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(400);
					message.should.be
						.a('string')
						.that.equals(
							'maxAmountofParticipants should be a number'
						);
					done();
				});
		});

		it('TC-302-2 Not logged in', (done) => {
			chai.request(server)
				.put('/api/meal/1')
				.send({
					maxAmountOfParticipants: 3,
					price: 69.69,
					name: 'Een leuke test',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(401);
					message.should.be
						.a('string')
						.that.equals('Authorization header missing!');
					done();
				});
		});

		it('TC-302-3 Not the meal owner', (done) => {
			chai.request(server)
				.put('/api/meal/1')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ userId: 2 }, jwtSecretKey)
				)
				.send({
					maxAmountOfParticipants: 3,
					price: 69.69,
					name: 'Een leuke test',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(403);
					message.should.be
						.a('string')
						.that.equals(
							'User is not the owner of the meal that is being requested to be deleted or updated'
						);
					done();
				});
		});

		it('TC-302-4 Meal does not exist', (done) => {
			chai.request(server)
				.put('/api/meal/999')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
				)
				.send({
					maxAmountOfParticipants: 3,
					price: 69.69,
					name: 'Een leuke test',
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, message } = res.body;
					status.should.equals(401);
					message.should.be
						.a('string')
						.that.equals('Meal with ID 999 not found');
					done();
				});
		});

		it('TC-302-5 Meal updated succesfully', (done) => {
			chai.request(server)
				.put('/api/meal/1')
				.set(
					'authorization',
					'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey)
				)
				.send({
					dateTime: '2022-03-22 16:35:00',
					maxAmountOfParticipants: 4,
					price: 13.75,
					imageUrl:
						'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
					cookId: 1,
					name: 'Pasta Bolognese met tomaat, spekjes en kaas',
					description:
						'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
					isActive: 1,
					isVega: 0,
					isVegan: 0,
					isToTakeHome: 1,
					allergenes: ['noten'],
				})
				.end((err, res) => {
					res.should.be.an('object');
					let { status, result } = res.body;
					status.should.equals(201);
					assert.deepEqual(result, {
						allergenes: 'noten',
						cookId: 1,
						createDate: result.createDate,
						dateTime: null,
						description:
							'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
						id: 1,
						imageUrl:
							'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
						isActive: 1,
						isToTakeHome: 1,
						isVega: 0,
						isVegan: 0,
						maxAmountOfParticipants: 4,
						name: 'Pasta Bolognese met tomaat, spekjes en kaas',
						price: '13.75',
						updateDate: result.updateDate,
					});
					done();
				});
		});
	});
});
