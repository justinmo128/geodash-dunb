// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 480;
cnv.height = 270;

// Global Variables
// 30 units = 1 block
let gameState = "gameLoop";
let keyHeld = false;
let background = {
    // colour: "#4287f5",
    colour: "white",
}
let floor = {
    // colour: "#0548b3",
    colour: "green",
    y: 0
};
let player = {
    colour: "red",
    mode: "cube",
    x: 0,
    y: 150,
    xSpeed: 311.284, // units per second
    xSpeedMod: 1,
    gravity: 0.5,
    yVel: 0
}
let camera = {
    x: 0,
    y: 0
}

class Spike {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xHitbox = this.x + 10;
        this.yHitbox = this.y + 5;
        this.HBwidth = 10;
        this.HBheight = 20;
    }
}
let spikes = [new Spike(1000, 30), new Spike (1200, 0)]

// Draw Function
window.addEventListener("load", draw);
function draw() {
    if (gameState === "gameLoop") {
        drawGame();
    }
    setTimeout(draw, 50/3);
}

function drawGame() {
    moveCamera();
    drawLevelComponents();
    drawPlayer();
}

function drawLevelComponents() {
    // Background
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Floor
    ctx.fillStyle = floor.colour;
    ctx.fillRect(0, 180, cnv.width, 90);
    // Spikes
    ctx.fillStyle = "black";
    for (let i = 0; i < spikes.length; i++) {
        ctx.fillRect(spikes[i].x - camera.x, camera.y - spikes[i].y, 30, 30);
    }
    
}

function drawPlayer() {
    if (player.mode == "cube") {
        ctx.fillStyle = player.colour;
        if (player.x < 90) {
            ctx.fillRect(player.x, player.y, 30, 30);
        } else {
            ctx.fillRect(player.x - camera.x + 90, player.y - camera.y + 150, 30, 30);
        }
        
    }
}

function keyDown() {
    keyHeld = true;
    jump();
}
function keyUp() {
    keyHeld = false;
}
// Event Listeners
window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
        keyDown();
    }
})
window.addEventListener("keyup", (e) => {
    if (e.key !== "Escape") {
        keyUp();
    }
})
window.addEventListener("mousedown", () => {
    keyDown();
})
window.addEventListener("mouseup", () => {
    keyUp();
})


window.addEventListener("load", physics);
function physics() {
    applyGravity();
    movePlayer();
    setTimeout(physics, 50/3);
}

function applyGravity() {
    player.y += player.yVel;
    player.yVel += player.gravity;
    
    if (player.yVel > 10) {
        player.yVel = 10;
    }
    if (player.y >= 150) {
        player.y = 150;
        setTimeout(() => {if (keyHeld) {jump()}}, 10);
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.y >= 150) {
        player.yVel = -9;
    }
}

function movePlayer() {
    player.x += player.xSpeed / 60;
}

function moveCamera() {
    if (player.x >= 90) {
        camera.x = player.x;
    }
    camera.y = 150;
}
