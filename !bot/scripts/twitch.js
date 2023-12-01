let { getMongoClient } = require("./mongo.js");
const { log, warning, debug, error, emptyLog } = require("./logger.js");
const {
	RefreshingAuthProvider,
	StaticAuthProvider,
	AppTokenAuthProvider,
} = require("@twurple/auth");
const { ChatClient } = require("@twurple/chat");
const { ApiClient } = require("@twurple/api");
const {
	DirectConnectionAdapter,
	EventSubHttpListener,
	ReverseProxyAdapter,
} = require("@twurple/eventsub-http");
const { PubSubClient } = require("@twurple/pubsub");
const fs = require("fs");
const { userInfo } = require("os");
const { versionData } = require("./data.js");
const { MongoChangeStreamError } = require("mongodb");

//Twitch Daten
let marceyBotInfo = null;
let twitchTokens = {};
let authProvider = null;
let eventAuthProvider = null;
let chatClient = null;
let apiClient = null;
let eventListener = null;
let pubSubClient = null;

let joinedChannels = [];

async function getMarceyBotInfos() {
	await getMongoClient().connect();
	const targetCollection = getMongoClient()
		.db("marceybot")
		.collection("accounts");
	const result = await targetCollection.findOne({ username: "MarceyBot" });
	return {
		email: result.email,
		password: result.password,
		username: result.username,
		twitchAccessToken: result.twitchAccessToken,
		twitchRefreshToken: result.twitchRefreshToken,
		spotifyAccessToken: result.spotifyAccessToken,
		spotifyRefreshToken: result.spotifyRefreshToken,
		twitchClientId: result.twitchClientId,
		twitchClientSecret: result.twitchClientSecret,
		token: result.token,
	};
}

async function getAccount(accountName) {
	await getMongoClient().connect();
	const targetCollection = getMongoClient()
		.db("marceybot")
		.collection("accounts");
	const result = await targetCollection.findOne({ username: accountName });
	return result;
}

async function getTokens(marceyBotInfo, refresh) {
	if (!refresh) {
		return {
			access_token: marceyBotInfo.twitchAccessToken,
			refresh_token: marceyBotInfo.twitchRefreshToken,
			clientId: marceyBotInfo.twitchClientId,
			clientSecret: marceyBotInfo.twitchClientSecret,
		};
	}
	await getMongoClient().connect();
	const targetCollection = getMongoClient()
		.db("marceybot")
		.collection("accounts");
	const result = await targetCollection.findOne({ username: "MarceyBot" });
	const params = new URLSearchParams();
	params.append("grant_type", "refresh_token");
	params.append("refresh_token", marceyBotInfo.twitchRefreshToken);
	params.append("client_id", marceyBotInfo.twitchClientId);
	params.append("client_secret", marceyBotInfo.twitchClientSecret);
	const twitchResponse = await fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		body: params,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
	if (!twitchResponse.ok) {
		error(
			"Twitch-Token Refresh hat nicht funktioniert, Response: " +
				twitchResponse.json()
		);
		return;
	}
	const twitchJsonResponse = await twitchResponse.json();
	const updatedResult = await targetCollection.updateOne(
		{ username: "MarceyBot" },
		{
			$set: {
				twitchAccessToken: twitchJsonResponse.access_token,
				twitchRefreshToken: twitchJsonResponse.refresh_token,
			},
		}
	);
	return {
		access_token: twitchJsonResponse.access_token,
		refresh_token: twitchJsonResponse.refresh_token,
		expiresIn: 0,
		obtainmentTimestamp: 0,
	};
}

async function updateTokens(userId, newTokenData) {
	debug(" ");
	debug("Twitch-Token von " + userId + " wurde erneuert. Speicherung...");
	try {
		let targetCollection = getMongoClient()
			.db("marceybot")
			.collection("accounts");
		await targetCollection.updateOne(
			{ twitchRefreshToken: newTokenData.refreshToken },
			{ $set: { twitchAccessToken: newTokenData.accessToken } }
		);
		twitchTokens[userId === "790570730" ? "marceybot" : userId] = {
			access_token: newTokenData.accessToken,
			refresh_token: newTokenData.refreshToken,
			expiresIn: newTokenData.expiresIn,
			obtainmentTimestamp: newTokenData.obtainmentTimestamp,
		};
		debug("Twitch-Token von " + userId + " erfolgreich gespeichert.");
	} catch (err) {
		error("Twitch-Token von " + userId + " konnte nicht gespeichert werden.");
		error(err);
	}
}

