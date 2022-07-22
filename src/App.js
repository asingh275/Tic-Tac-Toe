import './App.css';
import { useState} from "react";


import Login from './login.js';
import Loading from './loading.js';
import Homepage from './Homepage';


const App = () => {
  const [login, setLogin] = useState();

  const renderPage = () => {
    if(login){
      return <Homepage />
    }
    return(<Login login={login} setLogin={setLogin}/>);
  }

  return (

    renderPage()
  );
}

export default App;
