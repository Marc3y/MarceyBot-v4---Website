import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const port = 3001;
const wss = new WebSocket.Server({server});

let ClientId = "wp60awg1ifrh899hwmzjb06kzl8i5h";

const mongoClient = new MongoClient('mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors({
    origin: 'https://marceybot.de',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());

app.post('/saveData', async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('marceybot');

        console.log(req.body);

        const {collection, data} = req.body;

        console.log(collection);
        console.log(data);

        if(!collection || !data){
            return res.status(400).json({message: 'Ungültige Anfrage: collection und data erforderlich.'});
        }

        const targetCollection = db.collection(collection);
        const result = await targetCollection.insertOne(data);
        res.status(201).json({message: 'Daten erfolgreich gespeichert', data: result.ops})
    } catch (error){
        console.error('Fehler beim Speichern der Daten: ', error);
        res.status(500).json({message: 'Fehler beim Speichern der Daten'});
    }
})

app.post('/changeTitleGame', async (req, res) => {
    try {

        const {accessToken, game, title, userId} = req.body;

        fetch('https://api.twitch.tv/helix/search/categories?query=' + game, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': ClientId
            }
        })
        .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
            return response.json();
        })
        .then(data => {
            let gameId = null;
            if(data.data[0] !== null && data.data[0] !== undefined){
                gameId = data.data[0].id;
            }
            let validGameId = true;
            if(gameId === null || gameId === undefined){
                validGameId = false;
            }
            let bodyData = null;
            if(validGameId && title){
                bodyData = {
                    game_id: gameId,
                    title: title
                };
            } else if(validGameId && !title){
                bodyData = {
                    game_id: gameId
                };
            } else if(!validGameId && title){
                bodyData = {
                    title: title
                };
            } else if(!validGameId && !title){
                res.status(201).json({message: 'Daten erfolgreich akzeptiert aber nicht gesetzt, da es nichts zum setzen gab.'});
                return;
            }
            fetch('https://api.twitch.tv/helix/channels?broadcaster_id=' + userId, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Client-Id': ClientId,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                })
                .then(response => {
                    if(!response.ok){
                        throw new Error('Anfrage fehlgeschlagen Aware');
                    }
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json();
                    } else {
                        return {};
                    }
                })
                .then(updatedUserData => {
                    console.log('Aktualisierte Daten:', updatedUserData);
                })
                .catch(error => {
                    console.error('Fehler beim Senden der Anfrage', error);
                });
                res.status(201).json({message: 'Daten erfolgreich gesetzt'});
        })
        .catch(error => {
            console.error('Fehler beim Getten des Games:', error);
            res.status(500).json({message: 'Fehler beim setzen der Informationen'});
        });
    } catch (error){
        console.error('Fehler beim setzen der Informationen: ', error);
        res.status(500).json({message: 'Fehler beim setzen der Informationen'});
    }
});

app.get('/userInformation', async (req, res) => {
    const channelId = req.query.channelId;
    if (channelId) {
      await mongoClient.connect();
      const db = mongoClient.db('marceybot');
      const collection = db.collection('userdata');
      const result = await collection.findOne({channelId: channelId});
      if(result === undefined || result === null){
        res.status(203).json({status: '203', message: 'not registered'});
        return;
      }
      res.status(201).json({status: '201', channelId: channelId, dateJoined: result.dateJoined, service: result.service, commandSymbol: result.commandSymbol, spotifyConnected: result.spotifyRefreshToken !== "invalid" && result.spotifyRefreshToken !== null && result.spotifyRefreshToken !== undefined, spotifyEmailConnected: result.spotifyEmailConnected, spotifyEmailRequested: result.spotifyEmailRequested, ttsCommandsEnabled: result.ttsCommandsEnabled, ttsChannelPointsEnabled: result.ttsChannelPointsEnabled});
    } else {
      res.status(400).json({status: '400', error: 'Channel Id fehlt'});
    }
});

app.get('/voiceSettings', async(req, res) => {
    const voiceId = req.query.id;
    if(!voiceId || voiceId === null || voiceId === undefined){
        res.status(205).json({status: '205', error: 'VoiceId is missing'});
        return;
    }
    if(voiceId){
        await mongoClient.connect();
        const db = mongoClient.db('marceybot');
        const collection = db.collection('aitts_voices');
        const result = await collection.findOne({id: voiceId});
        if(result === undefined || res === null){
            res.status(203).json({status: '203', message: 'invalid voice'});
            return;
        }
        if(!result.stability || result.stability === null || result.stability === undefined){
            res.status(203).json({status: '203', message: 'invalid voice'});
            return;
        }
        res.status(201).json({status: '201', stability: result.stability, similarity_boost: result.similarity_boost, style: result.style});
    } else {
        res.status(205).json({status: '205', error: 'VoiceId is missing'});
    }
});

