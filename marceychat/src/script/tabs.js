document.addEventListener("DOMContentLoaded", function(){
    setTimeout(() => {
        init();
    }, 500);
});

let tabElements = null;
let tabList = null;

function init(){
    tabList = document.querySelector(".tabList");
    tabElements = document.querySelectorAll(".tabElement");
    tabElements.forEach(element => {
        setDragAllowed(element);
        addEventsToTab(element);
    });
    tabList.addEventListener("dragover", initSortableList);
    document.querySelector(".addTabButton").addEventListener("click", () => {
        let channelNameInput = document.querySelector(".channelNameInput");
        if(!channelNameInput.value || channelNameInput.value === null || channelNameInput.value === undefined){
            return;
        }
        let tabAddContainer = document.querySelector(".tabAddContainer");
        tabAddContainer.classList.remove("enabled");
        addTab(channelNameInput.value, true);
        channelNameInput.value = "";
    });
}

function setDragAllowed(element){
    element.addEventListener("dragstart", () => {
        setTimeout(() => {
            element.classList.add("dragging");
        }, 0);
    });
    element.addEventListener("dragend", () => {
        element.classList.remove("dragging");
    });
}

function addEventsToTab(element){
    element.addEventListener("click", () => {
        selectTab(element.querySelector(".details").textContent);
    });
}

function addTab(channelName, instantSelect){
    let liElement = document.createElement('li');
    liElement.className = "tabElement";
    liElement.draggable = "true";
    let details = document.createElement('div');
    details.className = "details";
    details.textContent = channelName;
    liElement.appendChild(details);
    tabList.appendChild(liElement);
    setDragAllowed(liElement);
    setAddTabButton();
    addEventsToTab(liElement);
    if(!instantSelect) return;
    selectTab(channelName);
}

function selectTab(tabName){
    tabList.querySelectorAll(".tabElement").forEach(element => {
        if(element.querySelector(".details").textContent !== tabName){
            element.classList.remove("selected");
        } else {
            element.classList.add("selected");
            element.classList.remove("newMessages");
        }
    });
}

const initSortableList = (e) => {
    const draggingItem = tabList.querySelector(".dragging");
    const siblings = [...tabList.querySelectorAll(".tabElement:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        return e.clientX <= sibling.offsetLeft + sibling.offsetWidth / 2;
    });
    
    tabList.insertBefore(draggingItem, nextSibling);
    setAddTabButton();
}

function setAddTabButton(){
    let button = tabList.querySelector(".tabAddElement");
    tabList.removeChild(button);
    tabList.appendChild(button);
}