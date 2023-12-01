import { TwitchAccessToken, TwitchRefreshToken, TwitchUserId } from "./twitch";

export let isChannelJoined = false;
export let dateJoined = "Nie";
export let commandSymbol = "!";

export function getUserInformation(userId){

    console.log("User Informations get... " + userId);

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
            isChannelJoined = false;
            dateJoined = "Nie";
            commandSymbol = "!";
            return;
        } else if(data.status === '201'){
            isChannelJoined = true;
            dateJoined = data.dateJoined;
            commandSymbol = data.commandSymbol;
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Informationen:', error);
    });
}
