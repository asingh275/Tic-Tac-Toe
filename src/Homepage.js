import React from "react";
import TicTacToe from "./TicTacToe/TicTacToe";
// Creating socket and connecting for testing
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:8080");

const Homepage = (props) => {
    return (
        <div className="container">
            <TicTacToe></TicTacToe>
        </div>
    );
};

export default Homepage;