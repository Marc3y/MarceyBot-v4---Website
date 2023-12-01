const express = require("express");
const app = express();
const cors = require("cors");
const { userInfo } = require("os");
var nodemailer = require('nodemailer');
const { channel } = require("diagnostics_channel");
var MongoClient = require("mongodb").MongoClient;
const server = require("http").createServer(app);
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

app.get("/test", (req, res) => res.send("Successfully"));

var ClientId = "wp60awg1ifrh899hwmzjb06kzl8i5h";
var ClientSecret = "8gihd9wqc1boj47c6mn1ntuvdx5z1t";

const mongoClient = new MongoClient(
	"mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'marceybot1@gmail.com',
		pass: 'oibxdnzpdjnufwvn'
	}
});

function sendVerifyEmail(username, targetEmail, verifyCode){
	var mailOptions = {
		from: 'marceybot1@gmail.com',
		to: targetEmail,
		subject: 'Bestätigen Sie ihre Email-Adresse',
		html: "<h1>Hey " + username + ",</h1> <p>Es wird gerade versucht, sich mit dieser Email-Adresse bei MarceyBot zu registrieren.</p> "
		+ "<p>Ihr Bestätigungscode:</p> <h2>" + verifyCode + "</h2> <br /> Falls Sie sich nicht versuchen anzumelden, ignorieren Sie diese E-Mail. <p> Diese E-Mail wurde automatisch von einem MarceyBot-Dienst geschickt. Bitte antworten Sie nicht auf diese E-Mail. </p> <img src=\"https://i.ibb.co/v3F5djc/marceybot3.png\" width=\"70\" height=\"50\"/>",
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.error(error);
		} else {
			console.log("Bestätigungs-Email wurde gesendet (" + username + ", " + targetEmail + "): " + info.response);
		}
	})
}

