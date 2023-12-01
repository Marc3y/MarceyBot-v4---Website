import React from 'react'
import { sendSpotifyEmail } from '../script/servermanager';
import { TwitchUserId } from '../script/twitch';

const Content = () => {

    const onEmailChange = () => {
        run();
        function run(){
            const field = document.querySelector(".emailField");
            if(field.value === "Spotify-Email..."){
                field.value = "";
                field.style.opacity = '1';
            } else {
                field.style.opacity = '1';
            }
        }
    }

    const onLostFocus = () => {
        run();
        function run(){
            const field = document.querySelector(".emailField");
            if(field.value === "" || field.value === " " || field.value === "  " || field.value === "    "){
                field.value = "Spotify-Email...";
                field.style.opacity = '0.4';
            } else if(field.value !== "Spotify-Email..."){
                field.style.opacity = '1';
                if(!field.value.includes("@")){
                    field.value = field.value + "@gmail.com";
                }
            }
        }
    }

    const success = () => {
        run();
        function run(){
            const email = document.querySelector(".emailField").value;
            if(!email.includes("@")) return;
            try {
                sendSpotifyEmail(TwitchUserId, email, window.location.href.split("?code=")[1]);
                document.querySelector(".all").style.display = "none";
                document.querySelector(".loadingTextContainer").style.display = "flex";
                setTimeout(() => {
                    window.location.href = "https://marceybot.de/spotify/";
                }, 5000);
            } catch(error){
                console.log(error);
            }
        }
    }

  return (
    <div>
    <div className="loadingTextContainer">
        <p className="color-white position-absolute display-flex bigFont loadingTextA">Bitte warte einen Augenblick.</p>
        <p className="color-white position-absolute display-flex smallFont loadingTextB">Deine Anfrage wird bearbeitet...</p>
    </div>
    <div className="all">
        <div className="textContainer">
            <p className="spotifyEmailTextA">Bitte gebe deine Spotify-Email ein.</p>
            <p className="spotifyEmailTextB">Ohne diese werden die Spotify-Aktionen nicht funktionieren.</p>
        </div>
        <div className="container">
            <div className="emailContainer">
                <input type="text" className="emailField"  onBlur={onLostFocus} onClick={onEmailChange} onChange={onEmailChange} defaultValue="Spotify-Email..."/>
            </div>
        </div>
        <div className="buttonContainer">
            <button className="successButton cleanButton" onClick={success}>Bestätigen</button>
        </div>
    </div>
    </div>
  )
}

export default Content