async function startTwitchBot() {
	return new Promise(async (resolve) => {
		marceyBotInfo = await getMarceyBotInfos();
		twitchTokens["marceybot"] = await getTokens(marceyBotInfo, true);
		let twitchClientId = marceyBotInfo.twitchClientId;
		let twitchClientSecret = marceyBotInfo.twitchClientSecret;
		authProvider = new RefreshingAuthProvider({
			clientId: twitchClientId,
			clientSecret: twitchClientSecret,
		});
		authProvider.onRefresh(async (userId, newTokenData) => {
			updateTokens(userId, newTokenData);
		});
		debug("Token-Info: " + twitchTokens["marceybot"]);
		await authProvider.addUser(
			"790570730",
			{
				accessToken: twitchTokens["marceybot"].access_token,
				refreshToken: twitchTokens["marceybot"].refresh_token,
				expiresIn: twitchTokens["marceybot"].expiresIn,
				obtainmentTimestamp: twitchTokens["marceybot"].obtainmentTimestamp,
			},
			["chat"]
		);
		pubSubClient = new PubSubClient({ authProvider });
		chatClient = new ChatClient({
			authProvider,
			channels: ["MarceyBot", "Marcey____"],
		});
		await chatClient.connect();
		chatClient.onAuthenticationSuccess(async () => {
			if (twitchBotStarted) return;
			twitchBotStarted = true;
			await registerChatEvents();
			apiClient = new ApiClient({ authProvider: authProvider });
			let certVal = null;
			let privkeyVal = null;
			fs.readFile(
				"/etc/letsencrypt/live/event.marceybot.de/cert.pem",
				"utf8",
				function (err, data) {
					certVal = data;
				}
			);
			fs.readFile(
				"/etc/letsencrypt/live/event.marceybot.de/privkey.pem",
				"utf8",
				function (err, data) {
					privkeyVal = data;
				}
			);
			const eventSecret = "0PwcKNjphgqzMOpHT1VWGN5bkMa0dbqPU7bJYSmqyNVwnwmDcu";
			eventListener = new EventSubHttpListener({
				apiClient,
				adapter: new ReverseProxyAdapter({
					hostName: "event.marceybot.de",
					port: 8142,
				}),
				secret: eventSecret,
			});
			eventListener.start();
			joinChannels();
			resolve(true);
		});
	});
}

let twitchBotStarted = false;

async function joinChannels() {
	await getMongoClient().connect();
	const targetCollection = await getMongoClient()
		.db("marceybot")
		.collection("accounts");
	const resultList = await targetCollection.find({}).toArray();
	resultList.map(async (result) => {
		try {
			let channelId = result.twitchChannelId;
			let accessToken = result.twitchAccessToken,
				refreshToken = result.twitchRefreshToken;
			if (channelId === null || channelId === undefined || !channelId) {
				let user = await getUser(accessToken);
				joinChannelNew(user.id, accessToken, refreshToken);
			} else {
				joinChannelNew(channelId, accessToken, refreshToken);
			}
		} catch (err) {
            //ignored
		}
	});
}

async function getUser(accessToken) {
	try {
		const response = await fetch("https://api.twitch.tv/helix/users", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + accessToken,
				"Client-Id": marceyBotInfo.twitchClientId,
			},
		});
		if (!response.ok) {
			return null;
		}
		const data = await response.json();
		return data.data[0];
	} catch (err) {
		error("Error:", err);
		throw err;
	}
}

async function getUserById(id) {
	const response = await fetch("https://api.twitch.tv/helix/users?id=" + id, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + twitchTokens["790570730"].access_token,
			"Client-Id": marceyBotInfo.twitchClientId,
		},
	});
	if (!response.ok) {
		return null;
	}
	const data = await response.json();
	return data.data[0];
}

