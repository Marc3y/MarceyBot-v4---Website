const express = require('express');
const app = express();
const cors = require('cors');
const createServer = require('https').createServer;
const WebSocket = require('ws');
const { readFileSync } = require('fs');
var MongoClient = require('mongodb').MongoClient;

const mongoClient = new MongoClient('mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const server = createServer({
    cert: readFileSync('/etc/letsencrypt/live/api.marceybot.de/cert.pem'),
    key: readFileSync('/etc/letsencrypt/live/api.marceybot.de/privkey.pem')
});

const wss = new WebSocket.Server({server:server});

wss.on('connection', function connection(ws){
    console.log('A new client connected.');
    ws.send('Welcome new client!');
    ws.on('message', function incoming(message) {
        onWebSocketMessage(ws, message);
    });
});

function onWebSocketMessage(ws, message){
    if(!message.toString().startsWith("client_")) return;
    let args = message.toString().split(" ");
    if(args[0] === "client_newCode"){
        let code = args[1];
        onNewCode(ws, code);
        return;
    }
}

function onNewCode(ws, code){
    
}

app.get('/test', (req, res) => res.send('Successfully'));

app.use(cors({
    origin: 'https://marceybot.de',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());

server.listen(3002, () => console.log(`Listening on port 3002`));

//Twitch

let tmi = null;
let client = null;
let config = null;
const clientId = "k2flokd1q28w5j3nnmkqzd5dmoul0t";
const clientSecret = "toz57txgf6al88lc65wtifd2ku4frs";
let currentAccessToken = null;
let currentRefreshToken = null;


start();

async function start(){
    tmi = require('tmi.js');
    config = require('dotenv').config();

    await mongoClient.connect();
    const db = mongoClient.db('marceybot');
    const collection = db.collection('bot_keys');
    const result = await collection.findOne({bot: "chat"});
    if(result === undefined || result === null){
        console.log("Bot konnte nicht gestartet werden, da die Bot-Daten von der MongoDB nicht abgerufen werden können.");
        return;
    }
    currentRefreshToken = result.refresh_token;

    refreshAccessToken(currentRefreshToken)
    .then(async (newAccessToken) => {
        currentAccessToken = newAccessToken;
        const update = {$set: {access_token: currentAccessToken}};
        const updatedResult = await collection.updateOne({bot: "chat"}, update);
        console.log("Tokens refreshed, bot is starting...");
        initTwitchBot();
    })
    .catch((error) => {
        console.error('Fehler beim Refreshen des Tokens:', error);
    });
}

function initTwitchBot(){
    client = new tmi.Client({
        options: { debug: true },
        connection: {
            reconnect: true,
            secure: true,
        },
        identity: { 
            username: 'MarceyBot',
            password: currentAccessToken
        },
        channels: [ 'marcey____' ]
    });
    client.connect();
    client.on('message', (channel, tags, message, self) => {
        if(self) return;
        console.log(getChatMessageJson(channel.replace("#", ""), tags, message));
    });
}

async function joinChannel(channelName){
    client.join(channelName)
    .then(() => {
        console.log("Kanal " + channelName + " betreten.");
    })
    .catch((err) => {
        console.error("Fehler beim Beitreten des Kanals " + channelName + " " + err);
    });
}

async function saveMessage(userId, message){
    
}

function getChatMessageJson(channelName, tags, message){
    return {
        channelName: channelName,
        display_name: tags['display-name'],
        firstMessage: tags['first-msg'],
        id: tags.id,
        isMod: tags.mod,
        channelId: tags['room-id'],
        isSub: tags.subscriber,
        isTurbo: tags.turbo,
        userId: tags['user-id'],
        chatColor: tags.color,
        message_type: tags['message-type'],
        badges: tags.badges,
        badge_info: tags['badge-info'],
        message: message
    }
}

async function refreshAccessToken(refreshToken){
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if(response.ok){
        const data = await response.json();
        const newAccessToken = data.access_token;
        return newAccessToken;
    } else {
        throw new Error('Fehler beim Refreshen des Access-Tokens.');
    }
}

//