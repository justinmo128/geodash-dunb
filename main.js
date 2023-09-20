// Global Variables
// 30 units = 1 block
let gameState = "menu";
let background = {
    colour: "#4287f5",
}
let floor = {
    colour: "#0548b3",
    y: 0,
};
let newFloor = {
    canCollide: false,
}
let roof = {
    canCollide: false,
};
let player = {
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
        } else if (this.type.slice(0, 6) == "portal") {
            this.HBw = 30;
            this.h = 90;
            this.HBh = 90;
            this.hbType = "green";
            this.portalType = this.type.split("_").pop();
            this.type = "portal";
        }
    }
}

let levelJSON;
let gameObjects = [];
function startLevel(levelName) {
    fetch(`levels/${levelName}.json`)
        .then((res) => res.json())
        .then((data) => levelJSON = data)
        .then(createGameObjects)
        .then(initialize);
}

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
    newFloor = {
        canCollide: false,
    }
    roof = {
        canCollide: false,
    };
    gameState = "gameLoop";
}

window.addEventListener("load", physics)
function physics() {
    if (gameState == "gameLoop") {
        applyGravity();
        if (keyHeld) {jump()}
        movePlayer();
        checkCollision();
        checkEnding();
    }
    setTimeout(physics, 50/3);
}

function applyGravity() {
    if (player.yVel >= 6 && player.mode == "ship") {
        player.yVel = 6;
    }
    player.y += player.yVel;
    if (player.mode == "cube") {
        player.gravity = -0.9;
    } else if (player.mode == "ship") {
        player.gravity = -0.6;
    }
    player.yVel += player.gravity;

    if (player.grounded) {
        player.yVel = 0;
    }
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.mode == "cube") {
        if (player.grounded) {
            player.yVel = 11;
        }
    } else if (player.mode == "ship") {
        player.yVel += 0.9;
    }
}

function movePlayer() {
    player.x += player.xSpeed / 60;
}

function checkCollision() {
    for (let i = 0; i < gameObjects.length; i++) {
        // Red Hitbox
        if (collides(gameObjects[i].HBx, gameObjects[i].HBy, gameObjects[i].HBw, gameObjects[i].HBh) && gameObjects[i].hbType == "red") {
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
        // Green Hitbox
        else if (player.x <= gameObjects[i].HBx + gameObjects[i].HBw &&
            player.x + 30 >= gameObjects[i].HBx &&
            player.y <= gameObjects[i].HBy + gameObjects[i].HBh &&
            player.y + 30 >= gameObjects[i].HBy &&
            gameObjects[i].hbType == "green") {
                if (gameObjects[i].type == "portal") {
                    player.mode = gameObjects[i].portalType;
                    if (gameObjects[i].portalType == "ship") {
                        newFloor.y = gameObjects[i].y - 120;
                        if (newFloor.y < 0) {
                            newFloor.y = 0;
                        }
                        camera.y = newFloor.y + 315;
                        roof.y = newFloor.y + 300;
                        newFloor.canCollide = true;
                        roof.canCollide = true;
                    }
                }
        }
    }
    if (player.y <= 0) {
        player.y = 0;
        player.grounded = true;
        return;
    } else if (player.y <= newFloor.y && newFloor.canCollide) {
        player.y = newFloor.y;
        player.grounded = true;
        return;
    } else if (player.y + 30 >= roof.y && roof.canCollide) {
        player.y = roof.y - 30;
    }
    player.grounded = false;
}

function collides(x, y, w, h) {
    if (player.x < x + w &&
        player.x + 30 > x &&
        player.y < y + h &&
        player.y + 30 > y) {
            return true;
    }
    return false;
}

function checkEnding() {
    if (player.x > gameObjects[gameObjects.length - 1].x + 480) {
        gameState = "win";
        setTimeout(() => (gameState = "menu"), 2000)
    }
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