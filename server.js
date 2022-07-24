const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

let players = {};
let unmatched;
const joinGame = (socket) => {
    players[socket.id] = {
        opponent: unmatched,
        symbol: "x",
        socket: socket
    }

    if(unmatched) {
        players[socket.id].symbol = "o";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

const getOpponent = (socket) => {
  if (!players[socket.id].opponent) return;

  return players[players[socket.id].opponent].socket;
}


io.on("connection", socket => {
    console.log("new connection", socket.id)
    
    socket.on("start", () => {
        joinGame(socket);

        if (getOpponent(socket)) {
        
            socket.emit("game-begin", {
                symbol: players[socket.id].symbol
            });
            
            getOpponent(socket).emit("game-begin", {
                symbol: players[getOpponent(socket).id].symbol
            });

        }
    })
    

    socket.on("disconnect", () => {
        io.emit("message", "A user disconnected")
    })

    // socket.on("game-move", (event) => {
    //     console.log(event)
    //     console.log(socket.id)
    // })

})

server.listen(8080, () => {
    console.log("Server is running...")
}) 