app.use(
	cors({
		origin: [
			"https://marceybot.de",
			"https://chat.marceybot.de",
			"https://login.marceybot.de",
			"https://register.marceybot.de",
		],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);

app.use(express.json());

server.listen(3001, () => console.log(`Listening on port 3001`));

app.post("/saveData", async (req, res) => {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");

		console.log(req.body);

		const { collection, data } = req.body;

		console.log(collection);
		console.log(data);

		if (!collection || !data) {
			return res.status(400).json({
				message: "Ungültige Anfrage: collection und data erforderlich.",
			});
		}

		const targetCollection = db.collection(collection);
		const result = await targetCollection.insertOne(data);
		res
			.status(201)
			.json({ message: "Daten erfolgreich gespeichert", data: result.ops });
	} catch (error) {
		console.error("Fehler beim Speichern der Daten: ", error);
		res.status(500).json({ message: "Fehler beim Speichern der Daten" });
	}
});

app.get("/tts/information", async (req, res) => {
	try {
		let channelId = req.query.channelId,
		id = req.query.id;
		if (!isValid(channelId) && !isValid(id)) {
			res.status(221).json({ status: "221", error: "no channelId or id given" });
			return;
		}
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("tts_settings");
		let isChannelId = isValid(channelId);
		let result = null;
		if(isChannelId){
			result = await targetCollection.findOne({ userId: channelId });
		} else result = await targetCollection.findOne({ id: id });
		if (!isValid(result)) {
			res.status(230).json({ status: "230", error: "not authorized" });
			return;
		}
		res.status(203).json({
			status: "203",
			userId: result.userId,
			enabled: result.enabled,
			uniqueId: result.uniqueId,
			charactersUsed: result.charactersUsed,
			speed: result.speed,
			pitch: result.pitch,
			volume: result.volume,
			descriptionColor: result.descriptionColor,
			titleColor: result.titleColor,
		});
	} catch (error) {
		res.status(227).json({ status: "227", error: "something happened idk" });
		console.error(error);
	}
});

app.get('/converter', async (req, res) => {
	let format = req.query.format,
	url = req.query.url;
	if(!isValid(url) || !isValid(format)){
		res.status(405).json({status: "405", error: "url or format is empty"});
		return;
	}
	let stream = await ytdl(url).pipe(fs.createWriteStream(generateUniqueCode(30) + ".mp4"));
	res.status(203).json({status: "203", video: stream});
});



function getBestQualityMp4(info){
	 const itags = [38, 85, 37, 84, 22, 83, 82, 18];
	 const formats = info.formats;
	 let bestFormat = null;
	 let hasAudio = info.hasAudio;
	 let hasVideo = info.hasVideo;
	 for (let i = 0; i < itags.length; i++) {
	   let itag = itags[i];
	   for (let j = 0; j < formats.length; j++) {
		 let format = formats[j];
		 if(hasAudio && format.hasAudio === false) continue;
		 if(hasVideo && format.hasVideo === false) continue;
		 if (format.container === "mp4" && format.itag === itag) {
		   bestFormat = format;
		   break;
		 }
	   }
	   if (bestFormat) {
		 break;
	   }
	 }
	 return bestFormat;
}


app.get("/tts/settings", async (req, res) => {
	try {
		let channelId = req.query.channelId,
		titleColor = req.query.titleColor,
		descriptionColor = req.query.descriptionColor;
		if (!channelId || channelId === undefined || channelId === null) {
			res.status(221).json({ status: "221", error: "no channelId given" });
			return;
		}
		if(!isValid(titleColor) || !isValid(descriptionColor)){
			res.status(222).json({ status: "221", error: "not all data given" });
			return;
		}
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("tts_settings");
		const result = await targetCollection.updateOne({userId: channelId}, {$set: {titleColor: "#" + titleColor, descriptionColor: "#" + descriptionColor}});
		if (!result || result === undefined || result === null) {
			res.status(230).json({ status: "230", error: "not authorized" });
			return;
		}
		res.status(203).json({
			status: "203",
			message: "successfully updated"
		});
	} catch (error) {
		res.status(227).json({ status: "227", error: "something happened idk" });
		console.error(error);
	}
});

app.get("/tts/idToChannel", async (req, res) => {
	try {
		let id = req.query.id;
		if (!id || id === undefined || id === null) {
			res.status(221).json({ status: "221", error: "no id given" });
			return;
		}
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("tts_settings");
		const result = await targetCollection.findOne({ uniqueId: id });
		if (!result || result === undefined || result === null) {
			res.status(230).json({ status: "230", error: "not authorized" });
			return;
		}
		res.status(203).json({
			status: "203",
			userId: result.userId
		});
	} catch (error) {
		res.status(227).json({ status: "227", error: "something happened idk" });
		console.error(error);
	}
});

app.get("/urlshorter/url", async (req, res) => {
	try {
		let id = req.query.c;
		if (!id || id === undefined || id === null) {
			res.status(221).json({ status: "221", error: "no id (c) given" });
			return;
		}
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("url_shorter");
		const result = await targetCollection.findOne({ id: id });
		if (result === null) {
			res.status(205).json({ status: "205", error: "no url connected" });
			return;
		}
		const validResult = await targetCollection.findOne({key: "valids"});
		let valids = null;
		if(validResult !== null){
			valids = validResult.valids.split(' ');
		} else valids = [];
		let url = result.url + "";
		url = url.replace("https://", "");
		if(url.includes("/")){
			url = url.split("/")[0];
		}
		if(url.split(".").length >= 3){
			url = url.replace(url.split(".")[1] + "." + url.split(".")[2], "");
		}
		let isValid = false;
		valids.map(valid => {
			if(url === valid) isValid = true;
		});
		res.status(203).json({
			status: "203",
			url: result.url,
			created: result.created,
			trusted: isValid
		});
	} catch (error) {
		res.status(227).json({ status: "227", error: "something happened idk" });
		console.error(error);
	}
});

app.get("/urlshorter/seturl", async (req, res) => {
	try {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		console.log("1");
		let id = req.query.id,
		url = req.query.url;
		if (!isValid(url)) {
			console.log("2");
			res.status(205).json({ status: "205", error: "url is not given" });
			return;
		}

		const targetCollection = db.collection("url_shorter");

		if(!isValid(id)){
			console.log("3");
			id = generateShortUniqueId();
		} else {
			console.log("4");
			if(checkIfIdExistsInDatabase(id)){
				console.log("5");
				id = generateShortUniqueId();
			}
		}
		
		const result = await targetCollection.insertOne({id: id, url: url, created: getCurrentDateTime()});
		saveUsedId(id);
		res
			.status(201)
			.json({status: "201", message: "Url erfolgreich gespeichert"});
	} catch (error) {
		console.error("Fehler beim Speichern der Daten: ", error);
		res.status(500).json({ message: "Fehler beim Speichern der Daten" });
	}
});

let usedIds = [];

function checkIfIdExistsInDatabase(id){
	usedIds.map(currentId => {
		if(currentId === id) {
			return true;
		} 
	});
	return false;
}

function getCurrentDateTime() {
	const now = new Date();
  
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
  
	const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
	return formattedDateTime;
  }
  

function generateShortUniqueId() {
	let idLength = 4;
	let uuid = generateRandomString(idLength);
	if(checkIfIdExistsInDatabase(uuid)){
		console.log("id " + uuid + " existiert bereits, neue id wird generiert");
		return generateShortUniqueId();
	} else {
		console.log("id " + uuid + " existert nicht also passt");
		return uuid;
	}
}

function generateRandomString(length) {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = '';
	for (let i = 0; i < length; i++) {
	  const randomIndex = Math.floor(Math.random() * characters.length);
	  result += characters.charAt(randomIndex);
	}
	return result;
}

app.get("/tts/update", async (req, res) => {
	try {
		let channelId = req.query.channelId,
			enabled = req.query.enabled,
			speed = req.query.speed,
			pitch = req.query.pitch,
			volume = req.query.volume;
		if (!isValid(channelId)) {
			res.status(260).json({ status: "260", error: "channelId is not given" });
			return;
		}
		const d = { userId: channelId };
		if (isValid(enabled)) {
			d.enabled = enabled;
		}
		if (isValid(speed)) {
			d.speed = speed;
		}
		if (isValid(pitch)) {
			d.pitch = pitch;
		}
		if (isValid(volume)) {
			d.volume = volume;
		}
		const data = JSON.stringify(d);
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("tts_settings");
		console.log({ $set: d });
		const result = await targetCollection.updateOne(
			{ userId: channelId },
			{ $set: d }
		);
		res.status(203).json({ status: "203", message: "successfully updated" });
	} catch (error) {
		console.error(error);
	}
});

function getUUID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

function isValid(str) {
	return str && str !== null && str !== undefined;
}

app.get("/tts/set", async (req, res) => {
	try {
		let userId = req.query.userId;
		let uniqueId = req.query.uniqueId;
		if (!userId || !uniqueId) {
			res.status(300).json({ status: "300", error: "not all data given" });
			return;
		}
		await mongoClient.connect();
		const targetCollection = mongoClient
			.db("marceybot")
			.collection("tts_settings");
		const data = {
			userId: userId,
			charactersUsed: "0",
			uniqueId: uniqueId,
			enabled: "false",
			speed: "0",
			pitch: "0",
			volume: "0",
			titleColor: "#A538FF",
			descriptionColor: "#ffffff",
		};
		const result = await targetCollection.insertOne(data);
		res.status(203).json({ status: "203", message: "Erfolgreich eingetragen" });
	} catch (error) {
		console.error(error);
		res.status(305).json({ status: "305", error: "unexpected error" });
	}
});

app.get("/tts/current", async (req, res) => {
	try {
		const uniqueId = req.query.uniqueId;
		if (!uniqueId) {
			res.status(400).json({ status: "400", error: "uniqueId is missing" });
			return;
		}

		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		const collection = db.collection("tts");
		const result = await collection.findOneAndDelete({ id: uniqueId });

        console.log(result);
        console.log("oki");

		if (result === null) {
            console.log("aber nicht oki");
			res
				.status(404)
				.json({ status: "404", error: "Not found in the database" });
			return;
		}

		const data = {
			id: result.id,
			channelId: result.channelId,
			username: result.username,
			message: result.message,
			speed: result.speed,
			pitch: result.pitch,
			volume: result.volume,
			titleColor: result.titleColor,
			descriptionColor: result.descriptionColor,
		};

		const options = {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTgyNmUwYjUtOTBiZC00MjliLWEyYzAtNTdkYmM4NTViNmEzIiwidHlwZSI6ImFwaV90b2tlbiJ9.PzCuYTX0xKeUw4DAWDwVNYjGTnEm2DUhjVLREQ3lFGw",
			},
			body: JSON.stringify({
				response_as_dict: true,
				attributes_as_list: false,
				show_original_response: false,
				settings: { amazon: "de-DE_Hans_Standard" },
				rate: parseInt(data.speed + ""),
				pitch: parseInt(data.pitch + ""),
				volume: parseInt(data.volume + ""),
				sampling_rate: 0,
				providers: "amazon",
				text: data.message,
				language: "de",
			})
		};

        fetch('https://api.edenai.run/v2/audio/text_to_speech', options)
        .then(response => response.json())
        .then(response => {
            res.status(200).json({status: "200", channelId: data.channelId, username: data.username, message: data.message, titleColor: data.titleColor, descriptionColor: data.descriptionColor, data: response});
            return;
        })
        .catch(err => {
            res.status(250).json({ status: "250", error: "unexcpected error or something idk"});
            console.error(err);
        });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "500", error: "Internal Server Error" });
	}
});

