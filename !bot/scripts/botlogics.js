const {getMarceyBotInfos, getTokens, startTwitchBot, sendMessage, joinChannel, leaveChannel, apiClient, getUserById, getUserByName, joinChannelNew} = require('./twitch.js');
const {addNewAccountWithTwitch, removeAccountWithChannelId} = require('./mongo.js');
const {log, warning, debug, error, emptyLog} = require('./logger.js');

async function addUser(channelId, accessToken, refreshToken){
    const targetUser = await getUserById(channelId);
    debug("User-Add-Request: " + targetUser.display_name + " (" + channelId + ") with " + (accessToken ? "valid" : "invalid") + " accessToken and " + (refreshToken ? "valid" : "invalid") + " refreshToken");
    await addNewAccountWithTwitch(channelId, accessToken, refreshToken);
    joinChannelNew(targetUser.display_name, accessToken, refreshToken);
    sendMessage(targetUser.display_name, targetUser.display_name + " nimmt am Beta-Programm von MarceyBot v4 teil. Der Bot wurde erfolgreich hinzugefügt. Damit ich richtig funktioniere benötige ich den Moderator-Status (\"/mod MarceyBot\").");
    log("User " + targetUser.display_name + "(" + channelId + ") was successfully added");
}

async function removeUser(channelId){
    const targetUser = await getUserById(channelId);
    await removeAccountWithChannelId(channelId);
    sendMessage(targetUser.display_name, "Der Bot wurde von diesem Kanal entfernt.");
    leaveChannel(targetUser.display_name);
}

module.exports = {addUser, removeUser};