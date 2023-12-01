const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const {log, warning, debug, error, emptyLog} = require('./logger.js');
const {addUser, removeUser} = require("./botlogics.js");
const { getUserById, isChannelJoined } = require("./twitch.js");
const { ChatClient } = require("@twurple/chat");
const {getMongoClient} = require("./mongo.js");

function initHttpServer(){
    app.use(cors());
    app.use(express.json());
    server.listen(4525, () => log("Http-Server wurde auf dem Port 4525 gestartet."));
    return true;
}

app.get("/bot/join", async (req, res) => {
	try {
		let {channelId, accessToken, refreshToken} = req.query;
		if (!isValid(channelId) || !isValid(accessToken) || !isValid(refreshToken)) {
			res.status(221).json({ status: "221", error: "not all needed data given" });
			return;
		}
        await addUser(channelId, accessToken, refreshToken);
        res.status(201).json({status: "201", message: "Bot was successfully added"});
	} catch (error) {
		res.status(227).json({ status: "227", error: "unexpected error" });
		console.error(error);
	}
});

app.get("/bot/part", async (req, res) => {
	try {
		let {channelId} = req.query;
		if (!isValid(channelId) || !isValid(accessToken) || !isValid(refreshToken)) {
			res.status(221).json({ status: "221", error: "not all needed data given" });
			return;
		}
        await removeUser(channelId);
        res.status(201).json({status: "201", message: "Bot was successfully removed"});
	} catch (error) {
		res.status(227).json({ status: "227", error: "unexpected error" });
		console.error(error);
	}
});

app.get("/bot/joincheck", async (req, res) => {
    let channelId = req.query.channelId;
    if(!isValid(channelId)){
        res.status(220).json({status: "220", error: "channelId is invalid"});
        return;
    }
    let targetUser = await getUserById(channelId);
    let channelName = targetUser.display_name;
    if(!isValid(channelName)){
        res.status(221).json({status: "221", error: "cannot get name from channelId"});
        return;
    }
    let isJoined = isChannelJoined(channelName);
    if(isJoined){
        await getMongoClient().connect();
	    const targetCollection = getMongoClient()
		.db("marceybot")
		.collection("accounts");
	    const result = await targetCollection.findOne({ twitchChannelId: channelId });
        res.status(201).json({status: "201", joined: true, dateJoined: result.dateJoined});
    } else res.status(203).json({status: "203", joined: false});
});

function isValid(str) {
	return str && str !== null && str !== undefined;
}

module.exports = {initHttpServer};