app.get("/tts/code", async (req, res) => {
	const code = req.query.code;
	if (code !== "lasfdjhaioi9wda78g8") {
		res.status(402).json({ status: "400", error: "Wrong Key" });
		return;
	}
	res
		.status(201)
		.json({
			status: "201",
			code: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTgyNmUwYjUtOTBiZC00MjliLWEyYzAtNTdkYmM4NTViNmEzIiwidHlwZSI6ImFwaV90b2tlbiJ9.PzCuYTX0xKeUw4DAWDwVNYjGTnEm2DUhjVLREQ3lFGw",
		});
});

app.get("/accounts/register", async (req, res) => {
	try {
		let email = req.query.email,
			password = req.query.password,
			username = req.query.username,
			twitchAccessToken = req.query.twitchAccessToken,
			twitchRefreshToken = req.query.twitchRefreshToken,
			spotifyAccessToken = req.query.spotifyAccessToken,
			spotifyRefreshToken = req.query.spotifyRefreshToken;

		if (
			!email ||
			!password ||
			!username ||
			!twitchAccessToken ||
			!twitchRefreshToken ||
			!spotifyAccessToken ||
			!spotifyRefreshToken
		) {
			res.status(402).json({
				status: "402",
				error: "Error bei Registrierung: Mehr Daten benötigt",
			});
			return;
		}

		let data = {
			username: username,
			email: email,
			password: password,
			twitchAccessToken: twitchAccessToken,
			twitchRefreshToken: twitchRefreshToken,
			spotifyAccessToken: spotifyAccessToken,
			spotifyRefreshToken: spotifyRefreshToken,
		};

		await mongoClient.connect();
		const targetCollection = mongoClient.db("marceybot").collection("accounts");
		const result = await targetCollection.insertOne(data);
		res.status(201).json({ status: "201", message: "" });
	} catch (error) {
		console.error("Fehler bei der Registrierung: " + error);
		res.status(403).json({ status: "403", error: "Error bei Registrierung" });
	}
});

