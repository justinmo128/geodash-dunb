let keyHeld = false;
let mouseHeld = false;
let mouseX = 0;
let mouseY = 0;
let coordX = 0;
let coordY = 0;
let snappedX = 0;
let snappedY = 0;
let K = 1;
let keyPressTIme = 0;

document.addEventListener("keydown", (e) => {
    keyDown(e);
})
document.addEventListener("keyup", keyUp)
document.addEventListener("mousedown", (e) => {
    mouseDown(e);
})
document.addEventListener("mouseup", mouseUp)
document.addEventListener("touchstart", touchstart)
document.addEventListener("touchend", mouseUp)
document.addEventListener("click", clicked)
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("touchmove", touchmoveHandler);

function mousemoveHandler(e) {
    // Get rectangle info about canvas location
    let cnvRect = cnv.getBoundingClientRect();
    K = cnvRect.width / cnv.width;

    // Calc mouse coordinates using mouse event and canvas location info
    mouseX = Math.round(e.clientX - cnvRect.left) / K;
    mouseY = Math.round(e.clientY - cnvRect.top) / K;
    coordX = mouseX + camera.x;
    coordY = camera.y - mouseY + 270;
    snappedX = floorToNearest(coordX, 30);
    snappedY = floorToNearest(coordY, 30);
}

function touchmoveHandler(e) {
    // Get rectangle info about canvas location
    let cnvRect = cnv.getBoundingClientRect();
    K = cnvRect.width / cnv.width;

    // Calc mouse coordinates using mouse event and canvas location info
    mouseX = Math.round(e.touches[0].clientX - cnvRect.left) / K;
    mouseY = Math.round(e.touches[0].clientY - cnvRect.top) / K;
    coordX = mouseX + camera.x;
    coordY = camera.y - mouseY + 270;
    snappedX = floorToNearest(coordX, 30);
    snappedY = floorToNearest(coordY, 30);
}

function mouseDown(e) {
    if (gameState == "gameLoop" && !gamePaused) {
        keyDown(e);
    } else if (gameState == "gameLoop" && gamePaused) {
        clickInPause();
    } else if (gameState == "menu") {
        clickInMenu();
    } else if (gameState == "editor") {
        mouseHeld = true;
        initMouseX = mouseX;
        initMouseY = mouseY;
        initCamX = camera.x;
        initCamY = camera.y;
    }
}
function mouseUp() {
    keyUp();
    mouseHeld = false;
    swipeObjs = [];
}

function touchstart(e) {
    if (gameState == "gameLoop" && !gamePaused) {
        keyDown("hi");
    } else if (gameState == "gameLoop" && gamePaused) {
        clickInPause();
    } else if (gameState == "editor") {
        mouseHeld = true;
        initMouseX = Math.round(e.touches[0].clientX - cnvRect.left) / K;
        initMouseY = Math.round(e.touches[0].clientY - cnvRect.top) / K;
        initCamX = camera.x;
        initCamY = camera.y;
    }
}

function keyDown(e) {
    if (e.key === "Escape") {
        escapePressed();
    } else if (gameState == "editor") {
        editorKeys(e);
    } else {
        bufferAvailable = true;
        keyHeld = true;
        keyPressTIme = levelTime;
    }
}

function escapePressed() {
    if (gameState == "menu") {
        if (menuState == "mainLevels" || menuState == "editorMenu") {
            menuState = "top";
        }
    } else if (gameState == "editor") {
        initializeMenu();
    } else if (gameState == "gameLoop") {
        if (!gamePaused) {
            pauseGame();
        } else {
            unpauseGame();
        }
    }
}
function keyUp() {
    keyHeld = false;
    bufferAvailable = false;
}

function clicked() {
    if (gameState == "editor") {
        clickInEditor();
    }
}