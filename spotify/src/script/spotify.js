import { getUserInformation } from "./servermanager";
import { TwitchUserId } from "./twitch";

document.addEventListener("DOMContentLoaded", function() {
    let userId = TwitchUserId;
    if(window.location.href.includes("localhost:")){
        userId = "635626798";
    }
    fetch('https://api.marceybot.de/userInformation?channelId=' + userId)
    .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if(data.status === '203' || data.status === '400'){
            return data;
        } else if(data.status === '201'){
            let spotifyInfo = data;
            let spotifyConnected = false;
            let spotifyEmailRequested = false;
            let spotifyEmailConnected = false;
            spotifyConnected = spotifyInfo.spotifyConnected;
            spotifyEmailRequested = spotifyInfo.spotifyEmailRequested === "true";
            spotifyEmailConnected = spotifyInfo.spotifyEmailConnected === "true";
            if(spotifyConnected && spotifyEmailConnected){
                /* Spotify ist erfolgreich verbunden */
                document.querySelector(".spotifyText").textContent = "Du hast Spotify ";
                document.querySelector(".spotifyNotConnectedText").className = "spotifyConnectedText";
                document.querySelector(".spotifyConnectedText").textContent = "erfolgreich verbunden.";
                document.querySelector(".connectButton").textContent = "Erneut verbinden";
                return;
            }
            if(spotifyConnected && spotifyEmailRequested && !spotifyEmailConnected){
                /* Spotify-Email wurde abgeschickt aber noch nicht angenommen */
                document.querySelector(".spotifyText").textContent = "Du musst noch warten! Deine Email wurde noch ";
                document.querySelector(".spotifyNotConnectedText").textContent = "nicht überprüft."
                document.querySelector(".connectButton").textContent = "Erneut verbinden";
                return;
            }
            return data;
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Informationen:', error);
    });
    

});