app.get("/accounts/login", async (req, res) => {
	try {
		let email = req.query.email,
			username = req.query.username,
			password = req.query.password,
			token = req.query.token;

		if ((email === undefined && username === undefined && token === null)) {
			res.status(210).json({
				status: "210",
				error: "Error beim Login: Email, Username, Token or Password empty",
			});
			return;
		}


		await mongoClient.connect();
		const targetCollection = mongoClient.db("marceybot").collection("accounts");

		let isUsername =
			username !== null && username !== undefined && username !== "";

		let isToken = isValid(token);

		if(!isToken && !isValid(password)){
			res.status(210).json({status: "210", error: "password is empty"});
			return;
		}

		let result = null;
		if (isUsername) {
			result = await targetCollection.findOne({ username: username });
		} else if(isToken){
			result = await targetCollection.findOne({token: token});
		} else result = await targetCollection.findOne({ email: email });
		if(result === null){
			res.status(207).json({status: "207", error: "no account found"});
			return;
		}
		if(!isToken){
			if (result.password !== password) {
				res.status(206).json({ status: "206", message: "Wrong password" });
				return;
			}
			res.status(201).json({ status: "201", message: "success", result });
		} else {
			res.status(201).json({ status: "201", message: "success", result });
		}
	} catch (error) {
		console.error("Fehler beim Login: " + error);
		res.status(211).json({ status: "211", error: "Error beim Login" });
	}
});