app.get('/checkPassword', async (req, res) => {
    const password = req.query.password;
    /*Marcey Password*/
    if(password === "Ch3MKeAp6VmRWrEJpafmwHLewSm73aZKAXHiYYz69DFUxLJaKi"){
        res.status(201).json({status: '201', valid: true});
        return;
    } else if(password === "oNgFS3usUCmHboDu7iqFhJwy6ZCMkXtz8qEQOAxDsl8o8Canc8"){
        /*Melvin*/
        res.status(201).json({status: '201', valid: true});
        return;
    } else if(password === "9PDCaxKshg9HPbqiDbXv0w5aEcs7z5MxB4rPhnNmSsHVtZvzT5"){
        /*Kanyuji*/
        res.status(201).json({status: '201', valid: true});
        return;
    } else if(password === "1XdxqKUZrCWAhB3H6mw4gwmANZoRPvkySUE3aXzVkDu19aYSNb"){
        /*Kenjih*/
        res.status(201).json({status: '201', valid: true});
        return;
    } else if(password === "eSDA3ea1vV9rkqxmedDhzhNljkiGngmvbEZzlZh3xxl10epVWR"){
        /*lello*/
        res.status(201).json({status: '201', valid: true});
        return;
    } else {
        res.status(203).json({status: '203', valid: false});
    }
});

app.get('/aiTTSRequest', async (req, res) => {
    const code = req.query.code;
    if(code !== "lasfdjhaioi9wda78g8"){
        res.status(402).json({status: '400', error: 'Wrong Key'});
        return;
    }
    res.status(201).json({status: '201', code: "0938685e475f0b57e386b24e7d9788c7"});
});
app.get('/notifications', async (req, res) => {
    const channelId = req.query.channelId;
    if(!channelId || channelId === undefined || channelId === null) {
        res.status(204).json({status: '204', error: "no channelId given"});
        return;
    }
    await mongoClient.connect();
    const db = mongoClient.db('marceybot');
    const collection = db.collection('notifications');
    const documents = await collection.find({}).toArray();
    const jsonArray = documents.map(document => {
        return {
            title: document.title,
            titleFormatting: document.titleFormatting,
            description: document.description,
            image: document.image !== null ? document.image : "null",
            date: document.date
        };
    });
    res.status(201).json({status: '201', notifications: jsonArray});
});

app.get('/streamelements/register', async (req, res) => {
    
});

app.get('/currentTTS', async (req, res) => {
    const channelId = req.query.channelId;
    if(channelId === null){
        res.status(209).json({status: '209', error: 'No ChannelId provided'});
        return;
    }
    await mongoClient.connect();
    const db = mongoClient.db('marceybot');
    const collection = db.collection('aitts');
    const result = await collection.findOneAndDelete({channelId: channelId});
    if(result === null){
        res.status(203).json({status: '400', error: 'Nothing found'});
        return;
    }
    res.status(201).json({status: '201', text: result.text, username: result.username});
});
 
app.get('/commandInfo', async (req, res) => {
    const channelId = req.query.channelId;
    if (channelId) {
      await mongoClient.connect();
      const db = mongoClient.db('marceybot');
      const collection = db.collection('commands');
      const result = await collection.findOne({channelId: channelId});
      if(result === undefined || result === null){
        res.status(203).json({status: '203', commands: {}});
        return;
      }
      const commands = result.commands.map((commandString) => {
        const [command, output, description, enabled, role, requestType, userCooldown, globalCooldown, hideFromPublic, availability] = commandString.split('%#%');
        return {
            command,
            output,
            description,
            enabled,
            role,
            requestType,
            userCooldown,
            globalCooldown,
            hideFromPublic,
            availability
        };
      });
      const jsonResponse = {
        commands,
      };
      res.status(201).json({status: '201', channelId: channelId, commands: commands});
    } else {
      res.status(400).json({status: '400', error: 'Channel Id fehlt'});
    }
});

//Chat

wss.on('connection', (ws) => {
    console.log("Client verbunden");
    ws.send('Erfolgreich mit dem WebSocket verbunden.');
    ws.on('message', (message) => {
        console.log("Nachricht vom Client: " + message);
    });
    ws.on('close', () => {
        console.log('Client getrennt');
    });
});

app.get('/chatInformation', async (req, res) => {
    const userId = req.query.userId;
    const password = req.query.password;
    if(!userId || userId === undefined || userId === null || userId === ""){
        res.status(403).json({status: '403', error: 'target userid is invalid'});
        return;
    }
    if(!password || password === undefined || password === null || password === ""){
        res.status(403).json({status: '402', error: 'password is invalid'});
        return;
    }
    await mongoClient.connect();
    const db = mongoClient.db('marceybot');
    const collection = db.collection('chat');
    const result = await collection.findOne({userId: userId});
    if(!result || result === undefined || result === null){
        res.status(402).json({status: '402', error: 'user is not registered'});
        return;
    }
    if(result.password !== password){
        res.status(401).json({status: '401', error: 'password is wrong'});
        return;
    }
    var tabs = result.tabs.split(",").map(function(channelId) {
        return {
          channelId: channelId
        };
    });
    res.status(201).json({status: '201', userId: result.userId, displayname: result.displayname, access_token: result.access_token, refresh_token: result.refresh_token, tabsSize: result.tabsSite, tabs: tabs});
});

//start

app.listen(port, () => {
    console.log('Der Server läuft auf dem Port ${port} ...');
});