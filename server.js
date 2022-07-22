const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("new connection");
})

server.listen(process.env.PORT || 3000, ()=>console.log("Listening on 3000"));

app.use(express.static("public"));
app.use(express.json());