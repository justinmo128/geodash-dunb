// Helicopter Game Start
let mouseIsHeld = true;

// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables (Once)
let heliImg = document.createElement("img");
heliImg.src = "img/heliBlueTransparent.png";

let explosion = document.createElement("audio");
explosion.src = "sound/explosion.wav";

let propeller = document.createElement("audio");
propeller.src = "sound/propeller.wav";

let mouseIsPressed = false;

// Global Variables (Reset)
let state;
let heli;
let wall1, wall2, wall3;
let distance;
let bestScore = 0;
reset();

// Draw Function
window.addEventListener("load", draw);

function draw() {
  if (state === "start") {
    drawStart();
  } else if (state === "gameon") {
    gameLoop();
  } else if (state === "gameover") {
    drawGameOver();
  }

  // Request Animation Frame
  requestAnimationFrame(draw);
}

// EVENT STUFF
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);

function mousedownHandler() {
  mouseIsPressed = true;
  mouseIsHeld = false;

  // Play propeller sound
  if (state === "gameon" || state === "start") {
    propeller.currentTime = 0;
    propeller.play();
  }

  // Start game on mousedown
  if (state === "start") {
    state = "gameon";
  } else if (state === "gameon") {
    gameLoop();
  }
}

function mouseupHandler() {
  mouseIsPressed = false;
  mouseIsHeld = false;

  // Stop propeller sound
  propeller.pause();
}