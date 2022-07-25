import React from "react";
import TicTacToe from "./TicTacToe/TicTacToe";
import { useState } from "react";
import io from "socket.io-client";
const socket = io("ws://localhost:3001");

const Homepage = (props) => {
  const [gameId, setGameId] = useState(null);
  const [gameIdForm, setGameFormId] = useState(null);
  const user= props.login;
  const [errorMessage, setErrorMessage] = useState(undefined);
  console.log(user);
  const createGame = () => {
    socket.emit("message", {
      method: "create-game",
      userID: user.sub,
    });
  };

  const joinGame = (e) => {
    e.preventDefault(e);
    socket.emit("message", {
      method: "join-game",
      userID: user.sub,
      gameId: gameIdForm,
    });
  };

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
      {gameId !== null && <TicTacToe user={user} socket={socket}gameId={gameId}></TicTacToe>}
      {gameId !== null && <h3>Game ID: {gameId}</h3>}
    </div>
  );
};

export default Homepage;
