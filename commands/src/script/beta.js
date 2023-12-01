document.addEventListener("DOMContentLoaded", function(){
    let password = getCookie("MarceyBotBetaAuthorization");
    if(window.location.href.includes("localhost:")) return;
    if(password === null || password === undefined || password === "" || password === " " || !password){
        window.location.href = "https://marceybot.de/";
        return;
    }
    fetch('https://api.marceybot.de/checkPassword?password=' + password)
    .then(response => {
        if(!response.ok){
            window.location.href = "https://marceybot.de/";
            throw new Error('Anfrage fehlgeschlagen');
            return;
        }
        return response.json();
    })
    .then(data => {
        if(data.status !== '201'){
            window.location.href = "https://marceybot.de/";
            return;
        } 
    })
    .catch(error => {
        console.error('Fehler beim Getten des Passworts:', error);
        window.location.href = "https://marceybot.de/";
        return;
    });
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