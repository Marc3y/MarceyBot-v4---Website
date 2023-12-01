import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { isValidPassword } from './script/servermanager';

function App() {
  
  const onChange = () => {
    const element = document.querySelector(".passwort");
    
  };

  const Enter = () => {
    run();
    function run(){
      isValidPassword(document.querySelector(".passwort").value);
    }
  };

  return (
    <div className="container">
      <p className="description bold">MarceyBot v4 ist noch in Entwicklung.</p>
      <p className="description">Wenn du am Beta-Programm teilnimmst, kannst du dein Passwort</p>
      <p className="description">hier eingeben.</p>
      <input className="passwort" type="password" onChange={onChange}></input>
      <div className="buttonContainer">
        <button onClick={Enter}>Verbinden</button>
      </div>
    </div>
  )
}

export default App
