import { TwitchAccessToken, TwitchRefreshToken, TwitchUserId } from "./twitch";

export function testFunction(){
    console.log("wird gemacht");
    const requestData = {
        collection: 'marceybot',
        queryId: Math.random().toString(50).slice(2),
        data: {
            test: 'xd',
            okidoki: 'jojojo'
        }
    };
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/saveData', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error beim senden Aware");
        }
        return response.json();
    })
    .then((data) => {
        console.log('Erfolgreich: ', data);
    })
    .catch((error) => {
        console.error('Fehler: ', error);
    })
}

export function updateGameTitle(game, title){
    if(!game || game === undefined || game === null || game === "") {
        game = 'iwahdfoiwahdfoiwhai9odfh98ahd98awh9dh29q8hrd98qh9dna9hsaiodnaioh89023dhhaswiodhaioskhdsizh98asdh9sand98hnaa982hd';
    }
    console.log("Channel-Information-Update: " + game + " " + title);
    const requestData = {
        accessToken: TwitchAccessToken,
        game: game,
        title: title,
        userId: TwitchUserId
    };
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/changeTitleGame', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error beim senden Aware");
        }
        return response.json();
    })
    .then((data) => {
        console.log('Erfolgreich: ', data);
    })
    .catch((error) => {
        console.error('Fehler: ', error);
    })
}

export function addOrEditCommand(command){
    
}

export function addBot() {
    console.log("Adding Bot...");
    const requestData = {
        collection: 'requests',
        queryId: Math.random().toString(50).slice(2),
        data: {
            type: 'add_user',
            channelId: TwitchUserId,
            twitchAccessToken: TwitchAccessToken,
            twitchRefreshToken: TwitchRefreshToken,
            spotifyAccessToken: 'invalid',
            spotifyRefreshToken: 'invalid'
        }
    };
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/saveData', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error bei addUser Aware");
            const addButton = document.querySelector(".botjoin");
            addButton.textContent = "Hinzufügen";
        }
        return response.json();
    })
    .then((data) => {
        console.log('User added successfully: ', data);
        const addButton = document.querySelector(".botjoin");
        addButton.textContent = "Entfernen";
        setTimeout(function(){
            getUserInformation(TwitchUserId);
        }, 5000);
    })
    .catch((error) => {
        console.error('Fehler: ', error);
        const addButton = document.querySelector(".botjoin");
        addButton.textContent = "Hinzufügen";
    })
}

export function removeBot() {
    console.log("Adding Bot...");
    const requestData = {
        collection: 'requests',
        queryId: Math.random().toString(50).slice(2),
        data: {
            type: 'remove_user',
            channelId: TwitchUserId
        }
    };
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/saveData', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error bei addUser Aware");
            const addButton = document.querySelector(".botjoin");
            addButton.textContent = "Entfernen";
        }
        return response.json();
    })
    .then((data) => {
        console.log('User removed successfully: ', data);
        const addButton = document.querySelector(".botjoin");
        addButton.textContent = "Hinzufügen";
        const dateJoinedElement = document.querySelector(".dateJoinedValue");
        dateJoinedElement.textContent = "Nie";
        dateJoinedElement.style.color = "red";
        dateJoined = "Nie";
        commandSymbol = "!";
        isChannelJoined = false;
    })
    .catch((error) => {
        console.error('Fehler: ', error);
        const addButton = document.querySelector(".botjoin");
        addButton.textContent = "Entfernen";
    })
}

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
            return data;
        } else if(data.status === '201'){
            return data;
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Informationen:', error);
    });
}
