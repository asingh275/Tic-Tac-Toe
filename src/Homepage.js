import React from "react";
import TicTacToe from "./TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import io from "socket.io-client";

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
      userID: user.sub,
      userName: user.name,
    });
  };

  const joinGame = (e) => {
    e.preventDefault(e);
    socket.emit("message", {
      method: "join-game",
      userID: user.sub,
      userName: user.name,
      gameId: gameIdForm,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault(e);
    socket.emit("message-chat", {
      method: "send-message",
      userID: user.sub,
      userName: user.name,
      gameId: gameId,
      messageContent: chatMessage,
      date: new Date(),
    });
    setchatMessage("");
  };

  const setChatMessage = (e) => {
    setchatMessage(e.target.value);
  };


  useEffect(() => {
    if(socket === null){
      setSocket(io("http://localhost:3001"));
    }
    if(socket){
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
    <div className="container">
      {gameId == null && (
        <div>
          <button onClick={() => createGame()}>Create Game</button>
          <form
            onSubmit={(e) => {
              joinGame(e);
            }}
          >
            <input
              type="text"
              onChange={(e) => setGameFormId(e.target.value)}
            />
            <button type="submit">Join Game</button>
          </form>
        </div>
      )}
      {errorMessage !== undefined && <h4>{errorMessage}</h4>}
      {gameId !== null && (
        <div>
          <TicTacToe user={user} socket={socket} gameId={gameId}></TicTacToe>
        </div>
      )}
      {gameId !== null && <h3>Game ID: {gameId}</h3>}
      {gameId !== null && (
        <div>
          <h2>Welcome</h2>
          <div className="chat-box">
            {historyChat.map((chat, index) => {
              return (
                <div className="chat-message" key={'chat-message' + index}>
                  <span className="chat-message-date">[{new Date(chat.date).toLocaleTimeString()}] </span>
                  <span className="chat-message-user">{chat.userName}: </span>
                  <span className="chat-message-content">{chat.messageContent}</span>
                </div>
              );
            })}
          </div>
          <form onSubmit={(e) => sendMessage(e)}>
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e)}
            />
            <input name="submitmsg" type="submit" id="submitmsg" value="Send" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Homepage;
