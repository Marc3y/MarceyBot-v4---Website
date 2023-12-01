const {TitleText, VersionText, AuthorText, versionData} = require('./scripts/data.js');
const {initMongoDB, getMongoClient} = require('./scripts/mongo.js');
const {log, warning, debug, error, emptyLog} = require('./scripts/logger.js');
const {getMarceyBotInfos, getTokens, startTwitchBot, sendMessage, joinChannel, leaveChannel, getUserById, getUserByName} = require('./scripts/twitch.js');
const {initHttpServer} = require('./scripts/http.js');
const {performance} = require('perf_hooks');


startBot();
async function startBot(){
    const startTime = performance.now();
    emptyLog(" ");
    emptyLog(TitleText);
    emptyLog(VersionText);
    await sleep(1000);
    emptyLog("\n" + AuthorText);
    await sleep(500);
    emptyLog("\nDer Bot startet in 3 Sekunden...");
    await sleep(3000);
    log("MongoDB wird verbunden...");
    await initMongoDB();
    await sleep(500);
    log("MongoDB wurde verbunden.");
    log("Http-Server wird gestartet...")
    await initHttpServer();
    log("Twitch-Bot wird gestartet...");
    await startTwitchBot();
    log("Twitch-Bot wurde gestartet");
    const endTime = performance.now();
    const formattedTime = formatTime(endTime - startTime);
    const performanceTime = formatTime((endTime-startTime)-5000);
    log("Der Bot hat " + formattedTime + " gebraucht um zu starten. (Leistungs-Start-Zeit: " + performanceTime + ")");
    sendMessage("marceybot", "MarceyBot " + versionData + " wurde gestartet. Der Bot hat " + formattedTime + " gebraucht um zu starten. (Leistungs-Start-Zeit: " + performanceTime);
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = ((milliseconds % 3600000) % 60000) / 1000;
  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours}h`);
  }
  if (minutes > 0 || (hours === 0 && seconds === 0)) {
    formattedTime.push(`${minutes}min`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    formattedTime.push(`${seconds.toFixed(2)}sec`);
  }
  return formattedTime.join(' ');
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}