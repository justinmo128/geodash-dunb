initializeMenu();
let menuState = "top";
let menuSelect = 0;
let levels = [];
let importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = 'json';
importInput.addEventListener("change", importLevel)

fetch(`levels/levels.json`)
    .then((res) => res.json())
    .then((data) => levels = data);

function checkClick(x1, x2, y1, y2) {
    if (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
        return true;
    }
    return false;
}

function clickInMenu() {
    console.log(mouseX, mouseY)
    if (menuState == "top") {
        if (checkClick(100, 250, 120, 270)) {
            menuState = "mainLevels";
            menuSelect = 0;
        } else if (checkClick(300, 380, 150, 230)) {
            menuState = "editorMenu";
        }
    } else if (menuState == "mainLevels") {
        if (checkClick(10, 60, 10, 65)) {
            menuState = "top";
        } else if (checkClick(10, 45, 130, 200)) {
            menuSelect -= 1;
        } else if (checkClick(440, 475, 130, 200)) {
            menuSelect += 1;
        } else if (checkClick(65, 410, 60, 172)) {
            startLevel(levels[menuSelect]);
        }
        if (menuSelect > levels.length - 1) {
            menuSelect = 0;
        } else if (menuSelect < 0) {
            menuSelect = levels.length - 1;
        }
    } else if (menuState == "editorMenu") {
        if (checkClick(10, 60, 10, 65)) {
            menuState = "top";
        } else if (checkClick(75, 215, 100, 240)) {
            initializeEditor();
        } else if (checkClick(275, 415, 100, 240)) {
            importInput.click();
        }
    }
}

function importLevel() {
    new Response(importInput.files[0]).json()
        .then(json => {levelJSON = json})
        .then(createGameObjects)
        .then(initialize);
}

function initializeEditor() {
    gameState = "editor";
    for (let i = 0; i < editorDivs.length; i++) {
        editorDivs[i].style.display = "flex";
    }
    camera.x = 0;
    camera.y = 270;
    background = {
        colour: "#4287f5",
        x: 0,
        y: 0
    }
    floor = {
        colour: "#0548b3",
        y: 0
    }
    newFloor = {
        canCollide: false,
    }
    roof = {
        canCollide: false,
    };
    player = {
        x: 0
    };
}

document.getElementById("editor-leave").addEventListener("click", initializeMenu)
function initializeMenu() {
    gameState = "menu";
    levelInfo.style.display = "none";
    camera.x = 0;
    camera.y = 500;
    background = {
        colour: "#4287f5",
        x: 0,
        y: 0
    };
    for (let i = 0; i < editorDivs.length; i++) {
        editorDivs[i].style.display = "none";
    }
}