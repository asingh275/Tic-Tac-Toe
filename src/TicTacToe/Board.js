import React, { useState } from 'react'
import Square from './Square';
// Creating socket and connecting for testing


const Board = (props) => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [gameError, setGameError] = useState(undefined);
    const [resultMessage, SetResultMessage] = useState(undefined);
    const [player1Score, SetPlayer1Score] = useState(0);
    const [player2Score, SetPlayer2Score] = useState(0);

    props.socket.on("message", (data) => {
        if(data.method === "move-made"){
            setBoard(data.board);
            setGameError(undefined);
            SetPlayer1Score(data.player1Score);
            SetPlayer2Score(data.player2Score);
        }else if(data.method === "invalid-turn"){
            setGameError(data.message);
        }else if(data.method === "invalid-position"){
            setGameError(data.message);
        }else if(data.method === "game-over"){
            SetResultMessage(data.message);
            SetPlayer1Score(data.player1Score);
            SetPlayer2Score(data.player2Score);
        }else if(data.method === "game-over-error"){
            setGameError(data.message);
        }else if(data.method === "game-reset"){
            setBoard(data.board);
            setGameError(undefined);
            SetResultMessage(undefined);
            SetPlayer1Score(data.player1Score);
            SetPlayer2Score(data.player2Score);
        }
    });

    const selectSquare = (square) => {
        props.socket.emit("message", {
            method: "make-move",
            gameId: props.gameId,
            userID: props.user.uid,
            position: square
        });
    }

    const resetGame = () => {
        props.socket.emit("message", {
          method: "reset-game",
          gameId: props.gameId,
        });
      }

    return (
        <div className="board mt-4 shadow">
            {resultMessage !== undefined && <h2>{resultMessage}</h2>}
            <div className="row">
                <Square value={board[0]} selectSquare={() => selectSquare(0)}></Square>
                <Square value={board[1]} selectSquare={() => selectSquare(1)}></Square>
                <Square value={board[2]} selectSquare={() => selectSquare(2)}></Square>
            </div>
            <div className="row">
                <Square value={board[3]} selectSquare={() => selectSquare(3)}></Square>
                <Square value={board[4]} selectSquare={() => selectSquare(4)}></Square>
                <Square value={board[5]} selectSquare={() => selectSquare(5)}></Square>
            </div>
            <div className="row">
                <Square value={board[6]} selectSquare={() => selectSquare(6)}></Square>
                <Square value={board[7]} selectSquare={() => selectSquare(7)}></Square>
                <Square value={board[8]} selectSquare={() => selectSquare(8)}></Square>
            </div>
            {gameError && <h5>{gameError}</h5>}
            {resultMessage !== undefined && <button className="btn btn-dark my-3" onClick={() => resetGame()}>Reset Game</button>}
            <div>
                <h4>Score: </h4>
                <h5>Player 1: {player1Score} - Player 2: {player2Score}</h5>
            </div>
        </div>
    )
}

export default Board