async function getUserByName(name) {
	const response = await fetch("https://api.twitch.tv/helix/users?login=" + id, {
		method: "GET",
		headers: {
			Authorization: "Bearer " + twitchTokens["790570730"].access_token,
			"Client-Id": marceyBotInfo.twitchClientId,
		},
	});
	if (!response.ok) {
		return null;
	}
	const data = await response.json();
	return data.data[0];
}

async function registerChatEvents() {
	chatClient.onMessage(async (channel, user, text, msg) => {
		if (text === "!testcommand") {
			chatClient.say(channel, `@${user}, moiner haha`);
			return;
		}
		debug(`[${channel}] (${user}): ${text} Objekt: ${msg}`);
	});
}

async function registerListenerEvents(user) {
	eventListener.onChannelPredictionBegin(user.id, (e) => {
		log("d");
		log("Prediction started");
		log(e);
		try {
			log(e.json());
		} catch (error) {}
	});
}

async function registerPubSubEvents(user) {
	pubSubClient.onRedemption(user.id, (message) => {
		console.log(message);
	});
}

/* Instant Methods */

async function sendMessage(channel, text) {
	chatClient.say(channel, text);
}

async function joinChannel(channel) {
	await chatClient.join(channel + "");
    let isInList = false;
    for(let i = 0; i < joinedChannels.length; i++){
        if(joinedChannels[i].toLowerCase() === channel.toLowerCase()){
            isInList = true;
        }
    }
    if(!isInList){
        joinedChannels[joinedChannels.length] = channel;
    }
}

async function joinChannelNew(
	channelId,
	twitchAccessToken,
	twitchRefreshToken
) {
	if (channelId === null || channelId === undefined || !channelId) {
		error("joinChannelNew function runned but channelId is null");
		return;
	}
	twitchTokens[channelId] = {
		access_token: twitchAccessToken,
		refresh_token: twitchRefreshToken,
		expiresIn: 0,
		obtainmentTimestamp: 0,
	};
	await authProvider.addUser(channelId, {
		accessToken: twitchTokens[channelId].access_token,
		refreshToken: twitchTokens[channelId].refresh_token,
		expiresIn: twitchTokens[channelId].expiresIn,
		obtainmentTimestamp: twitchTokens[channelId].obtainmentTimestamp,
	});
	const targetUser = await getUserById(channelId);
	await joinChannel(targetUser.display_name);
	log(
		"Events werden registriert vom User " +
			targetUser.display_name +
			" (" +
			targetUser.id +
			")"
	);
	registerListenerEvents(targetUser);
	registerPubSubEvents(targetUser);
	log(
		"Events wurden erfolgreich registriert vom User " +
			targetUser.display_name +
			" (" +
			targetUser.id +
			")"
	);
}

async function leaveChannel(channel) {
	chatClient.part(channel);
	const targetUser = await getUserByName(channel);
	authProvider.removeUser(targetUser);
    let isInList = false;
    let listPosition = 0;
    for(let i = 0; i < joinedChannels.length; i++){
        if(joinedChannels[i].toLowerCase() === channel.toLowerCase()){
            isInList = true;
            listPosition = i;
        }
    }
    if(isInList){
        joinedChannels[joinedChannels.length] = channel;
        joinedChannels.splice(listPosition, 1);
    }
}

function isChannelJoined(channelName){
    let isJoined = false;
    for(let i = 0; i < joinedChannels.length; i++){
        if(joinedChannels[i].toLowerCase() === channelName.toLowerCase()){
            isJoined = true;
        }
    }
    return isJoined;
}

function isValid(str) {
	return str && str !== null && str !== undefined;
}

module.exports = {
	getMarceyBotInfos,
	getTokens,
	startTwitchBot,
	sendMessage,
	joinChannel,
	leaveChannel,
	apiClient,
	joinChannelNew,
    getUserById,
    isChannelJoined,
    getUserByName,
    getAccount
};
