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
    yVel: 0,
    grounded: true
}

class gameOBJ {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.h = 30;
        this.w = 30;
        this.type = type;
        this.HBx = this.x;
        this.HBy = this.y;
        if (this.type == "spike") {
            this.HBx = this.x + 11;
            this.HBy = this.y + 10;
            this.HBw = 6;
            this.HBh = 10;
            this.hbType = "red";
        } else if (this.type == "block") {
            this.HBw = 30;
            this.HBh = 30;
            this.hbType = "blue";
        } else if (this.type == "slab") {
            this.HBw = 30;
            this.h = 15;
            this.HBh = 15;
            this.hbType = "blue";
        }
    }
}
// let spikes = [new Spike (1200, 0), new Spike(1230, 0), new Spike(1260, 0)]
let levelJSON;
let gameObjects = [];
fetch('stereomadness.json')
    .then((res) => res.json())
    .then((data) => levelJSON = data)
    .then(createGameObjects)
    .then(initialize);

function createGameObjects() {
    for (let i = 0; i < levelJSON.length; i++) {
        gameObjects[i] = new gameOBJ(levelJSON[i].x, levelJSON[i].y, levelJSON[i].type)
    }
}

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
        yVel: 0,
        grounded: true
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

function physics() {
    if (gameState == "gameLoop") {
        applyGravity();
        if (keyHeld) {jump()}
        movePlayer();
        checkCollision();
        setTimeout(physics, 50/3);
    }
}

function applyGravity() {
    player.y += player.yVel;
    player.yVel += player.gravity;

    if (player.grounded) {
        player.yVel = 0;
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.grounded) {
        player.yVel = 11;
    }
}

function movePlayer() {
    player.x += player.xSpeed / 60;
}

function checkCollision() {
    for (let i = 0; i < gameObjects.length; i++) {
        // Red Hitbox
        if (player.x < gameObjects[i].HBx + gameObjects[i].HBw &&
            player.x + 30 > gameObjects[i].HBx &&
            player.y < gameObjects[i].HBy + gameObjects[i].HBh &&
            player.y + 30 > gameObjects[i].HBy &&
            gameObjects[i].hbType == "red") {
                playerDeath();
                return;
        }
        // Blue Hitbox (over)
        else if (player.x < gameObjects[i].HBx + gameObjects[i].HBw &&
            player.x + 30 > gameObjects[i].HBx &&
            player.y <= gameObjects[i].HBy + gameObjects[i].HBh &&
            player.y + 30 >= gameObjects[i].HBy + gameObjects[i].HBh && 
            gameObjects[i].hbType == "blue") {
                player.y = gameObjects[i].y + gameObjects[i].HBh;
                player.grounded = true;
                return;
        }
        // Blue Hitbox (under)
        else if (player.x + 10 < gameObjects[i].HBx + gameObjects[i].HBw &&
            player.x + 20 > gameObjects[i].HBx &&
            player.y + 10 < gameObjects[i].HBy + gameObjects[i].HBh &&
            player.y + 20 > gameObjects[i].HBy && 
            gameObjects[i].hbType == "blue") {
                playerDeath();
                return;
        }
    }
    if (player.y <= 0) {
        player.y = 0;
        player.grounded = true;
        return;
    }
    player.grounded = false;
}

function playerDeath() {
    gameState = "death"
    for (let i = 0; i < 10; i++) {
        shakeScreen(i);
    }
    setTimeout(initialize, 300)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }