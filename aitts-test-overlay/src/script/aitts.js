import fs from 'fs';
let loadRunned = false;
document.addEventListener("DOMContentLoaded", function() {
    if(window.location.href.includes("localhost:")) return;
    if(loadRunned) return;
    loadRunned = true;
    loadMarceyBotAPI();
});

function showDisplay(username, t){
    let ttsContainer = document.querySelector(".ttsContainer");
    let ttsTitle = document.querySelector(".ttsTitle");
    let ttsDescription = document.querySelector(".ttsText");
    ttsTitle.textContent = "AITTS - " + username;
    if(ttsDescription){
        ttsDescription.innerHTML = '';
    }
    console.log("hier full: " + t);
    const keywordTextPairs = t.split(/\s+(?=\w+:)/);
    keywordTextPairs.forEach(pair => {
        console.log("hier also: " + pair);
        const {keyword, text} = extractKeywordAndText(pair);
        console.log("hier: " + keyword + ", " + text);
        if(keyword !== undefined && text !== null){
            const span = document.createElement('span');
            span.className = "ttsVoice";
            span.textContent = keyword;
            ttsDescription.appendChild(span);
            ttsDescription.appendChild(document.createTextNode(text));
        }
    });
    ttsContainer.classList.add("active");
}

function disableDisplay(){
    let ttsContainer = document.querySelector(".ttsContainer");
    if(ttsContainer.classList.contains("active")){
        ttsContainer.classList.remove("active");
    }
}

function init(){
    loadModels();
    ChannelId = window.location.href.split('?channelId=')[1];
    if(ChannelId === null){
        return;
    }
    setTimeout(() => {
        loadNewTTS();
    }, 1000);
}
let xiApiKey = null;
let ChannelId = null;
let finalUsername = null;
let finalText = null;

let models = [];
let toPlay = [];

function loadNewTTS(){
    setTimeout(() => {
        disableDisplay();
    }, 1000);
    fetch('https://api.marceybot.de/currentTTS?channelId=' + ChannelId)
    .then(response => {
        if(!response.ok){
            setTimeout(() => {
                console.log(response);
                loadNewTTS();
            }, 3000);
            return undefined;
        }
        return response.json();
    })
    .then(data => {
        if(data === undefined) return;
        console.log(data);
        if(data.status === '201'){
            if(data.text.includes(":")){
                finalUsername = data.username;
                finalText = data.text;
                playTTS(data.text, "");
            } else {
                loadNewTTS();
            }
        } else {
            setTimeout(() => {
                loadNewTTS();
            }, 3000);
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der TTS-Informationen:', error);
    });
}

function loadMarceyBotAPI(){
    fetch('https://api.marceybot.de/aiTTSRequest?code=lasfdjhaioi9wda78g8')
    .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
        return response.json();
    })
    .then(data => {
        xiApiKey = data.code;
        init();
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Informationen:', error);
    });
}

function loadModels(){
    fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'xi-api-key': xiApiKey
            }
        })
        .then(response => {
        if(!response.ok){
            throw new Error('Get Model Anfrage fehlgeschlagen');
        }
            return response.json();
        })
        .then(data => {
            console.log(data);
            for(let i = 0; i < data.voices.length; i++){
                const obj = data.voices[i];
                if(obj.category !== "cloned") continue;
                const newModel = {name: obj.name, id: obj.voice_id};
                models[models.length] = newModel;
            }
            console.log("Models loaded:");
            console.log(models);
            let logo = document.querySelector(".logo");
            logo.classList.add("deactivated");
        });
}

let newTTS = false;

