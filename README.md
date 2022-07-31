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
- [CI/CD](#cicd)
- [Testing](#testing)

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

#### Method types
**These are the events that the client side will be listening for:**

- game-created  

`game-created` event is a server response when a player creates a new game.  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-created",
    ...game,
}
```  
Where a game object consists of:  

```javascript
let game = {
    gameId: new Date().valueOf(),
    createdBy: message.userID,
    player1: message.userID,
    player1Name: message.userName,
    player2: undefined,
    player2Name: undefined,
    player1Socket: socket.id,
    player2Socket: undefined,
    player1Symbol: "x",
    player2Symbol: "o",
    player1Score: 0,
    player2Score: 0,
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurn: message.userID,
    historyChat: [],
};
```  
After that the client will update the board information accordingly and set the game ID state.  
<br><br>

- game-reset  

`game-reset` event is a server response when a player press the reset game button after a game is ended.  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-reset",
    ...game,
}
```  
**An example of a game object keys and values can be checked on the above method game-created.**
  
After that the client will update the board information accordingly.  

<br><br>

- game-joined 

`game-joined` event is a server response when a player joins a game.  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-joined",
    gameId: message.gameId,
    other: matches[indexMatch].player1Name,
}
```  
In this case, other can be undefined if the player was the first one to join a game and is currently waiting for a opponent to join.  
After that the client will update the player cards information accordingly and set the gameID state.  

<br><br>

- game-over-error

`game-over-error` event is a server response when a player makes a move when the game is already over.  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-over-error",
    message: "Game is over",
}
```  
After that the client will update the error message with the message sent by the server ("Game is over").  

<br><br>

- invalid-turn  

`invalid-turn` event is a server response when a player makes a move but not in his/her turn.  
The response body expected by the client is as follows:

```javascript 
{
    method: "invalid-turn",
    message: "It's not your turn",
    board,
}
```  
After that the client updates the error message with the message sent by the server ("It's not your turn").  
<br><br>

- invalid-position  

`invalid-position` event is a server response when a player makes a move that is no allowed (taking a filled space for example).  
The response body expected by the client is as follows:

```javascript 
{
    method: "invalid-position",
    message: result,
    board,
}
```  
After that the client updates the error message with the message sent by the server ("Position already taken").  

<br><br>
  

- game-over  

`game-over` event is a server response when a player has won the game (the result is checked after a `move-made` event is made).  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-over",
    message: winnerMessage,
    ...payload,
    player1Score: matches[indexMatch].player1Score,
    player2Score: matches[indexMatch].player2Score,
}
``` 

Where a payload consists of:  

```javascript
let payload = {
    gameId,
    player1Name,
    player1,
    player2Name,
    player2,
};
```
After that the client:
- Updates the game status message ("You win" or "You Lose") with the message sent by the server. 
- Updates the players scoreboard.
- Posts the match information to the database  

<br><br>
- move-made

`move-made` event is a server response when a player makes an allowed move.  
The response body expected by the client is as follows:

```javascript 
{
    method: "move-made",
    message: result,
    board,
    player1Score,
    player2Score,
}
```  
After that the client will update the board and update players scores if there was any change.  

<br><br>

- game-not-found  

`game-not-found` event is a server response when a player tries to join a game with an nonexistent game ID.  
The response body expected by the client is as follows:

```javascript 
{
    method: "game-not-found",
    errorMessage: "Game not found",
}
```  
After that the client will update the error message with the message sent by the server ("Game not found").  

<br><br>

- match-full

`game-not-found` event is a server response when a player tries to join a game that already have 2 players connected.  
The response body expected by the client is as follows:

```javascript 
{
    method: "match-full",
    errorMessage: "Match is full",
}
```  
After that the client will update the error message with the message sent by the server ("Match is full").  

<br><br>

{
          method: "player-joined",
          message: message.userName,
        }
          
- player-joined  

`player-joined` event is a server response when a player joins a game that already exists (currently have another player in the room).  
The response body expected by the client is as follows:

```javascript 
{
    method: "player-joined",
    message: message.userName,
}
```  
After that the client will set the opponent information to message.userName and update player cards accordingly.  
<br><br>  


#### message-chat event

##### Method types

- update-chat  

`update-chat` event is a server response when a player sends a message in the chatbox.  
The response body expected by the client is as follows:

```javascript 
{
    method: "update-chat",
    historyChat,
}
```  
After that the client will update the chat messages by using the historyChat (that contains all messages sent).  
Messages are also sent when a player joins a game, informing that an user has connected to that game room.  
<br><br>  

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
  


## Testing

### Postman

Each [Tic Tac Toe API](#tic-tac-toe-api) is tested through postman tests. Each API is tested against the following : -  
- HTTP status code
- Response payload' type
- Returned values and keys, and
- Data type of values
