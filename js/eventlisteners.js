let keyHeld = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
        keyDown();
    }
})
document.addEventListener("keyup", (e) => {
    if (e.key !== "Escape") {
        keyUp();
    }
})
document.addEventListener("mousedown", () => {
    keyDown();
})
document.addEventListener("mouseup", () => {
    keyUp();
})

document.addEventListener("touchstart", () => {
    keyDown();
})
document.addEventListener("touchend", () => {
    keyUp();
})

document.addEventListener("click", clicked)

document.addEventListener("mousemove", mousemoveHandler);
function mousemoveHandler(e) {
  // Get rectangle info about canvas location
  let cnvRect = cnv.getBoundingClientRect();

  // Calc mouse coordinates using mouse event and canvas location info
  mouseX = Math.round(e.clientX - cnvRect.left);
  mouseY = Math.round(e.clientY - cnvRect.top);
}

function keyDown() {
    keyHeld = true;
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


function checkClick(x1, x2, y1, y2) {
    if (mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
        return true;
    }
    return false;
}