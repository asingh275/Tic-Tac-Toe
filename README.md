# Tic-Tac-Toe

## Description
A web application where you can play tic-tac-toe with your friends!  
While playing you can chat with your opponent and enjoy game even more!!

### Docker Image!
https://hub.docker.com/repository/docker/asingh275/tic-tac-toe

### Website Link
https://cpsc2650-tic-tac-toe.herokuapp.com/

## Start Playing in simple steps!
- Login with you Github or Google account
- Create Game (*If you don't have Game ID to join with your friend*)
    - Share Game ID with your friend
        - You can use email feature of this application where you input your friend's email and send Game ID through email\
    - Wait for them to join
    - Play!
- Join Game (*If you have Game ID*)
    - Play!

## Features
- Easy login with Google or Github account
- Send email to share Game ID
- Chat while playing
- Aesthetic design
- Quick responses


# Documentation

- [Tic Tac Toe App Server Side](#tic-tac-toe-app---server-side)
- [Tic Tac Toe App Client Side](#tic-tac-toe-app---client-side)
- [Tic Tac Toe API](#tic-tac-toe-api)

## Tic Tac Toe App - Server Side
    
### HTTP Server Structure

### WS Server Structure

### WS Events

#### message event

##### Method types

- create-game
- reset-game
- join-game
- exit-game
- make-move

#### message-chat event

##### Method types

- send-message

## Tic Tac Toe App - Client Side

### WS Events

#### message event

##### Method types

- game-created
- game-reset
- game-joined
- game-exited
- game-over-error
- invalid-turn
- invalid-position
- game-over
- move-made
- game-not-found
- match-full
- player-joined


#### message-chat event

##### Method types

- update-chat

## Tic Tac Toe API

### How to make API request

`BaseURL`: `https://cpsc2650-tic-tac-toe.herokuapp.com/api/v1/`

### Match Endpoint

#### Get all matches

`GET`: `/api/v1/match`

Expected result

```js
{
    url: "/api/v1/match",
    data: [
        "12345678987654321",
        "98765432123456789",
        "12345678912345678",
    ]
}
```

#### Get match by id

`GET`: `/api/v1/match/id`

Expected result

```js
{
    url: "/api/v1/match/12345678987654321",
    data: {
        gameID: 12345678987654321,
        player1Name: "John Smith",
        player1ID: "123456789",
        player1Wins: 1,
        player2Name: "Jane Doe",
        player2ID: "987654321",
        player2Wins: 0
    }
}
```

#### Add new match to database

`POST`: `/api/v1/match`

Expected body

```js
{
    player1Name: "John Smith",
    player1ID: "123456789",
    player2Name: "Jane Doe",
    player2ID: "987654321",
    player1Wins: 0,
    player2Wins: 0,
    gameID: "12345678987654321",

}
```

### User Endpoint

#### Get user by id

`GET`: `/api/v1/user/id`

Expected result

```js
{
    url: "/api/v1/user/123456789",
    data: {
        email: "test@example.com",
        profile_picture: "https://example.com/image.png",
        username: "John Smith"
    }
}
```

#### Add new user to database

`POST`: `/api/v1/user`

Expected body

```js
{
  userId: "123456789",
  name: "John Smith",,
  email: "test@example.com",
  imageUrl: "https://example.com/image.png",
}
```

Expected result

```js
{
    url: `/api/v1/user/123456789`,
    data: {
    userId: "123456789",
    name: "John Smith",,
    email: "test@example.com",
    imageUrl: "https://example.com/image.png",
    },
}
```

### Email Endpoint

`POST`: `/api/v1/email`

Expected body

```js
{
  to: "test@example.com",
  gameID: "12345678987654321",
  userName: "John Smith",
}
```

Expected result

```js
{
    message: "Email sent successfully",
    from: "asingh275@mylangara.ca",
    to: "test@example.com",
}
```

## CI/CD

### Github Actions
Every push to main branch goes through : -  
- **Postman Tests**  
        Postman test cases test the new code against all the [APIs'](#tic-tac-toe-api)
- **Docker Build**  
        This application is containerized efficiently and pushed to Docker Hub (By efficiently means by using cache)
        
### Heroku
Added Github as Deployment method through which,
every push to main will deploy a new version of this app. Deploys are done automatically by Heroku.
