// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 960;
cnv.height = 540;

// Global Variables
let gameState = "gameLoop";
let currentTime = 0;
let lastFrameOccurence = 0;
let background = {
    colour: "#4287f5",
}
let floor = {
    colour: "#0548b3",
    y: 360
};
let player = {
    colour: "#eef20f",
    mode: "cube",
    y: 300,
    xSpeed: 10.376,
    xSpeedMod: 1,
    ySpeed: 0
}

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

window.addEventListener("load", physics);
function physics() {
    applyGravity();
    setTimeout(physics, 1000/120);
}

function drawMainComponents() {
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
    drawLevelComponents();
    drawMainComponents();
    drawPlayer();
}

function drawLevelComponents() {
    // Background
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Floor
    ctx.fillStyle = floor.colour;
    ctx.fillRect(0, floor.y, cnv.width, 180);
}

function drawPlayer() {
    if (player.mode = "cube") {
        ctx.fillStyle = player.colour;
        ctx.fillRect(160, player.y, 60, 60)
    }
}

// Event Listeners
// Key down handler
window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
        keyDown = true;
        jump();
    }
})

// Key up handler
window.addEventListener("keyup", (e) => {
    if (e.key !== "Escape") {
        keyDown = false;
    }
})

// Mouse down handler
window.addEventListener("mousedown", () => {
    keyDown = true;
    jump();
})

// Mouse up handler
window.addEventListener("mouseup", () => {
    keyDown = true;
})

function applyGravity() {
    player.ySpeed += 0.4;
    player.y += player.ySpeed;
    if (player.y >= floor.y - 60) {
        player.y = floor.y - 60
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    player.ySpeed = -10
}