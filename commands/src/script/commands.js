import { TwitchUserId } from "./twitch";
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const statusContainer = document.querySelector(".statusContainer");
        const status = document.querySelector(".status");
        let lastStatusMessage = getCookie("lastStatusMessage");
        if(lastStatusMessage !== null && lastStatusMessage !== undefined && lastStatusMessage !== ""){
            status.textContent = lastStatusMessage;
            statusContainer.classList.toggle("active");
            setTimeout(() => {
                if(statusContainer.classList.contains("active")){
                    statusContainer.classList.toggle("active");
                }
            }, 3000);
            deleteCookie("lastStatusMessage");
        }
    }, 10);
    getCommands(TwitchUserId, true);
});

export let commands = null;

async function getCommands(userId, handle){
    console.log("User Commands get... " + userId);

    if(window.location.href.includes("localhost:")){
        commands = [{"command":"lol","output":"okidokiloki","description":"jojojo","enabled":"false","role":"everyone","requestType":"say","userCooldown":"3","globalCooldown":"15","hideFromPublic":"false","availability":"online"},{"command":"ok","output":"jajajajjsscak","description":"xddd","enabled":"true","role":"moderator","requestType":"say","userCooldown":"5","globalCooldown":"12","hideFromPublic":"false","availability":"both"}];
        console.log(commands);
        setTimeout(() => {
            init(commands);
        }, 500);
        return;
    }

    fetch('https://api.marceybot.de/commandInfo?channelId=' + userId)
    .then(response => {
        if(!response.ok){
            throw new Error('Anfrage fehlgeschlagen');
        }
        return response.json();
    })
    .then(data => {
        if(data.status === '203' || data.status === '400'){
            init({});
            return;
        } else if(data.status === '201'){
            commands = data.commands;
            console.log(data.commands);
            if(!handle) return;
            setTimeout(() => {
                init(commands);
            }, 500);
        }
    })
    .catch(error => {
        console.error('Fehler beim Getten der User-Commands:', error);
    });
}

function updateCommand(command){
    console.log("Adding/Editing Command...");
    const requestData = {
        collection: 'requests',
        queryId: Math.random().toString(36).slice(2),
        data: {
            type: 'add_command',
            channelId: TwitchUserId,
            command: command.command,
            output: command.output,
            description: 'empty',
            role: command.role,
            enabled: command.enabled,
            responseType: command.responseType,
            userCooldown: command.userCooldown,
            globalCooldown: command.globalCooldown,
            hideFromPublic: command.hideFromPublic,
            availability: command.availability === "online" && command.availability === "offline" ? "both" : command.availability === "online" ? "online" : "offline",
        }
    };

    const statusContainer = document.querySelector(".statusContainer");
    const status = document.querySelector(".status");

    

    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/saveData', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error bei updaten von den commands Aware");
            status.textContent = "Fehler beim Speichern des Commands";
            setCookie("lastStatusMessage", "Fehler beim Speichern des Commands");
            if(!statusContainer.classList.toggle("active")){
                statusContainer.classList.toggle("active");
                window.location.reload();
            }
        }
        return response.json();
    })
    .then((data) => {
        console.log('Commands updated: ', data);
        status.textContent = "Commands wird gespeichert...";
        setCookie("lastStatusMessage", "Command wird gespeichert...");
        if(!statusContainer.classList.toggle("active")){
            statusContainer.classList.toggle("active");
            window.location.reload();
        }
    })
    .catch((error) => {
        console.error('Fehler: ', error);
        status.textContent = "Fehler beim Speichern der Commands";
        setCookie("lastStatusMessage", "Fehler beim Speichern des Commands");
            if(!statusContainer.classList.toggle("active")){
                statusContainer.classList.toggle("active");
                window.location.reload();
            }
    })
}

