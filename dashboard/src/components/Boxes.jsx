import React from 'react'
import { testFunction, getUserInformation, addBot, removeBot, updateGameTitle } from '../script/servermanager'; 
import { TwitchUserId } from '../script/twitch'; 

const Boxes = () => {

    const handleUserClick = () => {

        const button = document.querySelector(".botjoin");
        if(button.textContent.includes("Hinzufügen")){
            button.textContent = " ";
            addBot();
            return;
        } else if(button.textContent.includes("Entfernen")){
            removeBot();
            return;
        }
    };

    const handleQuickChangeClick = () => {
        const titleInput = document.querySelector("#titleInput");
        const gameInput = document.querySelector("#gameInput");
        updateGameTitle(gameInput.value, titleInput.value);
    };
    

  return (
    <div>

        <ul className="boxes-container">
        <li className="liveStats bg-primary" id="bot-box">
            <p>In Entwicklung...</p>
        </li>
            <li className="box bg-primary" id="bot-box">
                <p className="maintitle">Bot</p>
                <div className="dateContainer">
                   <p className="dateJoined">Du hast den Bot seit: </p>
                   <p className="dateJoinedValue">Nie</p>
                </div>
                <button className="botjoin cleanButton" onClick={handleUserClick}>
                Hinzufügen
                </button>
            </li>
        </ul>

    </div>
  )
}

export default Boxes