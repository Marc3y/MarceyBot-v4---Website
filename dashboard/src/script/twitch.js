
import {getUserInformation} from './servermanager';
let loaded = false;

var ClientId = "wp60awg1ifrh899hwmzjb06kzl8i5h";
var ClientSecret = "8gihd9wqc1boj47c6mn1ntuvdx5z1t";

export var TwitchAccessToken = null;
export var TwitchRefreshToken = null;
export var TwitchUserId = null;
export var TwitchUserName = null;
export var TwitchProfilePictureUrl = null;

document.addEventListener("DOMContentLoaded", function() {
    if(window.location.href.includes("localhost:")) return;
    if(!window.location.href.includes("?code")){
        let at = getCookie("TwitchAccessToken")
        if(!at || at === undefined || at === null){
            window.location.href = "https://marceybot.de/";
        }
        TwitchAccessToken = at;
        TwitchUserName = getCookie("TwitchUserName");
        TwitchProfilePictureUrl = getCookie("TwitchProfilePictureUrl");
        TwitchUserId = getCookie("TwitchUserId");

        fetch('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: 'Bearer ' + TwitchAccessToken,
                'Client-ID': ClientId
            }
        }).then(response => response.json()
        ).then(userResponse => {
            let data = userResponse.data[0];
            if(!data){
                window.location.href = "https://marceybot.de/";
                return;
            }
            console.log(data);
            TwitchUserId = data.id;
            TwitchUserName = data.display_name;
            TwitchProfilePictureUrl = data.profile_image_url;
            setCookie("TwitchUserId", TwitchUserId, 300);
            setCookie("TwitchUserName", TwitchUserName, 300);
            setCookie("TwitchProfilePictureUrl", TwitchProfilePictureUrl, 300)
            setTimeout(function(){
                document.querySelector("#twitchName").textContent = TwitchUserName;
                document.querySelector("#service").textContent = "Twitch";
                document.querySelector("#profilePicture").src = TwitchProfilePictureUrl;
                setStats();
                getUserInformation(TwitchUserId);
            }, 0);
        })
        .catch(error => {
            window.location.href = "https://marceybot.de/";
        })

        return;
    }
    let a = window.location.href.split("?code=")[1];
    if(a === null){
        window.location.href = "https://marceybot.de/";
        return;
    }
    if(!a.includes("&scope")){
        window.location.href = "https://marceybot.de/";
        return;
    }
    let b = a.split("&scope")[0];
    if(b === null){
        window.location.href = "https://marceybot.de/";
        return;
    }
    if(b.length < 10){
        window.location.href = "https://marceybot.de/";
        return;
    }
    fetch('https://id.twitch.tv/oauth2/token?client_id=' + ClientId + '&client_secret=' + ClientSecret + '&code=' + b
    + '&grant_type=authorization_code&redirect_uri=http://localhost', {
        method: "POST"
    }).then(response => response.json()
    ).then(async finalResponse => {
        if(finalResponse.access_token == null){
            console.log("The Twitch Access-Token is null, please relogin.");
            window.location.href = "https://marceybot.de/";
            return;
        }
        TwitchAccessToken = finalResponse.access_token;
        TwitchRefreshToken = finalResponse.refresh_token;
        fetch('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: 'Bearer ' + TwitchAccessToken,
                'Client-ID': ClientId
            }
        }).then(response => response.json()
        ).then(userResponse => {
            let data = userResponse.data[0];
            console.log(data);
            TwitchUserId = data.id;
            TwitchUserName = data.display_name;
            TwitchProfilePictureUrl = data.profile_image_url;
            console.log(TwitchUserId);
            console.log(TwitchUserName);
            console.log(TwitchProfilePictureUrl);
            setCookie("TwitchAccessToken", TwitchAccessToken, 300);
            setCookie("TwitchRefreshToken", TwitchRefreshToken, 300);
            setCookie("TwitchUserId", TwitchUserId, 300);
            setCookie("TwitchUserName", TwitchUserName, 300);
            setCookie("TwitchProfilePictureUrl", TwitchProfilePictureUrl, 300)
            setTimeout(function(){
                document.querySelector("#twitchName").textContent = TwitchUserName;
                document.querySelector("#service").textContent = "Twitch";
                document.querySelector("#profilePicture").src = TwitchProfilePictureUrl;
                setStats();
                getUserInformation(TwitchUserId);
            }, 0);
        })
    })
});

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(cname){
    let exdays = -1;
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let totalFollower = 0;
let follower = 0;
let avgViewer = 0;
let streamTime = 0;
let maxViewer = 0;
let rang = 0;

function setStats(){
    fetch('https://api.twitch.tv/helix/channels/followers?broadcaster_id=' + TwitchUserId, {
        headers: {
            Authorization: 'Bearer ' + TwitchAccessToken,
            'Client-ID': ClientId
        }
    }).then(response => response.json()
    ).then(async finalResponse => {
        totalFollower = finalResponse.total;
        fetch('https://twitchtracker.com/api/channels/summary/' + TwitchUserName)
        .then(response => response.json()
        ).then(async trackerResponse => {
            console.log(trackerResponse);
            if(Object.keys(trackerResponse).length === 0) {
                setStatsInDocument();
                return;
            }
            follower = trackerResponse.followers;
            avgViewer = trackerResponse.avg_viewers;
            streamTime = trackerResponse.minutes_streamed;
            maxViewer = trackerResponse.max_viewers;
            rang = trackerResponse.rank;
            setStatsInDocument();
        })

    })
}

function setStatsInDocument(){
    setTimeout(function(){
        document.querySelector("#totalfollower").textContent = totalFollower;
        document.querySelector("#follower").textContent = follower;
        document.querySelector("#avgviewer").textContent = avgViewer;
        document.querySelector("#streamtime").textContent = (streamTime/60).toFixed(2) + "h";
        document.querySelector("#maxviewer").textContent = maxViewer;
        document.querySelector("#rang").textContent = rang;
    }, 100);
}