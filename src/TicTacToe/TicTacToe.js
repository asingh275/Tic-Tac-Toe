import React from 'react'
import Board from './Board';
import './tictactoe.css'

const TicTacToe = () => {
    return (
        <div className="game-container">
            <div className="container">
                <h1>Tic Tac Toe</h1>
                <Board></Board>
            </div>
            
        </div>
    )
}

export default TicTacToe;