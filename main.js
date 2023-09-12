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
    colour: "#4287f5",
}
let floor = {
    colour: "#0548b3",
};
let player = {
    colour: "lime",
    mode: "cube",
    x: 0,
    y: 0,
    xSpeed: 311.284, // units per second
    xSpeedMod: 1,
    gravity: -0.9,
    yVel: 0
}
let camera = {
    x: 0,
    y: 180
}

class Spike {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.HBx = this.x + 11;
        this.HBy = this.y + 10;
        this.HBw = 6;
        this.HBh = 10;
    }
}
let spikes = [new Spike (1200, 0), new Spike(1230, 0), new Spike(1260, 0)]

class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
let blocks = [];

function initialize() {
    camera = {
        x: 0, y: 180
    };
    player = {
        colour: "lime",
        mode: "cube",
        x: 0,
        y: 0,
        xSpeed: 311.284, // units per second
        xSpeedMod: 1,
        gravity: -0.9,
        yVel: 0
    };
    background = {
        colour: "#4287f5",
    }
    floor = {
        colour: "#0548b3",
    }
    gameState = "gameLoop";
    physics();
}

// Draw Function
window.addEventListener("load", draw);
function draw() {
    drawGame();
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
        drawSpike(spikes[i].x, spikes[i].y);
    }
}

function drawPlayer() {
    if (player.mode == "cube") {
        ctx.fillStyle = player.colour;
        if (player.x < 90) {
            ctx.fillRect(player.x, camera.y - player.y - 30, 30, 30);
        } else {
            fillRectCam(player.x, player.y, 30, 30)
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
    if (gameState == "gameLoop") {
        applyGravity();
        movePlayer();
        checkCollision();
        setTimeout(physics, 50/3);
    }
}

function applyGravity() {
    player.y += player.yVel;
    player.yVel += player.gravity;
    
    if (player.yVel < -10) {
        player.yVel = -10;
    }
    if (player.y <= 0) {
        player.y = 0;
        setTimeout(() => {if (keyHeld) {jump()}}, 10);
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.y <= 0) {
        player.yVel = 11;
    }
}

function movePlayer() {
    player.x += player.xSpeed / 60;
}

function checkCollision() {
    for (let i = 0; i < spikes.length; i++) {
        if (player.x <= spikes[i].HBx + spikes[i].HBw &&
            player.x + 30 >= spikes[i].HBx &&
            player.y <= spikes[i].HBy + spikes[i].HBh &&
            player.y + 30 >= spikes[i].HBy) {
                playerDeath();
            }
    }
}

function moveCamera() {
    if (gameState !== "death") {
        camera.x = player.x - 90;
    }
}

function drawSpike(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - camera.x + 15, camera.y - y - 30);
    ctx.lineTo(x - camera.x + 30, camera.y - y);
    ctx.lineTo(x - camera.x, camera.y - y);
    ctx.fill();
}

function fillRectCam(x, y, w, h) {
    ctx.fillRect(x - camera.x, camera.y - y - h, w, h);
}

function playerDeath() {
    gameState = "death"
    for (let i = 0; i < 10; i++) {
        shakeScreen(i);
    }
    setTimeout(initialize, 300)
}

function shakeScreen(loopAmt) {
    let oldCamerax = camera.x;
    let oldCameray = camera.y
    setTimeout(() => {
        camera.x = oldCamerax + (getRandomInt(-50, 50));
        camera.y = oldCameray + (getRandomInt(-20, 20));
    }, 30 * loopAmt)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }