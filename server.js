const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = http.createServer();

// app.listen(app.settings.port, () =>
//   console.log("Listening on", app.settings.port)
// );

server.listen(3001, () => {
  console.log("Server started on port " + server.address().port);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const makeMove = (board, symbol, position) => {
  if (board[position] === "") {
    board[position] = symbol;
    return "Move made sucessfully";
  } else if (board[position] !== "") {
    return "Position already taken";
  }
};

let matches = [];

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    if (message.method === "create-game") {
      let game = {
        gameId: new Date().valueOf(),
        createdBy: message.userID,
        player1: message.userID,
        player2: undefined,
        player1Socket: socket.id,
        player2Socket: undefined,
        player1Symbol: "x",
        player2Symbol: "o",
        board: ["", "", "", "", "", "", "", "", ""],
        currentTurn: message.userID,
      };
      matches.push(game);
      socket.emit("message", { method: "game-created", ...game });
    }

    if (message.method === "make-move") {
      let result;
      let indexMatch = matches.findIndex(
        (match) => match.gameId == message.gameId
      );
      let {
        currentTurn,
        board,
        player1Symbol,
        player2Symbol,
        player1Socket,
        player2Socket,
        player1,
        player2,
      } = matches[indexMatch];
      if (currentTurn === message.userID) {
        if (currentTurn === player1) {
          result = makeMove(board, player1Symbol, message.position);
        } else if (currentTurn === player2) {
          result = makeMove(board, player2Symbol, message.position);
        }
        if (result === "Move made sucessfully") {
          matches[indexMatch].currentTurn =
            currentTurn === player1 ? player2 : player1;
          io.to(player2Socket).emit("message", {
            method: "move-made",
            message: result,
            board: matches[indexMatch].board,
          });
          io.to(player1Socket).emit("message", {
            method: "move-made",
            message: result,
            board,
          });
        } else if (result === "Position already taken") {
          if (currentTurn === player1) {
            io.to(player1Socket).emit("message", {
              method: "invalid-position",
              message: result,
              board,
            });
          } else {
            io.to(player2Socket).emit("message", {
              method: "invalid-position",
              message: result,
              board,
            });
          }
        }
      } else if (currentTurn !== message.userID) {
        if (message.userID === player1) {
          io.to(player1Socket).emit("message", {
            method: "invalid-turn",
            message: "It's not your turn",
            board,
          });
        } else if (message.userID === player2) {
          io.to(player2Socket).emit("message", {
            method: "invalid-turn",
            message: "It's not your turn",
            board,
          });
        }
      }
    }

    if (message.method === "join-game") {
      let indexMatch = matches.findIndex(
        (match) => match.gameId == message.gameId
      );
      if (indexMatch === -1) {
        socket.emit("message", {
          method: "game-not-found",
          errorMessage: "Game not found",
        });
      } else if (
        matches[indexMatch].player2 !== undefined &&
        matches[indexMatch].player1 !== undefined
      ) {
        if (
            matches[indexMatch].player2 === message.userID ||
            matches[indexMatch].player1 === message.userID
          ) {
            if(matches[indexMatch].player2 === message.userID){
                matches[indexMatch].player2Socket = socket.id;
            }else{
                matches[indexMatch].player1Socket = socket.id;
            }
            socket.emit("message", {
                method: "game-joined",
                gameId: message.gameId,
            });
            socket.emit("message", {
                method: "move-made",
                message: "Update",
                board: matches[indexMatch].board,
              });
        }else{
            socket.emit("message", {
                method: "match-full",
                errorMessage: "Match is full",
              });
        }
      } else if (matches[indexMatch].player2 === undefined) {
        matches[indexMatch].player2 = message.userID;
        matches[indexMatch].player2Socket = socket.id;
        matches[indexMatch].player2Symbol = "o";
        socket.emit("message", {
          method: "game-joined",
          gameId: message.gameId,
        });
      }
    }

    // joinGame(socket);
    // if (getOpponent(socket)) {
    //   socket.emit("game-begin", {
    //     symbol: players[socket.id].symbol,
    //   });

    //   getOpponent(socket).emit("game-begin", {
    //     symbol: players[getOpponent(socket).id].symbol,
    //   });
    // }
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user disconnected");
  });

  // socket.on("game-move", (event) => {
  //     console.log(event)
  //     console.log(socket.id)
  // })
});

app.use("/", (req, res) => {});