app.post("/changeTitleGame", async (req, res) => {
	try {
		const { accessToken, game, title, userId } = req.body;

		fetch("https://api.twitch.tv/helix/search/categories?query=" + game, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + accessToken,
				"Client-Id": ClientId,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Anfrage fehlgeschlagen");
				}
				return response.json();
			})
			.then((data) => {
				let gameId = null;
				if (data.data[0] !== null && data.data[0] !== undefined) {
					gameId = data.data[0].id;
				}
				let validGameId = true;
				if (gameId === null || gameId === undefined) {
					validGameId = false;
				}
				let bodyData = null;
				if (validGameId && title) {
					bodyData = {
						game_id: gameId,
						title: title,
					};
				} else if (validGameId && !title) {
					bodyData = {
						game_id: gameId,
					};
				} else if (!validGameId && title) {
					bodyData = {
						title: title,
					};
				} else if (!validGameId && !title) {
					res.status(201).json({
						message:
							"Daten erfolgreich akzeptiert aber nicht gesetzt, da es nichts zum setzen gab.",
					});
					return;
				}
				fetch("https://api.twitch.tv/helix/channels?broadcaster_id=" + userId, {
					method: "PATCH",
					headers: {
						Authorization: "Bearer " + accessToken,
						"Client-Id": ClientId,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bodyData),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Anfrage fehlgeschlagen Aware");
						}
						const contentType = response.headers.get("content-type");
						if (contentType && contentType.includes("application/json")) {
							return response.json();
						} else {
							return {};
						}
					})
					.then((updatedUserData) => {
						console.log("Aktualisierte Daten:", updatedUserData);
					})
					.catch((error) => {
						console.error("Fehler beim Senden der Anfrage", error);
					});
				res.status(201).json({ message: "Daten erfolgreich gesetzt" });
			})
			.catch((error) => {
				console.error("Fehler beim Getten des Games:", error);
				res
					.status(500)
					.json({ message: "Fehler beim setzen der Informationen" });
			});
	} catch (error) {
		console.error("Fehler beim setzen der Informationen: ", error);
		res.status(500).json({ message: "Fehler beim setzen der Informationen" });
	}
});

app.get("/userInformation", async (req, res) => {
	const channelId = req.query.channelId;
	if (channelId) {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		const collection = db.collection("userdata");
		const result = await collection.findOne({ channelId: channelId });
		if (result === undefined || result === null) {
			res.status(203).json({ status: "203", message: "not registered" });
			return;
		}
		res.status(201).json({
			status: "201",
			channelId: channelId,
			dateJoined: result.dateJoined,
			service: result.service,
			commandSymbol: result.commandSymbol,
			spotifyConnected:
				result.spotifyRefreshToken !== "invalid" &&
				result.spotifyRefreshToken !== null &&
				result.spotifyRefreshToken !== undefined,
			spotifyEmailConnected: result.spotifyEmailConnected,
			spotifyEmailRequested: result.spotifyEmailRequested,
			ttsCommandsEnabled: result.ttsCommandsEnabled,
			ttsChannelPointsEnabled: result.ttsChannelPointsEnabled,
		});
	} else {
		res.status(400).json({ status: "400", error: "Channel Id fehlt" });
	}
});

