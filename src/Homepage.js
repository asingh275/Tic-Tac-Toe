import React from "react";
import TicTacToe from "./TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import './chat.css'

const Homepage = (props) => {
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameIdForm, setGameFormId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [chatMessage, setchatMessage] = useState("");
  const [historyChat, setHistoryChat] = useState([]);
  const user = props.login;

  const createGame = () => {
    socket.emit("message", {
      method: "create-game",
      userID: user.uid,
      userName: user.displayName,
    });
  };

  const joinGame = (e) => {
    e.preventDefault(e);
    socket.emit("message", {
      method: "join-game",
      userID: user.uid,
      userName: user.displayName,
      gameId: gameIdForm,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault(e);
    socket.emit("message-chat", {
      method: "send-message",
      userID: user.uid,
      userName: user.displayName,
      gameId: gameId,
      messageContent: chatMessage,
      date: new Date(),
    });
    setchatMessage("");
  };

  const leaveGame = (e) => {
    e.preventDefault(e);
    socket.emit("message", {
      method: "exit-game",
      gameId: gameId,
    });
    setGameId(null);
  };


  const setChatMessage = (e) => {
    setchatMessage(e.target.value);
  };


  useEffect(() => {
    if (socket === null) {
      console.log(`${location.protocol}//${location.host}`);
      setSocket(io(`${location.protocol}//${location.host}`));
    }
    if (socket) {
      socket.on("message", (data) => {
        if (data.method === "game-created") {
          setGameId(data.gameId);
          setErrorMessage(undefined);
        }
        if (data.method === "game-joined") {
          setGameId(data.gameId);
          setErrorMessage(undefined);
        }
        if (data.method === "game-not-found") {
          setErrorMessage(data.errorMessage);
        }
        if (data.method === "match-full") {
          setGameId(data.gameId);
          setErrorMessage(data.errorMessage);
        }
      });
      socket.on("message-chat", (data) => {
        if (data.method === "update-chat") {
          if (data.historyChat.length > historyChat.length) {
            setHistoryChat((oldState) => [
              ...oldState,
              ...data.historyChat.slice(
                data.historyChat.length - historyChat.length - 1
              ),
            ]);
          }
        }
      });
    }
  }, [socket]);

  return (
    <div className="w-100 h-100 m-0 p-0 homepage">
      <div className="container">
        <div className="row">

          <div className="col-8">
            <div className="container shadow rounded pb-5 bg-light">
              <div className="col w-80 h-100">

                <div className="row text-center mt-5">
                  <h1 className="mt-10"><span className="badge bg-warning text-dark">{user.displayName}'s Game</span></h1>
                </div>
                <div className="row bg-light d-flex flex-row pt-5">
                  {gameId == null && (
                    <div className="container">
                      <form
                        onSubmit={(e) => {
                          joinGame(e);
                        }}
                      >
                        <input
                          type="text"
                          onChange={(e) => setGameFormId(e.target.value)}
                        />

                        <button className="ms-3 btn btn-dark" type="submit">Join Game</button>


                      </form>
                      <div className="mt-4">
                        <button className="btn btn-dark" onClick={() => createGame()}>Create Game</button>
                      </div>

                    </div>
                  )}
                  {errorMessage !== undefined && <h4>{errorMessage}</h4>}
                  {gameId !== null && (
                    <div className="d-flex flex-column p-2 flex-grow-1 text-center">
                      <TicTacToe user={user} socket={socket} gameId={gameId}></TicTacToe>
                      <h2><span className="badge bg-dark">Game ID: {gameId}</span></h2>
                      <button onClick={(e) => leaveGame(e)} className="btn btn-dark">Leave Game</button>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>


          <div className="col-4 h-100">
            {gameId !== null && (
              <div className="p-2 d-flex align-items-end mw-50 shadow bg-dark text-light chat-box">
                <div>
                  <div className="h-100 mb-1 overflow-auto w-100 p-2">
                    {historyChat.map((chat, index) => {
                      return (
                        <div className="chat-message mb-2 bg-secondary bg-gradient rounded p-1" key={'chat-message' + index}>
                          <span className="chat-message-date">[{new Date(chat.date).toLocaleTimeString()}] </span>
                          <span className="chat-message-user">{chat.userName}: </span>
                          <span className="chat-message-content">{chat.messageContent}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-1">
                    <form onSubmit={(e) => sendMessage(e)}>
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e)}
                      />
                      <input className="btn btn-primary ms-2" name="submitmsg" type="submit" id="submitmsg" value="Send" />
                    </form>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Homepage;
