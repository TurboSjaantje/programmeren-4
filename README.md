# Share-a-meal API

[![Deploy to Heroku](https://github.com/TurboSjaantje/programmeren-4/actions/workflows/main.yml/badge.svg)](https://github.com/TurboSjaantje/programmeren-4/actions/workflows/main.yml)
[![Hoi](https://www.img.shields.io/github/languages/top/:user/:repo)

## Description

The share-a-meal api is a project created to support an android application.
Within this android application users would be able to make meals available to the public.
Different users would be able to register for these meals and take them home to eat or eat them at the spot.

This API is a big part of the brain behind this operation.
It is made so any device can retrieve data from the online database via http-request. To keep all the data safe this is done with JavaWebtokens.
This keeps the data secure and provides login functionality to the application.

## About me

Creator: [@TurboSjaantje](https://www.github.com/TurboSjaantje)
	- 💻 Informatice Student Avans Breda
	- ☕ Love coffee
	
[![GitHub Streak](http://github-readme-streak-stats.herokuapp.com?user=TurboSjaantje&theme=dark&hide_border=true&date_format=j%20M%5B%20Y%5D)](https://git.io/streak-stats)

## Navigation
- [Installation](#installation)
	- [Run API local](#run-api-local) 	
- [Used libraries](#used-libraries)
- [API Reference](#api-reference)
	- [Authentication](#authentication)
		- [Get login token](#get-login-token) 	
	- [User](#user)
		- [Register](#register)
		- [Get all](#get-all)
		- [Get user by id](#get-user-by-id)
		- [Update user by id](#update-user-by-id)
		- [Delete user by id](#delete-user-by-id)
		- [Get personal user profile](#get-personal-user-profile)
	- [Meal](#meal)	 
		- [Register meal](#register-meal)	
		- [Get meal](#get-meal)
		- [Get meal by id](#get-meal-by-id)
		- [Update meal by id](#update-meal-by-id)
		- [Delete meal by id](#delete-meal-by-id)
		- [Participate in meal](#participate-in-meal)

## Installation 
([Back to top](#share-a-meal-api))	
1. To download this code, fork the repository or download a .zip file.

### Run API local
To run the API local, use the below command:

``` 
npm start
```

## Used libraries
([Back to top](#share-a-meal-api))
A list of the libraries used within this project:
- [chai](https://www.npmjs.com/package/chai)
- [chai-http](https://www.npmjs.com/package/chai-http)
- [mocha](https://www.npmjs.com/package/mocha) 
- [mysql2](https://www.npmjs.com/package/mysql2)
- [express](https://www.npmjs.com/package/express)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [tracer](https://www.npmjs.com/package/tracer) 


## API Reference
([Back to top](#share-a-meal-api))
[Share A Meal API](https://test-applicatie.herokuapp.com/)

### Authentication
------------------------------------------------
#### Get login token
([Back to top](#share-a-meal-api))

```http
  POST /auth/login
```

```json
{
	"emailAdress": "Valid email",
	"password": "String"
}
```

### User
------------------------------------------------
#### Register
([Back to top](#share-a-meal-api))

##### Route
```http
  POST /api/user
```
##### Request
```json
{
	"firstName": "String",
	"lastName": "String",
	"isActive": Number,
	"emailAdress": "Valid email",
	"password": "String",
	"phoneNumber": "Valid phonenumber",
	"street": "String",
	"city": "String"
}
```
##### Response
```json
{
	...user
}
```
------------------------------------------------
#### Get all
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/user
```
##### Request
```json
  Authorization header: bearer token
```
##### Response
```json
  result:[...users]
```
------------------------------------------------
#### Get user by id
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/user/:id
```
##### Request
```json
  Authorization header: bearer token
```
##### Response
```json
  {
  ...user
  }
```
------------------------------------------------
#### Update user by id
([Back to top](#share-a-meal-api))
##### Route
```http
  PUT /api/user/:id
```
##### Request
```json
  Authorization header: bearer token
```
##### Response
```json
  {
  ...updatedUser
  }
```
------------------------------------------------
#### Delete user by id
([Back to top](#share-a-meal-api))
##### Route
```http
  DELETE /api/user/:id
```
##### Request
```json
  Authorization header: bearer token
```
##### Response
```json
  {
  ...deletedUser
  }
```
------------------------------------------------
#### Get personal user profile 
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/user/profile
```
##### Request
```json
  Authorization header: bearer token
```
##### Response
```json
  {
  ...user
  }
```

### Meal
------------------------------------------------
#### Register meal
([Back to top](#share-a-meal-api))

##### Route
```http
  POST /api/meal
```
##### Request
```json
{
	"dateTime" : "yyy-MM-dd hh:mm:ss",
	"maxAmountOfParticipants" : Number,
	"price" : Number,
	"imageUrl" : "String",
	"name": "String",
	"description" : "String",
	"isActive" : Bit,
	"isVega" : Bit,
	"isVegan" : Bit,
	"isToTakeHome" : Bit,
}
```
##### Response
```json
{
	...meal
}
```
------------------------------------------------
#### Get meal
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/meal
```
##### Request
```json
Authorization header: bearer token
```
##### Response
```json
[
	...meals
]
```
------------------------------------------------
#### Get meal by id
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/meal/:id
```
##### Request
```json
Authorization header: bearer token
```
##### Response
```json
{
	...meal
}
```
------------------------------------------------
#### Update meal by id
([Back to top](#share-a-meal-api))
##### Route
```http
  PUT /api/meal/:id
```
##### Request
```json
Authorization header: bearer token
```
##### Response
```json
{
	...updatedMeal
}
```
------------------------------------------------
#### Delete meal by id
([Back to top](#share-a-meal-api))
##### Route
```http
  DELETE /api/meal/:id
```
##### Request
```json
Authorization header: bearer token
```
##### Response
```json
{
	...deletedMeal
}
```
------------------------------------------------
#### Participate in meal
([Back to top](#share-a-meal-api))
##### Route
```http
  GET /api/meal/:mealId/participate
```
##### Request
```json
Authorization header: bearer token
```
##### Response
```json
{
	currentlyParticipating: "Boolean",
	currentAmountOfParticipants: "Number",
}
```