function removeCommand(command, li){
    console.log("Removing Command...");
    const requestData = {
        collection: 'requests',
        queryId: Math.random().toString(36).slice(2),
        data: {
            type: 'remove_command',
            channelId: TwitchUserId,
            command: command.command,
        }
    };

    const statusContainer = document.querySelector(".statusContainer");
    const status = document.querySelector(".status");

    

    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      };
    fetch('https://api.marceybot.de/saveData', requestOptions)
    .then((response) => {
        if(!response.ok){
            console.log("error bei removen von den commands Aware");
            document.querySelector(".commandList").removeChild(li);
        }
        return response.json();
    })
    .then((data) => {
        console.log('Commands updated: ', data);
        document.querySelector(".commandList").removeChild(li);
    })
    .catch((error) => {
        console.error('Fehler: ', error);
        status.textContent = "Fehler beim Entfernen des Commands";
        document.querySelector(".commandList").removeChild(li);
    })
}

function setCookie(name,value) {
    var expires = "";
    let days = 300;
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

function init(commands){
    if(commands && commands !== null && commands !== undefined && commands !== "{}"){
        try {
            commands.forEach(command => {
                addLi(command, false);
            });
        } catch(error){}
    }
    const commandElements = document.querySelectorAll(".command");
        console.log(commandElements);
        const addCommandButton = document.querySelector(".addCommandButton");
        addCommandButton.addEventListener("click", () => {
            const li = addLi({
                command: "Neuer Command",
                output: "Neue Nachricht",
                description: "empty",
                enabled: "true",
                role: "everyone",
                userCooldown: "3",
                globalCooldown: "7",
                hideFromPublic: "false",
                availability: "both",
                requestType: "say",
            }, true);
            initCommand(li);
        });
        commandElements.forEach(command => {
            initCommand(command);
        });
}

function initCommand(command){
    const commandContent = command.querySelector(".commandContent");
    const advancedCommand = command.querySelector(".advancedCommand");
    const userLevelDropdown = advancedCommand.querySelector(".userLevelDropdown");
    const userLevelContent = userLevelDropdown.querySelector(".userLevel-content");
    const userLevelDropBtn = advancedCommand.querySelector(".userLevelDropBtn");
    const responseTypeDropdown = advancedCommand.querySelector(".responseTypeDropdown");
    const responseTypeContent = responseTypeDropdown.querySelector(".responseType-content");
    const responseTypeOptions = responseTypeContent.querySelectorAll(".responseTypeDropdownOption");
    const responseTypeDropdownBtn = advancedCommand.querySelector(".responseTypeDropBtn");
    const saveButton = advancedCommand.querySelector(".saveButton");
    const onlineCheckbox = advancedCommand.querySelector(".onlineCheckbox");
    const offlineCheckbox = advancedCommand.querySelector(".offlineCheckbox");
    const statusContainer = document.querySelector(".statusContainer");
    const enabledCheckbox = command.querySelector(".enabledCheckbox");
    const deleteCommand = command.querySelector(".deleteCommand");
    deleteCommand.addEventListener("click", () => {
        removeCommand({command: command.querySelector(".commandName").textContent}, command);
    })
    saveButton.addEventListener("click", () => {
        if(!advancedCommand.classList.contains("active")) return;
        let toUpdate = {
            command: advancedCommand.querySelector(".commandInput").value,
            output: advancedCommand.querySelector(".responseInput").value,
            userCooldown: advancedCommand.querySelector(".userCooldown").value,
            globalCooldown: advancedCommand.querySelector(".globalCooldown").value,
            role: userLevelDropBtn.textContent === "Jeder" ? "everyone" : userLevelDropBtn.textContent.toLowerCase(),
            enabled: enabledCheckbox.checked,
            responseType: responseTypeDropdownBtn.textContent.toLowerCase(),
            hideFromPublic: command.querySelector(".hideFromPublicCheckbox").checked,
            availability: onlineCheckbox.checked && offlineCheckbox.checked ? "both" : onlineCheckbox.checked ? "online" : "offline",
        };
        updateCommand(toUpdate);
    });
    responseTypeOptions.forEach(responseOption => {
        responseOption.addEventListener("click", () => {
            responseTypeDropdownBtn.textContent = responseOption.textContent;
        });
    });
    responseTypeDropdown.addEventListener("click", () => {
        responseTypeContent.classList.toggle("active");
    });
    userLevelDropdown.addEventListener("click", () => {
        userLevelContent.classList.toggle("active");
    });
    const userLevelDropdownOptions = userLevelContent.querySelectorAll(".userLevelDropdownOption");
    userLevelDropdownOptions.forEach(dropdownOption => {
        dropdownOption.addEventListener("click", () => {
            userLevelDropBtn.textContent = dropdownOption.textContent;
        });
    });
    commandContent.addEventListener("click", () => {
        console.log("oki");
        command.classList.toggle("active");
        const advancedCommand = command.querySelector(".advancedCommand");
        advancedCommand.classList.toggle("active");
    });
}

function addLi(command, first){
    
    const newLi = document.createElement('li');
    newLi.className = 'command';

    const commandContentDiv = document.createElement('div');
    commandContentDiv.classList.add('commandContent');

    const switchLabel = document.createElement('label');
    switchLabel.classList.add('switch');

    const switchInput = document.createElement('input');
    switchInput.setAttribute('type', 'checkbox');
    switchInput.className = "enabledCheckbox";
    switchInput.checked = command.enabled === "true";

    const sliderSpan = document.createElement('span');
    sliderSpan.classList.add('slider', 'round');

    switchLabel.appendChild(switchInput);
    switchLabel.appendChild(sliderSpan);

    const commandNameP = document.createElement('p');
    commandNameP.classList.add('commandName');
    commandNameP.textContent = command.command;

    const commandOutputP = document.createElement('p');
    commandOutputP.classList.add('commandOutput');
    commandOutputP.textContent = command.output;

    const deleteCommand = document.createElement('button');
    deleteCommand.className = "deleteCommand";
    const trashIcon = document.createElement('i');
    trashIcon.className = 'bx bxs-trash-alt';
    deleteCommand.appendChild(trashIcon);

    const commandArrowI = document.createElement('i');
    commandArrowI.classList.add('commandArrow', 'bx', 'bx-chevron-down');

    commandContentDiv.appendChild(switchLabel);
    commandContentDiv.appendChild(commandNameP);
    commandContentDiv.appendChild(commandOutputP);
    commandContentDiv.appendChild(commandArrowI);
    commandContentDiv.appendChild(deleteCommand);

    const advancedCommandDiv = document.createElement('div');
    advancedCommandDiv.className = 'advancedCommand';

// Erstellen Sie das <div> für .commandAvailability
    const commandAvailabilityDiv = document.createElement('div');
    commandAvailabilityDiv.className = 'commandAvailability';

// Erstellen Sie das <p> für .commandAvailabilityText
    const commandAvailabilityTextP = document.createElement('p');
    commandAvailabilityTextP.className = 'commandAvailabilityText';
    commandAvailabilityTextP.textContent = 'Aktiviere den Command wenn:';

// Erstellen Sie die Labels und Inputs für die Verfügbarkeitsoptionen
    const availabilityOptions = [
    { id: 'online', text: 'Online', checked: (command.availability === "online" || command.availability === "both"), className: "onlineCheckbox" },
    { id: 'offline', text: 'Offline', checked: (command.availability === "offline" || command.availability === "both"), className: "offlineCheckbox"},
    { id: 'hideFromPublic', text: 'Von Liste verstecken', checked: (command.hideFromPublic === "true"), className: "hideFromPublicCheckbox" },
    ];

    availabilityOptions.forEach(option => {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'availabilityOption';
    optionLabel.id = option.id;

    const optionTextP = document.createElement('p');
    optionTextP.className = 'availabilityOptionText';
    optionTextP.textContent = option.text;

    const optionInput = document.createElement('input');
    optionInput.setAttribute('type', 'checkbox');
    optionInput.className = option.className;
    optionInput.checked = option.checked;

    const optionSpan = document.createElement('span');
    optionSpan.className = 'checkmark';

    optionLabel.appendChild(optionTextP);
    optionLabel.appendChild(optionInput);
    optionLabel.appendChild(optionSpan);

    commandAvailabilityDiv.appendChild(optionLabel);
    return optionLabel;
});

const verticalLine = document.createElement('div');
verticalLine.className = 'vertical-line';

// Erstellen Sie die Elemente für die anderen Bereiche
const commandInputTextP = document.createElement('p');
commandInputTextP.className = 'commandInputText';
commandInputTextP.textContent = 'Command:';

const commandInput = document.createElement('input');
commandInput.className = 'text-box commandInput';
commandInput.defaultValue = command.command;

const responseTextP = document.createElement('p');
responseTextP.className = 'responseText';
responseTextP.textContent = 'Response:';

const responseContainerDiv = document.createElement('div');
responseContainerDiv.className = 'responseContainer';

const responseInput = document.createElement('textarea');
responseInput.className = 'text-box responseInput';
responseInput.rows = '5';
responseInput.cols = '2';
responseInput.defaultValue = command.output;

const userCooldownTextP = document.createElement('p');
userCooldownTextP.className = 'userCooldownText';
userCooldownTextP.textContent = 'User-Cooldown:';

const userCooldownInput = document.createElement('input');
userCooldownInput.className = 'text-box userCooldown';
userCooldownInput.defaultValue = command.userCooldown;

const globalCooldownTextP = document.createElement('p');
globalCooldownTextP.className = 'globalCooldownText';
globalCooldownTextP.textContent = 'Global-Cooldown:';

const globalCooldownInput = document.createElement('input');
globalCooldownInput.className = 'text-box globalCooldown';
globalCooldownInput.defaultValue = command.globalCooldown;

const aliasesTextP = document.createElement('p');
aliasesTextP.className = 'aliasesText';
aliasesTextP.textContent = 'Aliases (getrennt durch Leerzeichen):';

const aliasContainerDiv = document.createElement('div');
aliasContainerDiv.className = 'text-box aliasContainer';

const aliasInput = document.createElement('textarea');
aliasInput.className = 'text-box aliasInput';
aliasInput.defaultValue = 'Coming soon...';

const keyWordTextP = document.createElement('p');
keyWordTextP.className = 'keyWordText';
keyWordTextP.textContent = 'KeyWords (getrennt durch Kommas):';

const keyWordContainerDiv = document.createElement('div');
keyWordContainerDiv.className = 'text-box keyWordContainer';

const keyWordInput = document.createElement('textarea');
keyWordInput.className = 'text-box keyWordInput';
keyWordInput.defaultValue = 'Coming soon...';

const userLevelTextP = document.createElement('p');
userLevelTextP.className = 'userLevelText';
userLevelTextP.textContent = 'Berechtigung:';

const userLevelDropdownDiv = document.createElement('div');
userLevelDropdownDiv.className = 'userLevelDropdown';

const userLevelDropBtn = document.createElement('button');
userLevelDropBtn.className = 'userLevelDropBtn';
userLevelDropBtn.textContent = command.role === "everyone" ? "Jeder" : (command.role.charAt(0).toUpperCase() + command.role.slice(1));

const userLevelDropdownOptionsDiv = document.createElement('div');
userLevelDropdownOptionsDiv.id = 'userLevelDropdownOptions';
userLevelDropdownOptionsDiv.className = 'userLevel-content';

const userLevels = ['Jeder', 'Subscriber', 'VIP', 'Moderator', 'Editor', 'Broadcaster'];

userLevels.forEach(level => {
  const userLevelDropdownOptionA = document.createElement('a');
  userLevelDropdownOptionA.className = 'userLevelDropdownOption';
  
  const userLevelDropdownOptionP = document.createElement('p');
  userLevelDropdownOptionP.textContent = level;
  
  userLevelDropdownOptionA.appendChild(userLevelDropdownOptionP);
  userLevelDropdownOptionsDiv.appendChild(userLevelDropdownOptionA);
});

const responseTypeTextP = document.createElement('p');
responseTypeTextP.className = 'responseTypeText';
responseTypeTextP.textContent = 'Antwort-Typ:';

const responseTypeDropdownDiv = document.createElement('div');
responseTypeDropdownDiv.className = 'responseTypeDropdown';

const responseTypeDropBtn = document.createElement('button');
responseTypeDropBtn.className = 'responseTypeDropBtn';
responseTypeDropBtn.textContent = command.requestType.charAt(0).toUpperCase() + command.requestType.slice(1);

const responseTypeDropdownOptionsDiv = document.createElement('div');
responseTypeDropdownOptionsDiv.id = 'responseTypeDropdownOptions';
responseTypeDropdownOptionsDiv.className = 'responseType-content';

const saveButton = document.createElement('button');
saveButton.className = 'saveButton';
saveButton.textContent = 'Speichern';

const responseTypes = ['Say', 'Reply', 'Whisper'];

responseTypes.forEach(type => {
  const responseTypeDropdownOptionA = document.createElement('a');
  responseTypeDropdownOptionA.className = 'responseTypeDropdownOption';
  
  const responseTypeDropdownOptionP = document.createElement('p');
  responseTypeDropdownOptionP.textContent = type;
  
  responseTypeDropdownOptionA.appendChild(responseTypeDropdownOptionP);
  responseTypeDropdownOptionsDiv.appendChild(responseTypeDropdownOptionA);
});

// Fügen Sie alle Elemente zum .advancedCommand-Div hinzu
advancedCommandDiv.appendChild(commandAvailabilityTextP);
advancedCommandDiv.appendChild(commandAvailabilityDiv);

advancedCommandDiv.appendChild(verticalLine);

advancedCommandDiv.appendChild(commandInputTextP);
advancedCommandDiv.appendChild(commandInput);

advancedCommandDiv.appendChild(responseTextP);
advancedCommandDiv.appendChild(responseContainerDiv);
advancedCommandDiv.appendChild(responseInput);

advancedCommandDiv.appendChild(userCooldownTextP);
advancedCommandDiv.appendChild(userCooldownInput);

advancedCommandDiv.appendChild(globalCooldownTextP);
advancedCommandDiv.appendChild(globalCooldownInput);

advancedCommandDiv.appendChild(aliasesTextP);
advancedCommandDiv.appendChild(aliasContainerDiv);
advancedCommandDiv.appendChild(aliasInput);

advancedCommandDiv.appendChild(keyWordTextP);
advancedCommandDiv.appendChild(keyWordContainerDiv);
advancedCommandDiv.appendChild(keyWordInput);

advancedCommandDiv.appendChild(userLevelTextP);
advancedCommandDiv.appendChild(userLevelDropdownDiv);
userLevelDropdownDiv.appendChild(userLevelDropBtn);
userLevelDropdownDiv.appendChild(userLevelDropdownOptionsDiv);

advancedCommandDiv.appendChild(responseTypeTextP);
advancedCommandDiv.appendChild(responseTypeDropdownDiv);
responseTypeDropdownDiv.appendChild(responseTypeDropBtn);
responseTypeDropdownDiv.appendChild(responseTypeDropdownOptionsDiv);

advancedCommandDiv.appendChild(saveButton);

    newLi.appendChild(advancedCommandDiv);


    newLi.appendChild(commandContentDiv);

    const commandList = document.querySelector('.commandList');
    if(first){
        commandList.insertBefore(newLi, commandList.firstChild);
    } else {
        commandList.appendChild(newLi);
    }
    return newLi;
}