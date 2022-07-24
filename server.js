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

io.on("connection", socket => {
    console.log("new connection", socket.id)

    socket.broadcast.emit("message", "A user has been connected");

    socket.on("disconnect", () => {
        io.emit("message", "A user disconnected")
    })

    socket.on("game-move", (event) => {
        console.log(event)
        console.log(socket.id)
    })

})

server.listen(8080, () => {
    console.log("Server is running...")
}) 
