let keyHeld = false;
let mouseHeld = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener("keydown", (e) => {
    keyDown(e);
})
document.addEventListener("keyup", keyUp)
document.addEventListener("mousedown", (e) => {
    mouseDown(e);
})
document.addEventListener("mouseup", mouseUp)
document.addEventListener("touchstart", keyDown)
document.addEventListener("touchend", keyUp)

document.addEventListener("click", clicked)

document.addEventListener("mousemove", mousemoveHandler);
function mousemoveHandler(e) {
  // Get rectangle info about canvas location
  let cnvRect = cnv.getBoundingClientRect();

  // Calc mouse coordinates using mouse event and canvas location info
  mouseX = Math.round(e.clientX - cnvRect.left);
  mouseY = Math.round(e.clientY - cnvRect.top);
}

function mouseDown(e) {
    if (gameState == "gameLoop") {
        keyDown(e);
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
}

function keyDown(e) {
    keyHeld = true;
    editorKeys(e);
}
function keyUp() {
    keyHeld = false;
}

function clicked() {
    if (gameState == "menu") {
        clickInMenu();
    } else if (gameState == "editor") {
        clickInEditor();
    }
}