import React, { useEffect, useState } from 'react'
import Square from './Square';
// Creating socket and connecting for testing
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");


const Board = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("x");
    const [turn, setTurn] = useState("x");
    const [initialState, setInitialState] = useState(true);

    const selectSquare = (square) => {
        if(turn === player && board[square] === "") {
            setTurn(player === "x" ? "o" : "x");
            setBoard(board.map((value, index) => {
                if(index === square && value === "") {
                    return player;
                }
                return value;
            }))
            setInitialState(false);
        }
    }
    
    useEffect(() => {
        if(!initialState) {
            console.log("hello")
            socket.emit("game-move", {board, player, turn});
            // Need to change for other player (different socket)
            setPlayer(player === "x" ? "o" : "x");
            setTurn(player === "x" ? "o" : "x");
        }
    }, [board])

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
        </div>
    )
}

export default Board