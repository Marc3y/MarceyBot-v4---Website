import { TwitchUserId } from "./twitch";

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(function(){
        console.log("running");
        const commandDiv = document.querySelector(".commands");
    const channelpointsDiv = document.querySelector(".channelpoints");
    const donationsDiv = document.querySelector(".donations");

    const commands = document.querySelector(".commandsO");
    const channelpoints = document.querySelector(".channelpointsO");
    const donations = document.querySelector(".donationsO");

    const commandsEnabled = document.querySelector(".commandsEnabled");
    const channelpointsEnabled = document.querySelector(".channelpointsEnabled");

    function getUserInformation(userId){

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
                commandsEnabled.textContent = data.ttsCommandsEnabled === "true" ? "Deaktivieren" : "Aktivieren";
                channelpointsEnabled.textContent = data.ttsChannelPointsEnabled === "true" ? "Deaktivieren" : "Aktivieren";
                return data;
            }
        })
        .catch(error => {
            console.error('Fehler beim Getten der User-Informationen:', error);
        });
    }

    getUserInformation(TwitchUserId);
    

    commands.addEventListener('click', () => {
        console.log("check");
        if(!commandDiv.classList.contains("enabled")){
            commandDiv.classList.toggle("enabled");
        }
        if(!commands.classList.contains("enabled")){
            commands.classList.toggle("enabled");
        }
        if(channelpoints.classList.contains("enabled")){
            channelpoints.classList.toggle("enabled");
        }
        if(channelpointsDiv.classList.contains("enabled")){
            channelpointsDiv.classList.toggle("enabled");
        }
        if(donations.classList.contains("enabled")){
            donations.classList.toggle("enabled");
        }
        if(donationsDiv.classList.contains("enabled")){
            donationsDiv.classList.toggle("enabled");
        }
    });
    channelpoints.addEventListener('click', () => {
        if(!channelpointsDiv.classList.contains("enabled")){
            channelpointsDiv.classList.toggle("enabled");
        }
        if(!channelpoints.classList.contains("enabled")){
            channelpoints.classList.toggle("enabled");
        }
        if(commands.classList.contains("enabled")){
            commands.classList.toggle("enabled");
        }
        if(commandDiv.classList.contains("enabled")){
            commandDiv.classList.toggle("enabled");
        }
        if(donations.classList.contains("enabled")){
            donations.classList.toggle("enabled");
        }
        if(donationsDiv.classList.contains("enabled")){
            donationsDiv.classList.toggle("enabled");
        }
    });
    donations.addEventListener('click', () => {
        if(!donationsDiv.classList.contains("enabled")){
            donationsDiv.classList.toggle("enabled");
        }
        if(!donations.classList.contains("enabled")){
            donations.classList.toggle("enabled");
        }
        if(commands.classList.contains("enabled")){
            commands.classList.toggle("enabled");
        }
        if(commandDiv.classList.contains("enabled")){
            commandDiv.classList.toggle("enabled");
        }
        if(channelpoints.classList.contains("enabled")){
            channelpoints.classList.toggle("enabled");
        }
        if(channelpointsDiv.classList.contains("enabled")){
            channelpointsDiv.classList.toggle("enabled");
        }
    });
    }, 0);
});