import React from "react";
import TicTacToe from "./TicTacToe/TicTacToe";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import UserInfo from "./UserInfo";
import './chat.css'
import axios from "axios";

const Homepage = (props) => {
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameIdForm, setGameFormId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [chatMessage, setchatMessage] = useState("");
  const [historyChat, setHistoryChat] = useState([]);
  const [otherUser, setOtherUser] = useState(undefined);
  const [emailMessage, setEmailMessage] = useState(undefined);
  const [heading, setHeading] = useState(<>
    <span className="badge bg-primary text-light">Welcome!!!</span>
  </>);
  const [emailToShare, setEmailToShare] = useState("");
  const user = props.login;

  const createGame = () => {
    socket.emit("message", {
      method: "create-game",
      userID: user.uid,
      userName: user.displayName,
    });

    showHeading(null);
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

  const setEmailToShareId = (e) => {
     setEmailToShare(e.target.value);
  }

  const shareGameId = (e) => {
    e.preventDefault(e);
    axios.post('/api/v1/sharegameid', {
       to: emailToShare,
       gameID: gameId,
       userName: user.displayName
  })
  .then(function (response) {
    setEmailToShare("");
    setEmailMessage(response.data.message);
  })
  .catch(function (error) {
    setEmailToShare("");
    setEmailMessage(response.data.message);
  });
    console.log(e)
  }


  useEffect(() => {
    if (socket === null) {
      setSocket(io(`${location.protocol}//${location.host}`));
    }
    if (socket) {
      socket.on("message", (data) => {
        if (data.method === "game-created") {
          setGameId(data.gameId);
          setErrorMessage(undefined);
        }
        if (data.method === "game-joined") {
          setOtherUser(data.other);
          setGameId(data.gameId);
          setErrorMessage(undefined);
          showHeading(data.other);
        }
        if (data.method === "game-not-found") {
          setErrorMessage(data.errorMessage);
        }
        if (data.method === "match-full") {
          setGameId(data.gameId);
          setErrorMessage(data.errorMessage);
        }
        if (data.method === "player-joined") {
          setOtherUser(data.message);
          showHeading(data.message);
          setEmailMessage(undefined);
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


  const showHeading = (other) => {
    if (other != null) {
      setHeading(
        <>
          <UserInfo user={user} />
          <div className="text-center rounded bg-danger me-3 fs-3 text-light">
            VS
          </div>
          <UserInfo user={other} />
        </>
      )
    } else {
      setHeading(
        <>
          <UserInfo user={user} />
          <div className="text-center rounded bg-danger me-3 fs-3 text-light">
            VS
          </div>
          <UserInfo />
        </>
      )
    }
  }

return (
  <div className="vh-100 vw-100 m-0 p-0 homepage">
      
      <div className="container d-flex flex-row">  
          {gameId !== null && (
            <div className="shadow rounded d-flex flex-column justify-content-center">
              {heading}
            </div>
          )}        
              <div className="bg-light p-3 mt-5 rounded">
                {gameId == null && (
                  <div className="container text-start p-5">
                    <div className="row">
                        <div className="col-md-12 mb-1">
                          <h2>Create or join a room to start playing</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-4">
                          <h3>
                              <small className="text-muted">Invite a friend over to a challenge!</small>
                          </h3>
                          
                        </div>
                    </div>
                    <div className="row">

                    
                        <form
                            onSubmit={(e) => {
                              joinGame(e);
                            }}
                          >
                            <div className="col-md-12">
                              <div className="input-group">
                                  <input
                                    type="text"
                                    onChange={(e) => setGameFormId(e.target.value)}
                                    className="form-control"
                                    placeholder="Insert Game ID here"
                                  />
                                  <button className="btn btn-dark" type="submit">Join Game</button>
                              </div>
                                
                            </div>
                        </form>
                      
                    </div>
                  <div className="row">
                    <div className="col-md-12">

                    
                      <div className="mt-2">
                        <button className="btn btn-dark" onClick={() => createGame()}>Create Game</button>
                      </div>
                    </div>
                  </div>
                </div>
                )}
                {errorMessage !== undefined && <h4>{errorMessage}</h4>}
                {gameId !== null && (
                  <div className="d-flex flex-column p-2 flex-grow-1 text-center">
                    <TicTacToe user={user} socket={socket} gameId={gameId} setEmailMessage={setEmailMessage}></TicTacToe>
                    <h2><span className="badge bg-dark">Game ID: {gameId}</span></h2>
                    <button onClick={(e) => leaveGame(e)} className="btn btn-dark mt-3">Leave Game</button>
                    <form onSubmit={(e) => shareGameId(e)} className="mt-2">
                      <div class="input-group">
                        <input
                          type="email"
                          value={emailToShare}
                          onChange={(e) => setEmailToShareId(e)}
                          className="form-control"
                          placeholder="Recipient's Email"
                         />
                         <button className="btn btn-success" name="submitmsg" type="submit" id="submitmsg" >Share Game ID</button>
                      </div>
                      {emailMessage !== undefined && <b><i><p>{emailMessage}</p></i></b>}                 
                  </form>  
                  </div>
                  
                )}
              </div>      


        
          {gameId !== null && (
            <div className="d-flex flex-column align-items-end shadow bg-dark text-light rounded justify-content-center mt-3">
              
                <div className="chat p-3 d-flex flex-column overflow-auto">
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
                  <form onSubmit={(e) => sendMessage(e)} className="p-2">
                      <div class="input-group">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e)}
                          className="form-control"
                         />
                         <button className="btn btn-success" name="submitmsg" type="submit" id="submitmsg"> Send </button>
                      </div>                      
                  </form>             
            </div>
          )}

      </div>
  
  </div>
);
};
      export default Homepage;
