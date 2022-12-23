// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 960;
cnv.height = 540;

// Global Variables
let gameState = "gameLoop";
let currentTime = 0;
let lastFrameOccurence = 0;

// Draw Function
window.addEventListener("load", draw);
function draw() {
    if (gameState === "gameLoop") {
        drawGame();
    }
    // Request Animation Frame
    // requestAnimationFrame(draw);
    setTimeout(draw, 0);
    currentTime = performance.now();
}

function drawMainComponents() {
    // Background
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // FPS
    ctx.textAlign = "left"
    let fps = 1000 / (currentTime - lastFrameOccurence);
    fps = Math.round(fps);
    lastFrameOccurence = currentTime;
    ctx.font = "14px Roboto";
    ctx.fillStyle = "white";
    ctx.fillText(`FPS: ${fps}`, 10, 20)
}

function drawGame() {
    drawMainComponents();
}