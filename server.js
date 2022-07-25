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

const checkWin = (board) => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return "";
}

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
          if(checkWin(board) !== ""){
            let winnerMessage = "You win!";
            let loserMessage = "You lose!";
            if(checkWin(board) === player1Symbol){
              io.to(player1Socket).emit("message", {
                method: "game-over",
                message: winnerMessage,
              });
              io.to(player2Socket).emit("message", {
                method: "game-over",
                message: loserMessage,
              });
            }else{
              io.to(player1Socket).emit("message", {
                method: "game-over",
                message: loserMessage,
              });
              io.to(player2Socket).emit("message", {
                method: "game-over",
                message: winnerMessage,
              });
            }
            matches[indexMatch].currentTurn = "over";
          }
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
        if(currentTurn === "over"){
          socket.emit("message", {
            method: "game-over-error",
            message: "Game is over",
          });
        }
        else if (message.userID === player1) {
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
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user disconnected");
  });

});

app.use("/", (req, res) => {});
