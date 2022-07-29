import React from 'react';
import { useState} from "react";
import Login from './login.js';
import Homepage from './Homepage';
import './App.css';

const App = () => {
  const [login, setLogin] = useState();

  const renderPage = () => {
    if(login){
      return <Homepage login={login} />
    }
    return(<Login login={login} setLogin={setLogin}/>);
  }

  return (

    renderPage()
  );
}

export default App;
