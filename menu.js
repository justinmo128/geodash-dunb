let menuState = "top";
let menuSelect = 0;
let levels = [];

fetch(`levels/levels.json`)
    .then((res) => res.json())
    .then((data) => levels = data);

document.addEventListener("click", () => {if (gameState == "menu") {clicked()}})
function clicked() {
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
            gameState = "editor";
            document.getElementById("editor-div").style.display = "block";
        }
    }
}

function checkClick(x1, x2, y1, y2) {
    if (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
        return true;
    }
    return false;
}