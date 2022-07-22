const express = require("express");
const app = express();
const server = app.listen(process.env.PORT || 3000, ()=>console.log("Listening on 8080"));

app.use(express.static("public"));
app.use(express.json());