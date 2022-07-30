import React from 'react'
import UserInfo from './UserInfo'

const GameHeader = (props) => {
    if(props.resultMessage) {
        return (
            <div className="d-flex flex-column align-items-center mt-4 bg-light rounded p-3">
             <div>
                {props.resultMessage === "You win!" && (
                    <><div className="alert alert-success">
                        You Win!
                    </div></>
                )}
                {props.resultMessage === "You lose!" && (
                    <><div className="alert alert-danger">
                        You Lose!
                    </div></>
                )}
                {props.resultMessage === "It's a tie!" && (
                    <><div className="alert alert-secondary">
                        It's a tie!
                    </div></>
                )}
                {props.resultMessage !== undefined && (
                        <button className="btn btn-dark my-3" onClick={() => props.resetGame()}>
                            Reset Game
                        </button>
                    )}
            </div>
            <div>
                <UserInfo user={props.user} />
                <div className="text-center rounded bg-danger me-3 fs-3 text-light p-3 my-2">
                        VS
                </div>
                <UserInfo user={props.other}/>
            </div>
            
        </div>
        )
    } else {
        return <>
            <div className="d-flex flex-column align-items-center">
                <UserInfo user={props.user} />
                <div className="text-center rounded bg-danger me-3 fs-3 text-light p-3 my-2">
                        VS
                </div>
                <UserInfo user={props.other}/>
            </div>
        </>
    }
   
  
}

export default GameHeader