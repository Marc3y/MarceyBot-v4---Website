import { error } from 'console';
import fs from 'fs';
import { isNullOrUndefined } from 'util';
let loadRunned = false;
document.addEventListener("DOMContentLoaded", function() {
    if(window.location.href.includes("localhost:")) return;
    if(loadRunned) return;
    loadRunned = true;
    uniqueId = window.location.href.split("?id=")[1];
    loadTTS();
    loadEmotes();
});
let uniqueId = null;
let delayAfter = 500;

function loadTTS(){
    fetch('https://api.marceybot.de/tts/current?uniqueId=' + uniqueId)
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.status !== "200"){
            setTimeout(() => {
                loadTTS();
            }, 500);
            return;
        }
        let channelId = data.channelId,
        username = data.username,
        message = data.message,
        audio = data.data.amazon.audio,
        audioUrl = data.data.amazon.audio_resource_url;
        const audioElement = new Audio(audioUrl);
        audioElement.addEventListener('loadedmetadata', function() {
            showDisplay(username, message, audioElement.duration, audioElement, data.titleColor, data.descriptionColor);
        });
    });
}

function showDisplay(username, message, seconds, audio, titleColor, descriptionColor){
    let animationContainer = document.querySelector(".animationContainer"),
    title = document.querySelector(".title"),
    description = document.querySelector(".description");
    title.textContent = username + " - TTS";

    console.log("jetzt styles " + titleColor + " und " + descriptionColor);

    try {
        title.style.color = titleColor + "";
        description.style.color = descriptionColor + "";   
    } catch (error) {
        console.error(error);
    }

    description.innerHTML = "";
    let words = message.split(' ');


    words.map(word => {
        let emoteLink = null;
        emotes.map(currentEmote => {
            if(currentEmote.name === word){
                emoteLink = currentEmote.url;
            } 
        });
        if(emoteLink !== null){
            console.log("Ein Emote wurde im Text gefunden: " + word);
            let span = document.createElement('span');
            let img = document.createElement('img');
            img.src = emoteLink;
            img.className = "emotePicture";
            span.appendChild(img);
            description.appendChild(span);
            description.appendChild(document.createTextNode(" "));
        } else {
            console.log("Beim Wort " + word + " wurde kein Emote gefunden");
            let textNode = document.createTextNode(word + " ");
            description.appendChild(textNode);
        }
    });
    
    if(!animationContainer.classList.contains("enabled")) animationContainer.classList.add("enabled");
    setTimeout(() => {
        audio.play();
        setTimeout(() => {
            setTimeout(() => {
                if(animationContainer.classList.contains("enabled")) animationContainer.classList.remove("enabled");
                setTimeout(() => {
                    description.textContent = "";
                }, 500);
                loadTTS();
            }, delayAfter);
        }, seconds*1000);
    }, 750);
}

function loadEmotes(){
    fetch("https://api.marceybot.de/tts/idToChannel?id=" + uniqueId)
    .then(response => response.json())
    .then(data => {
        let userId = data.userId;
        load7TV(userId);
        loadBTTV(userId);
    })
    .catch(error => {
        console.error(error);
    });
}

let emotes = [];

async function load7TV(userId){
    console.log("7TV Emotes werden geladen...");
    fetch("https://7tv.io/v3/users/twitch/" + userId)
    .then(response => response.json())
    .then(data => {
        let listEmotes = data.emote_set.emotes;
        {listEmotes.map((currentEmote, index) => (
           emotes[emotes.length] = {name: currentEmote.name, url: "https://cdn.7tv.app/emote/" + currentEmote.id + "/4x.webp"}
        ))}
        console.log("7TV Emotes wurden geladen");
        console.log(emotes);
    })
    .catch(error => {
        console.error(error);
    });
}

async function loadBTTV(userId){
    console.log("BTTV Emotes werden geladen...");
    fetch("https://api.betterttv.net/3/cached/users/twitch/" + userId)
    .then(response => response.json())
    .then(data => {
        let channelEmotes = data.channelEmotes;
        {channelEmotes.map((currentEmote, index) => (
            emotes[emotes.length] = {name: currentEmote.code, url: "https://cdn.betterttv.net/emote/" + currentEmote.id + "/3x"}
        ))}
        let sharedEmotes = data.sharedEmotes;
        {sharedEmotes.map((currentEmote, index) => (
            emotes[emotes.length] = {name: currentEmote.code, url: "https://cdn.betterttv.net/emote/" + currentEmote.id + "/3x"}
        ))}
    })
    .catch(error => {
        console.error(error);
    })
}