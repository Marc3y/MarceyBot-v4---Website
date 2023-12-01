const isDebug = true;

function log(text){
    write(text, "log");
}

function warning(text){
    write(text, "warning");
}

function debug(text){
    if(!isDebug) return;
    write(text, "debug");
}

function error(text){
    write(text, "error");
}

function emptyLog(text){
    console.log(text);
}

function write(text, type){
    const date = new Date();
    const time = "[" + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
     + ":" + date.getSeconds().toString().padStart(2, '0') + "]";
     if(type === "log"){
        console.log("[INFO] " + time + " " + text);
        return;
    } else if(type === "warning"){
        console.warn("[WARNING] " + time + " " + text);
        return;
    } else if(type === "debug"){
        console.debug("[DEBUG] " + time + " " + text);
        return;
    } else if(type === "error"){
        console.error("[ERROR] " + time + " " + text);
        return;
    }
}

module.exports = {log, warning, debug, error, emptyLog};