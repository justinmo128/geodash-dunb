let keyHeld = false;
let mouseHeld = false;
let mouseX = 0;
let mouseY = 0;
let coordX = 0;
let coordY = 0;
let snappedX = 0;
let snappedY = 0;

document.addEventListener("keydown", (e) => {
    keyDown(e);
})
document.addEventListener("keyup", keyUp)
document.addEventListener("mousedown", (e) => {
    mouseDown(e);
})
document.addEventListener("mouseup", mouseUp)
document.addEventListener("touchstart", mouseDown)
document.addEventListener("touchend", mouseUp)
document.addEventListener("click", clicked)
document.addEventListener("mousemove", mousemoveHandler);

function mousemoveHandler(e) {
  // Get rectangle info about canvas location
  let cnvRect = cnv.getBoundingClientRect();

  // Calc mouse coordinates using mouse event and canvas location info
  mouseX = Math.round(e.clientX - cnvRect.left);
  mouseY = Math.round(e.clientY - cnvRect.top);
  coordX = mouseX + camera.x;
  coordY = camera.y - mouseY + 270;
  snappedX = Math.floor((coordX)/30) * 30;
  snappedY = Math.floor((coordY)/30) * 30;
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

function keyDown(e) {
    if (e.key === "Escape") {
        escapePressed();
    } else if (gameState == "editor") {
        editorKeys(e);
    } else {
        bufferAvailable = true;
        keyHeld = true;
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
        gamePaused = !gamePaused;
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