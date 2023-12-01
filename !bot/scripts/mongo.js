var MongoClient = require('mongodb').MongoClient;
let mongoClient = null;

async function initMongoDB(){
    mongoClient = new MongoClient(
        "mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    await mongoClient.connect();
}

async function addNewAccountWithTwitch(channelId, accessToken, refreshToken){
    await mongoClient.connect();
    const targetCollection = await mongoClient.db('marceybot').collection("accounts");
    const targetResult = await targetCollection.findOne({twitchChannelId: twitchChannelId});
    let currentDate = formatCurrentDate();
    if(targetResult === null || targetResult === undefined || !targetResult){
        targetCollection.insertOne({email: 'invalid', password: 'invalid', twitchChannelId: channelId, twitchAccessToken: accessToken, twitchRefreshToken: refreshToken, username: 'invalid', dateJoined: currentDate});
    } else {
        targetCollection.updateOne({twitchChannelId: twitchChannelId}, {$set: {twitchAccessToken: accessToken, twitchRefreshToken: refreshToken, twitchChannelId: channelId, dateJoined: currentDate}});
    }
    return true;
}

async function removeAccountWithChannelId(channelId){
    await mongoClient.connect();
    const targetCollection = await mongoClient.db('marceybot').collection("accounts");
    const targetResult = await targetCollection.findOne({twitchChannelId: twitchChannelId});
    if(targetResult === null || targetResult === undefined || !targetResult){
        return false;
    }
    targetCollection.deleteOne({twitchChannelId: channelId});
    return true;
}

function formatCurrentDate() {
    let date = new Date();
    var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    var month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
    var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    var formattedDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    return formattedDate;
}

function getMongoClient(){
    return mongoClient;
}

module.exports = {getMongoClient, initMongoDB, addNewAccountWithTwitch, removeAccountWithChannelId};