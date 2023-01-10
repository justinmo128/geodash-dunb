// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 960;
cnv.height = 540;

// Global Variables
// 60 pixels = 30 units
// 30 units = 1 block
let gameState = "gameLoop";
let currentTime = 0;
let lastTime = 0
let lastFrameOccurence = 0;
let timeDiff = 0;
let background = {
    colour: "#4287f5",
}
let floor = {
    colour: "#0548b3",
    y: 0
};
let player = {
    colour: "red",
    mode: "cube",
    x: 160,
    y: 300,
    xSpeed: 311.284,
    xSpeedMod: 1,
    ySpeed: 0
}
let camera = {
    x: 0,
    y: 0
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
    timeDiff = currentTime - lastFrameOccurence;
    lastTime = currentTime;
}

window.addEventListener("load", physics);
function physics() {
    moveCamera();
    applyGravity();
    movePlayer();
    setTimeout(physics, 0);
}

function drawMainComponents() {
    // FPS
    ctx.textAlign = "left"
    let fps = 1000 / (currentTime - lastFrameOccurence);
    lastFrameOccurence = currentTime;
    fps = Math.round(fps);
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
    ctx.fillRect(0, 360, cnv.width, 180);
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
    player.ySpeed += 60 / 1000 * timeDiff;
    player.y += player.ySpeed;
    if (player.y >= 300) {
        player.y = 300;
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.y >= 300) {
        player.ySpeed = -10;
    }
}

function movePlayer() {
    player.x += player.xSpeed / 500 * timeDiff;
    
    if (player.y !== 300) {
        console.log((player.x / 60).toFixed(2), (5 - player.y / 60).toFixed(2))
    }
}

function moveCamera() {
    camera.x = player.x + 160;
    // camera.y = player.y + 300;
}