app.get("/voiceSettings", async (req, res) => {
	const voiceId = req.query.id;
	if (!voiceId || voiceId === null || voiceId === undefined) {
		res.status(205).json({ status: "205", error: "VoiceId is missing" });
		return;
	}
	if (voiceId) {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		const collection = db.collection("aitts_voices");
		const result = await collection.findOne({ id: voiceId });
		if (result === undefined || res === null) {
			res.status(203).json({ status: "203", message: "invalid voice" });
			return;
		}
		if (
			!result.stability ||
			result.stability === null ||
			result.stability === undefined
		) {
			res.status(203).json({ status: "203", message: "invalid voice" });
			return;
		}
		res.status(201).json({
			status: "201",
			stability: result.stability,
			similarity_boost: result.similarity_boost,
			style: result.style,
		});
	} else {
		res.status(205).json({ status: "205", error: "VoiceId is missing" });
	}
});

app.get("/checkPassword", async (req, res) => {
	const password = req.query.password;
	/*Marcey Password*/
	if (password === "Ch3MKeAp6VmRWrEJpafmwHLewSm73aZKAXHiYYz69DFUxLJaKi") {
		res.status(201).json({ status: "201", valid: true });
		return;
	} else if (
		password === "oNgFS3usUCmHboDu7iqFhJwy6ZCMkXtz8qEQOAxDsl8o8Canc8"
	) {
		/*Melvin*/
		res.status(201).json({ status: "201", valid: true });
		return;
	} else if (
		password === "9PDCaxKshg9HPbqiDbXv0w5aEcs7z5MxB4rPhnNmSsHVtZvzT5"
	) {
		/*Kanyuji*/
		res.status(201).json({ status: "201", valid: true });
		return;
	} else if (
		password === "1XdxqKUZrCWAhB3H6mw4gwmANZoRPvkySUE3aXzVkDu19aYSNb"
	) {
		/*Kenjih*/
		res.status(201).json({ status: "201", valid: true });
		return;
	} else if (
		password === "eSDA3ea1vV9rkqxmedDhzhNljkiGngmvbEZzlZh3xxl10epVWR"
	) {
		/*lello*/
		res.status(201).json({ status: "201", valid: true });
		return;
	} else {
		res.status(203).json({ status: "203", valid: false });
	}
});

app.get('/email/verification', async (req, res) => {
	const email = req.query.email,
	password = req.query.password,
	username = req.query.username,
	accessToken = req.query.accessToken,
	refreshToken = req.query.refreshToken;
	if(!isValid(email) || !isValid(password) || !isValid(username) || !isValid(accessToken) || !isValid(refreshToken)) {
		res.status(300).json({status: "300", error: "not all needed data given"});
		return;
	}
	let code = generateRandomCode();
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("email_verifications");
	const document = await collection.findOne({email: email});
	if(document === null || document === undefined){
		const result = await collection.insertOne({email: email, code: code, password: password, 
		username: username, twitchAccessToken: accessToken, twitchRefreshToken: refreshToken});
	} else {
		const updatedResult = await collection.updateOne(
			{ email: email },
			{ $set: {
				code: code,
				username: username,
				password: password,
				twitchAccessToken: accessToken,
				twitchRefreshToken: refreshToken,
			}}
		);
	}
	sendVerifyEmail(username, email, code);
	res.status(201).json({status: '201', message: 'successfully created verification code'});
});

