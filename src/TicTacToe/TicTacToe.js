import React from "react";
import Board from "./Board";
import "./tictactoe.css";

const TicTacToe = (props) => {
  

  return (
    <div className="game-container">
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <Board
          setEmailMessage={props.setEmailMessage}
          socket={props.socket}
          user={props.user}
          gameId={props.gameId}
          setResultMessage={props.setResultMessage}
        ></Board>
      </div>
    </div>
  );
};

export default TicTacToe;
