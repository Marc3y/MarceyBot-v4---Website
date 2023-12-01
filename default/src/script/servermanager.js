export function isValidPassword(password){

    fetch('https://api.marceybot.de/checkPassword?password=' + password)
    .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if(data.status === '201'){
            setCookie("MarceyBotBetaAuthorization", password, 30);
            window.location.href = "https://id.twitch.tv/oauth2/authorize?response_type=code&&client_id=wp60awg1ifrh899hwmzjb06kzl8i5h&&redirect_uri=https://marceybot.de/dashboard/&&scope=user:edit+clips:edit+bits:read+analytics:read:games+user:read:broadcast+chat:read+chat:edit+channel:moderate+channel:read:subscriptions+moderation:read+channel:read:redemptions+channel:read:hype_train+channel:manage:redemptions+channel:read:editors+user:read:subscriptions+user:read:follows+channel:manage:polls+channel:manage:predictions+channel:read:polls+channel:read:predictions+channel:manage:schedule+channel:read:goals+moderator:manage:banned_users+moderator:read:chat_settings+moderator:manage:chat_settings+moderator:manage:announcements+moderator:manage:chat_messages+channel:read:vips+channel:manage:vips+channel_editor";
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten des Passworts:', error);
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}