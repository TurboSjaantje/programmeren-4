
# Share-a-meal API 





[![Deploy to Heroku](https://github.com/TurboSjaantje/programmeren-4/actions/workflows/main.yml/badge.svg)](https://github.com/TurboSjaantje/programmeren-4/actions/workflows/main.yml)
## Description

The share-a-meal api is a project created to support an android application.
Within this android application users would be able to make meals available to the public.
Different users would be able to register for these meals and take them home to eat or eat them at the spot.

This API is a big part of the brain behind this operation.
It is made so any device can retrieve data from the online database via http-request. To keep all the data safe this is done with JavaWebtokens. 
This keeps the data secure and provides login functionality to the application.




## Authors

- [@TurboSjaantje](https://www.github.com/TurboSjaantje)


## API Reference

[Share A Meal API](https://test-applicatie.herokuapp.com/)

### Authentication

#### Get login token

```http
  POST /auth/login
```

```json
{
    "emailAdress":"email",
    "password":"secret"
}
```


### User

#### Get all 

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

