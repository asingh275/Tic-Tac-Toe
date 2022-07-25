import React, { useState } from 'react'
import Square from './Square';
// Creating socket and connecting for testing


const Board = (props) => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [gameError, setGameError] = useState(undefined);

    props.socket.on("message", (data) => {
        if(data.method === "move-made"){
            console.log(data);
            setBoard(data.board);
            setGameError(undefined);
        }else if(data.method === "invalid-turn"){
            setGameError(data.message);
        }else if(data.method === "invalid-position"){
            setGameError(data.message);
        }
    });

    const selectSquare = (square) => {
        props.socket.emit("message", {
            method: "make-move",
            gameId: props.gameId,
            userID: props.user.sub,
            position: square
        });
    }

    return (
        <div className="board">
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
        </div>
    )
}

export default Board