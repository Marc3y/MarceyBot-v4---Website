import { TwitchAccessToken, TwitchRefreshToken, TwitchUserId } from "./twitch";

let overlayId = null;

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(() => {
        let activateButton = document.querySelector(".activateButton");
        activateButton.addEventListener('click', () => {
            console.log("click erkannt " + TwitchUserId);
            let id =  getUUID(50);
            fetch("https://api.marceybot.de/tts/set?userId=" + TwitchUserId + "&uniqueId=" + id)
            .then(response => response.json())
            .then(data => {
                if(data.status === "203"){
                    console.log("TTS wurde aktiviert mit der UserId " + TwitchUserId);
                    let notActivated = document.querySelector(".notActivated");
                    let ttsContainer = document.querySelector(".ttsContainer");
                    ttsContainer.classList.add("enabled");
                    notActivated.classList.remove("enabled");
                    overlayId = id;
                }
            })
            .catch(error => {
                console.error(error);
            });
        });
        document.querySelector(".copyLink").addEventListener('click', () => {
            navigator.clipboard.writeText("https://marceybot.de/tts/overlay/?id=" + overlayId);
        });
        document.querySelector(".saveSettings").addEventListener('click', () => {
            let titleColorVal = document.querySelector(".titleColorPicker").value,
            descriptionColorVal = document.querySelector(".descriptionColorPicker").value;
            fetch("https://api.marceybot.de/tts/settings?channelId=" + TwitchUserId + "&titleColor=" + (titleColorVal + "").replace("#", "") + "&descriptionColor=" + (descriptionColorVal + "").replace("#", ""))
            .then(response => response.json())
            .then(data => {
                if(data.status === "203"){
                    let saveSettings = document.querySelector(".saveSettings");
                    saveSettings.textContent = "...";
                    setTimeout(() => {
                        saveSettings.textContent = "Speichern";
                    }, 500);
                } else {
                    console.log("nicht richtig weil " + TwitchUserId + " titlecolor " + titleColorVal + " descriptioncolor " + descriptionColorVal);
                }
            })
            .catch(error => {
                console.error(error);
            })
        })
        fetch('https://api.marceybot.de/tts/information?channelId=' + TwitchUserId)
        .then(response => response.json())
        .then(data => {
            if(data.status !== "203"){
                console.log("TTS ist nicht aktiviert.");
                let notActivated = document.querySelector(".notActivated");
                let ttsContainer = document.querySelector(".ttsContainer");
                ttsContainer.classList.remove("enabled");
                notActivated.classList.add("enabled");
            } else {
                overlayId = data.uniqueId;
                let titleColorPicker = document.querySelector(".titleColorPicker"),
                descriptionColorPicker = document.querySelector(".descriptionColorPicker"),
                titleTest = document.querySelector(".titleTest"),
                descriptionTest = document.querySelector(".descriptionTest");
                titleColorPicker.value = data.titleColor;
                descriptionColorPicker.value = data.descriptionColor;
                titleTest.style.color = data.titleColor;
                descriptionTest.style.color = data.descriptionColor;
                console.log("TTS ist aktiviert");
            }
        }).catch(error => {
            console.error(error);
        })
    }, 100);
})

function getUUID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};