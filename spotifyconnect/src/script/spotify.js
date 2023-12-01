document.addEventListener("DOMContentLoaded", function() {
    if(window.location.href.includes("localhost:")) return;
    if(!window.location.href.includes("?code=")) {
        window.location.href = "https://marceybot.de/spotify/";
    }
})