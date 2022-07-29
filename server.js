const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const router = require("./routes/index.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/v1/", router, (req, res) => {});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.listen(app.settings.port, () => {
//   console.log("Listening on", app.settings.port);
// });
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://localhost/:${process.env.PORT}`,
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
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return "";
};

const checkForTie = (board) => {
  for (let index = 0; index < board.length; index++) {
    if (board[index] === "") {
      return false;
    }
  }
  return true;
};

let matches = [];

io.on("connection", (socket) => {
  console.log("New connection " + socket.id);
  socket.on("message", (message) => {
    if (message.method === "create-game") {
      console.log(socket.id);
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
      matches.push(game);
      socket.emit("message", { method: "game-created", ...game });
    }
    if (message.method == "reset-game") {
      let game = matches.find((game) => game.gameId == message.gameId);
      game.board = ["", "", "", "", "", "", "", "", ""];
      game.currentTurn = game.player1;
      io.to(game.player1Socket).emit("message", {
        method: "game-reset",
        ...game,
      });
      io.to(game.player2Socket).emit("message", {
        method: "game-reset",
        ...game,
      });
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
            board,
            player1Score: matches[indexMatch].player1Score,
            player2Score: matches[indexMatch].player2Score,
          });
          io.to(player1Socket).emit("message", {
            method: "move-made",
            message: result,
            board,
            player1Score: matches[indexMatch].player1Score,
            player2Score: matches[indexMatch].player2Score,
          });
          if (checkWin(board) !== "") {
            let winnerMessage = "You win!";
            let loserMessage = "You lose!";

            if (checkWin(board) === player1Symbol) {
              matches[indexMatch].player1Score++;
              io.to(player1Socket).emit("message", {
                method: "game-over",
                message: winnerMessage,
                player1Score: matches[indexMatch].player1Score,
                player2Score: matches[indexMatch].player2Score,
              });
              io.to(player2Socket).emit("message", {
                method: "game-over",
                message: loserMessage,
                player1Score: matches[indexMatch].player1Score,
                player2Score: matches[indexMatch].player2Score,
              });
            } else {
              matches[indexMatch].player2Score++;
              io.to(player1Socket).emit("message", {
                method: "game-over",
                message: loserMessage,
                player1Score: matches[indexMatch].player1Score,
                player2Score: matches[indexMatch].player2Score,
              });
              io.to(player2Socket).emit("message", {
                method: "game-over",
                message: winnerMessage,
                player1Score: matches[indexMatch].player1Score,
                player2Score: matches[indexMatch].player2Score,
              });
            }
            matches[indexMatch].currentTurn = "over";
          }
          if (checkForTie(board)) {
            const tieMessage = "It's a tie!";
            io.to(player1Socket).emit("message", {
              method: "game-over",
              message: tieMessage,
              player1Score: matches[indexMatch].player1Score,
              player2Score: matches[indexMatch].player2Score,
            });
            io.to(player2Socket).emit("message", {
              method: "game-over",
              message: tieMessage,
              player1Score: matches[indexMatch].player1Score,
              player2Score: matches[indexMatch].player2Score,
            });
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
        if (currentTurn === "over") {
          socket.emit("message", {
            method: "game-over-error",
            message: "Game is over",
          });
        } else if (message.userID === player1) {
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
          if (matches[indexMatch].player2 === message.userID) {
            matches[indexMatch].player2Socket = socket.id;
          } else {
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
          let {player1Socket, player2Socket, player1Name, player2Name, historyChat, gameId} = matches[indexMatch];
          if(socket.id === player1Socket){
            historyChat.push({
              userID: 0000000,
              userName: "System",
              gameId: gameId,
              messageContent: `${player1Name} has joined the game`,
              date: new Date(),
            });
            io.to(player2Socket).emit("message-chat", {
              method: "update-chat",
              historyChat,
            });
          }else{
            historyChat.push({
              userID: 0000000,
              userName: "System",
              gameId: gameId,
              messageContent: `${player2Name} has joined the game`,
              date: new Date(),
            });
            io.to(player1Socket).emit("message-chat", {
              method: "update-chat",
              historyChat,
            });
          }
        } else {
          socket.emit("message", {
            method: "match-full",
            errorMessage: "Match is full",
          });
        }
      } else if (matches[indexMatch].player2 === undefined) {
        matches[indexMatch].player2 = message.userID;
        matches[indexMatch].player2Name = message.userName;
        matches[indexMatch].player2Socket = socket.id;
        matches[indexMatch].player2Symbol = "o";
        socket.emit("message", {
          method: "game-joined",
          gameId: message.gameId,
        });
        let {player1Socket, player2Socket, player1Name, player2Name, historyChat, gameId} = matches[indexMatch];
        if(socket.id === player1Socket){
          historyChat.push({
            userID: 0000000,
            userName: "System",
            gameId: gameId,
            messageContent: `${player1Name} has joined the game`,
            date: new Date(),
          });
          io.to(player2Socket).emit("message-chat", {
            method: "update-chat",
            historyChat,
          });
        }else{
          historyChat.push({
            userID: 0000000,
            userName: "System",
            gameId: gameId,
            messageContent: `${player2Name} has joined the game`,
            date: new Date(),
          });
          io.to(player1Socket).emit("message-chat", {
            method: "update-chat",
            historyChat,
          });
        }
      }
    }
    if (message.method === "exit-game"){
      let indexMatch = matches.findIndex(
        (match) => match.gameId == message.gameId
      );
      let {player1Socket, player2Socket, player1Name, player2Name, historyChat, gameId} = matches[indexMatch];
      if(socket.id === player1Socket){
        historyChat.push({
          userID: 0000000,
          userName: "System",
          gameId: gameId,
          messageContent: `${player1Name} has left the game`,
          date: new Date(),
        });
        io.to(player2Socket).emit("message-chat", {
          method: "update-chat",
          historyChat,
        });
      }else{
        historyChat.push({
          userID: 0000000,
          userName: "System",
          gameId: gameId,
          messageContent: `${player2Name} has left the game`,
          date: new Date(),
        });
        io.to(player1Socket).emit("message-chat", {
          method: "update-chat",
          historyChat,
        });
      }
    }
  });

  socket.on("message-chat", (message) => {
    if (message.method == "send-message") {
      let indexMatch = matches.findIndex(
        (match) => match.gameId == message.gameId
      );
      let { historyChat, player1Socket, player2Socket } = matches[indexMatch];
      delete message.method;
      historyChat.push(message);
      io.to(player1Socket).emit("message-chat", {
        method: "update-chat",
        historyChat,
      });
      io.to(player2Socket).emit("message-chat", {
        method: "update-chat",
        historyChat,
      });
    }
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server started on port " + server.address().port);
});
