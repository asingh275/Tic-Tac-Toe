import React, { useState } from 'react'
import Square from './Square';

const Board = () => {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);


    return (
        <div className="board">
            <div className="row">
                <Square value={board[0]}></Square>
                <Square value={board[1]}></Square>
                <Square value={board[2]}></Square>
            </div>
            <div className="row">
                <Square value={board[3]}></Square>
                <Square value={board[4]}></Square>
                <Square value={board[5]}></Square>
            </div>
            <div className="row">
                <Square value={board[6]}></Square>
                <Square value={board[7]}></Square>
                <Square value={board[8]}></Square>
            </div>
        </div>
    )
}

export default Board