async function loadTTS(voiceName, message, maxVoices, keywordTextPairs){

    let voiceId = null; 

    console.log("1");

    for (let i = 0; i < models.length; i++) {
        const currentObj = models[i];
        if (currentObj.name === voiceName) {
            voiceId = currentObj.id;
            break;
        }
    }

    let stability = 0.3;
    let similarity_boost = 0.5;
    let style = 0;

    if(!voiceId || voiceId === null || voiceId === undefined){
        const requestData = {
            text: message,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: stability,
              similarity_boost: similarity_boost,
              style: style
            }
          };
        runTTSNow(voiceName, message, maxVoices, keywordTextPairs, voiceId, requestData);
        return;
    }
    fetch('https://api.marceybot.de/voiceSettings?id=' + voiceId)
    .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
        return response.json();
    })
    .then(data => {
        if(data.status === '201'){
            stability = data.stability;
            similarity_boost = data.similarity_boost;
            style = data.style;
            const requestData = {
                text: message,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: stability,
                    similarity_boost: similarity_boost,
                    style: style
                }
            };
            runTTSNow(voiceName, message, maxVoices, keywordTextPairs, voiceId, requestData);
        } else {
            const requestData = {
                text: message,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: stability,
                    similarity_boost: similarity_boost,
                    style: style
                }
            };
            runTTSNow(voiceName, message, maxVoices, keywordTextPairs, voiceId, requestData);
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Informationen:', error);
    });

    
}

function runTTSNow(voiceName, message, maxVoices, keywordTextPairs, voiceId, requestData){
    console.log("2");

      if(voiceId == null) voiceId = "pHHCf1XxNw1y6Aywl9YN";

    console.log("check check");

    try {
        const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg',
                'xi-api-key': xiApiKey
            },
            body: JSON.stringify(requestData)
        };

        fetch(apiUrl, requestOptions)
        .then(response => {
            if(!response.ok){
                throw new Error(`Fehler beim Abrufen der Daten: ${response.status} - ${response.statusText}`);
            }
            console.log(response);
            const {keyword, text} = extractKeywordAndText(keywordTextPairs[0]);
            if(keyword === undefined || keyword === null || text === undefined || text === null){
                console.log("dumme tts");
                toPlay = [];
                newTTS();
                loadNewTTS();
                return;
            }
            return response.blob();
        })
        .then(blob => {
            if(newTTS) {
                newTTS = false;
                return;
            }
            const audioUrl = URL.createObjectURL(blob);
            toPlay[toPlay.length] = {audioUrl: audioUrl};
            if(maxVoices === toPlay.length){
                playNextAudio();
            }
            keywordTextPairs[toPlay.length];
            const {keyword, text} = extractKeywordAndText(keywordTextPairs[toPlay.length]);
            try {
                loadTTS(keyword, text, maxVoices, keywordTextPairs);
            } catch(error){
                loadNewTTS();
            }
        })

      } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
      }

      setTimeout(() => {
        console.log(toPlay);
      }, 5000);
}

function extractKeywordAndText(pair) {
    let dummbatz1 = "Melvin501";
    let dummbatz2 = "lol";
    if(pair === null || pair === undefined || !pair || pair === "" || pair === " ") return {undefined, undefined};
    if(!pair.includes(': ')) return {dummbatz1, dummbatz2};
    const [keyword, text] = pair.split(': ');
    return { keyword, text };
}

function playTTS(message, username){
    toPlay = [];
    let voiceSize = 0;
    
    const keywordTextPairs = message.split(/\s+(?=\w+:)/);


    keywordTextPairs.forEach(pair => {
        const {keyword, text} = extractKeywordAndText(pair);
        console.log(`Keyword: ${keyword}, Text: ${text}`);
        voiceSize = voiceSize + 1;
    });
    const {keyword, text} = extractKeywordAndText(keywordTextPairs[0]);
    if(keyword.includes(" ") || text === undefined){
        console.log("dumm message neue wird geladen");
        loadNewTTS();
        return;
    }
    loadTTS(keyword, text, voiceSize, keywordTextPairs);

}

let currentIndex = 0;

let audioLoadingFinished = false;

function playNextAudio() {
    if(!audioLoadingFinished){
        audioLoadingFinished = true;
        showDisplay(finalUsername, finalText);
    }
console.log("playing");
  if (currentIndex < toPlay.length) {
    const audioElement = new Audio(toPlay[currentIndex].audioUrl);
    audioElement.addEventListener('ended', () => {
      currentIndex++;
      playNextAudio(); // Wenn die aktuelle Audio abgeschlossen ist, die nächste abspielen
    });
    audioElement.play();
  } else {
    // Alle Audio-URLs wurden abgespielt, Liste löschen oder andere Aktionen durchführen
    currentIndex = 0;
    toPlay.length = 0; // Liste löschen
    console.log('Alle Audio-Dateien wurden abgespielt und die Liste wurde gelöscht.');
    audioLoadingFinished = false;
    loadNewTTS();
  }
}