app.get('/email/verificationcheck', async (req, res) => {
	const email = req.query.email,
	code = req.query.code;
	if(!isValid(email) || !isValid(code)) {
		res.status(300).json({status: "300", error: "not all needed data given"});
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("email_verifications");
	const document = await collection.findOne({email: email});
	if(document === null || document === undefined){
		res.status(205).json({status: "205", valid: false});
		return;
	}
	if(document.code !== code){
		res.status(205).json({status: "205", valid: false});
		return;
	}
	res.status(201).json({status: "201", valid: true});
});

app.get('/email/availability', async (req, res) => {
	const email = req.query.email;
	if(!isValid(email)){
		res.status(300).json({status: "300", error: "not all data given"});
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("accounts");
	const document = await collection.findOne({email: email});
	if(document === null || document === undefined){
		res.status(201).json({status: "201", message: "Email is available"});
		return;
	}
	res.status(205).json({status: "205", message: "Email is used"});
});

app.get('/username/availability', async (req, res) => {
	const username = req.query.username;
	if(!isValid(username)){
		res.status(300).json({status: "300", error: "not all data given"});
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("accounts");
	const document = await collection.findOne({username: username});
	if(document === null || document === undefined){
		res.status(201).json({status: "201", message: "Username is available"});
		return;
	}
	res.status(205).json({status: "205", message: "Username is used"});
});

app.get('/email/finalregister', async (req, res) => {
	const email = req.query.email,
	code = req.query.code;
	if(!isValid(email) || !isValid(code)) {
		res.status(300).json({status: "300", error: "not all needed data given"});
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("email_verifications");
	const document = await collection.findOne({email: email});
	if(document === null || document === undefined){
		res.status(205).json({status: "205", valid: false});
		return;
	}
	if(document.code !== code){
		res.status(205).json({status: "205", valid: false});
		return;
	}
	let password = document.password,
	username = document.username,
	twitchAccessToken = document.twitchAccessToken,
	twitchRefreshToken = document.twitchRefreshToken,
	spotifyAccessToken = "invalid",
	spotifyRefreshToken = "invalid";
	const loginCollection = db.collection("accounts");
	const result = await loginCollection.insertOne({
		email: email,
		password: password,
		username: username,
		twitchAccessToken: twitchAccessToken,
		twitchRefreshToken: twitchRefreshToken,
		spotifyAccessToken: spotifyAccessToken,
		spotifyRefreshToken: spotifyRefreshToken,
		token: generateUniqueCode(100),
	});
	res.status(201).json({status: "201", message: "successfully registered"});
});



function generateUniqueCode(length) {
	const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	let code = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
	  const randomIndex = Math.floor(Math.random() * charactersLength);
	  code += characters.charAt(randomIndex);
	}
	return code;
}

app.get('/twitch/token', async (req, res) => {
	try {
		let code = req.query.code;
		if(!isValid(code)){
			res.status(300).json({status: "300", error: "invalid code"});
			return;
		}
		
		fetch("https://id.twitch.tv/oauth2/token?client_id=t55uv95nvcb3i5mglyxizr1dv6m65r&client_secret=sb48xbinhni2jsgaysclfe3io6mabe&code=" + code
		+ "&grant_type=authorization_code&redirect_uri=http://localhost", {
			method: "POST"
		}).then(response => response.json())
		.then(async data => {
			if(data.access_token === null || data.refresh_token === null || data.access_token === undefined || data.refresh_token === undefined 
				|| !data.access_token || !data.refresh_token){
				res.status(205).json({status: "205", error: "probably invalid code, twitch token get not worked"});
				return;
			}
			res.status(203).json({status: "203", access_token: data.access_token, refresh_token: data.refresh_token});
			return;
		}).catch(error => {
			console.error(error);
			res.status(210).json({status: "210", error: "something happened idk"});
		})	
	} catch (error) {
		res.status(211).json({status: "211", error: "something happened idk"});
		console.error(error);
		return;
	}
});

function generateRandomCode() {
	const min = 100000;
	const max = 999999;
	const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
	return randomCode.toString();
}

app.get("/aiTTSRequest", async (req, res) => {
	const code = req.query.code;
	if (code !== "lasfdjhaioi9wda78g8") {
		res.status(402).json({ status: "400", error: "Wrong Key" });
		return;
	}
	res
		.status(201)
		.json({ status: "201", code: "0938685e475f0b57e386b24e7d9788c7" });
});

app.get("/notifications", async (req, res) => {
	const channelId = req.query.channelId;
	if (!channelId || channelId === undefined || channelId === null) {
		res.status(204).json({ status: "204", error: "no channelId given" });
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("notifications");
	const documents = await collection.find({}).toArray();
	const jsonArray = documents.map((document) => {
		return {
			title: document.title,
			titleFormatting: document.titleFormatting,
			description: document.description,
			image: document.image !== null ? document.image : "null",
			date: document.date,
		};
	});
	res.status(201).json({ status: "201", notifications: jsonArray });
});

app.get("/streamelements/register", async (req, res) => {});

app.get("/currentTTS", async (req, res) => {
	const channelId = req.query.channelId;
	if (channelId === null) {
		res.status(209).json({ status: "209", error: "No ChannelId provided" });
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("aitts");
	const result = await collection.findOneAndDelete({ channelId: channelId });
	if (result === null) {
		res.status(203).json({ status: "400", error: "Nothing found" });
		return;
	}
	res
		.status(201)
		.json({ status: "201", text: result.text, username: result.username });
});

app.get("/commandInfo", async (req, res) => {
	const channelId = req.query.channelId;
	if (channelId) {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		const collection = db.collection("commands");
		const result = await collection.findOne({ channelId: channelId });
		if (result === undefined || result === null) {
			res.status(203).json({ status: "203", commands: {} });
			return;
		}
		const commands = result.commands.map((commandString) => {
			const [
				command,
				output,
				description,
				enabled,
				role,
				requestType,
				userCooldown,
				globalCooldown,
				hideFromPublic,
				availability,
			] = commandString.split("%#%");
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
				availability,
			};
		});
		const jsonResponse = {
			commands,
		};
		res
			.status(201)
			.json({ status: "201", channelId: channelId, commands: commands });
	} else {
		res.status(400).json({ status: "400", error: "Channel Id fehlt" });
	}
});

//Chat
app.get("/chatInformation", async (req, res) => {
	const userId = req.query.userId;
	const password = req.query.password;
	if (!userId || userId === undefined || userId === null || userId === "") {
		res.status(403).json({ status: "403", error: "target userid is invalid" });
		return;
	}
	if (
		!password ||
		password === undefined ||
		password === null ||
		password === ""
	) {
		res.status(403).json({ status: "402", error: "password is invalid" });
		return;
	}
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("chat");
	const result = await collection.findOne({ userId: userId });
	if (!result || result === undefined || result === null) {
		res.status(402).json({ status: "402", error: "user is not registered" });
		return;
	}
	if (result.password !== password) {
		res.status(401).json({ status: "401", error: "password is wrong" });
		return;
	}
	var tabs = result.tabs.split(",").map(function (channelId) {
		return {
			channelId: channelId,
		};
	});
	res.status(201).json({
		status: "201",
		userId: result.userId,
		displayname: result.displayname,
		access_token: result.access_token,
		refresh_token: result.refresh_token,
		tabsSize: result.tabsSite,
		tabs: tabs,
	});
});

start();

async function start(){
	setTimeout(async () => {
		await mongoClient.connect();
		const db = mongoClient.db("marceybot");
		const collection = db.collection("url_shorter");
		const cursor = collection.find({});
		let usedIdsStr = null;
		await cursor.forEach(document => {
			if(document.id !== null && document.id !== undefined){
				usedIds[usedIds.length] = document.id;
				if(usedIdsStr === null){
					usedIdsStr = document.id;
				} else usedIdsStr = usedIdsStr + " " + document.id;
			}
		});
		const updatedResult = await collection.updateOne(
			{ key: "valids" },
			{ $set: {
				usedIds: usedIdsStr,
			}}
		);
	}, 2000);
}

async function saveUsedId(id){
	usedIds[usedIds.length] = id;
	await mongoClient.connect();
	const db = mongoClient.db("marceybot");
	const collection = db.collection("url_shorter");
	const result = await collection.findOne({ key: "valids" });
	const updatedResult = await collection.updateOne(
		{ key: "valids" },
		{ $set: {
			usedIds: result.usedIds + " " + id,
		}}
	);
}


//chat
app.get("/chat/tabs", async (req, res) => {
	const token = req.query.token;
	fetch("https://api.marceybot.de/")
});