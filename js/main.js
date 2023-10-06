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
    w: 30,
    h: 30,
    blueHBx: 11,
    blueHBy: 11,
    blueHBw: 8,
    blueHBh: 8,
    xSpeed: 311.58, // units per second
    gravity: -2851.5625, // units per second squared
    yVel: 0,
    grounded: true,
    dead: false,
    win: false
}
let maxX = 0;
const physicsTPS = 60;

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
            this.HBx = this.x + 12;
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
let gameObjs = [];
function startLevel(levelName) {
    fetch(`levels/${levelName}.json`)
        .then((res) => res.json())
        .then((data) => levelJSON = data)
        .then(createGameObjects)
        .then(initialize);
}

function createGameObjects() {
    for (let i = 0; i < levelJSON.objects.length; i++) {
        gameObjs[i] = new gameOBJ(levelJSON.objects[i].x, levelJSON.objects[i].y, levelJSON.objects[i].type);
        if (gameObjs[i].x > maxX) {
            maxX = gameObjs[i].x;
        }
    }
}

function initialize() {
    gameState = "gameLoop";
    player = {
        colour: "lime",
        mode: "cube",
        x: 0,
        y: 0,
        w: 30,
        h: 30,
        blueHBx: 11,
        blueHBy: 11,
        blueHBw: 8,
        blueHBh: 8,
        xSpeed: 311.58, // units per second
        xSpeedMod: 1,
        gravity: -2851.5625,
        yVel: 0,
        grounded: true,
        win: false
    };
    camera = {
        x: 0, y: 270
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
}

window.addEventListener("load", physics)
function physics() {
    if (gameState == "gameLoop" && !player.dead) {
        applyGravity();
        if (keyHeld) {jump()}
        movePlayer();
        checkCollision();
        checkEnding();
    }
    setTimeout(physics, 1000/physicsTPS);
}

function applyGravity() {
    player.y += player.yVel / physicsTPS;
    player.yVel += player.gravity / physicsTPS;

    if (player.yVel >= 14400 && player.mode == "ship") {
        player.yVel = 14400;
    }

    if (player.mode == "cube") {
        if (player.yVel > -812.5) {
            player.gravity = -2851.5625;
        } else {
            player.gravity = 0;
        }
    } else if (player.mode == "ship") {
        if (keyHeld) {
            player.gravity = 0;
        } else {
            player.gravity = -496.8;
        }
    }

    if (player.grounded) {
        player.yVel = 0;
    }
    player.blueHBy = player.y + 11;
}

function jump() {
    // Jump height 3 blocks
    // Jump length 3.6 blocks
    if (player.mode == "cube") {
        if (player.grounded) {
            player.yVel = 660;
        }
    } else if (player.mode == "ship") {
        player.yVel += 10.56;
    }
}

function movePlayer() {
    player.x += player.xSpeed / physicsTPS;
    player.blueHBx = player.x + 11;
}

function checkCollision() {

    // CLEAN THIS UP LATER!!!
    
    for (let i = 0; i < gameObjs.length; i++) {
        // Blue Hitbox (over)
        if (collides(player.x, player.y, player.w, 1, gameObjs[i].HBx, gameObjs[i].HBy, gameObjs[i].HBw, gameObjs[i].HBh) && 
        gameObjs[i].hbType == "blue") {
            player.y = gameObjs[i].y + gameObjs[i].HBh;
            player.blueHBy = player.y + 11;
            player.grounded = true;
        }
        // Red Hitbox
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].HBx, gameObjs[i].HBy, gameObjs[i].HBw, gameObjs[i].HBh) && gameObjs[i].hbType == "red") {
            playerDeath();
        }
        // Blue Hitbox (under)
        else if (collides(player.blueHBx, player.blueHBy, player.blueHBw, player.blueHBh, gameObjs[i].HBx, gameObjs[i].HBy, gameObjs[i].HBw, gameObjs[i].HBh) && gameObjs[i].hbType == "blue") {
            playerDeath();
        }
        // Green Hitbox
        else if (player.x <= gameObjs[i].HBx + gameObjs[i].HBw &&
            player.x + 30 >= gameObjs[i].HBx &&
            player.y <= gameObjs[i].HBy + gameObjs[i].HBh &&
            player.y + 30 >= gameObjs[i].HBy &&
            gameObjs[i].hbType == "green") {
                if (gameObjs[i].type == "portal") {
                    player.mode = gameObjs[i].portalType;
                    if (gameObjs[i].portalType == "ship") {
                        newFloor.y = gameObjs[i].y - 120;
                        if (newFloor.y < 0) {
                            newFloor.y = 0;
                        }
                        camera.y = newFloor.y + 315;
                        roof.y = newFloor.y + 300;
                        newFloor.canCollide = true;
                        roof.canCollide = true;
                        player.yVel = 0;
                    }
                }
        }
    }
    if (player.y <= 0) {
        player.y = 0;
        player.blueHBy = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y <= newFloor.y && newFloor.canCollide) {
        player.y = newFloor.y;
        player.blueHBy = player.y + 11;
        return;
    } else if (player.y + player.h >= roof.y && roof.canCollide) {
        player.y = roof.y - 30;
        if (keyHeld) {
            player.yVel = 0;
        }
    }
    player.grounded = false;
}

function collides(Ax, Ay, Aw, Ah, Bx, By, Bw, Bh) {
    if (Ax < Bx + Bw &&
        Ax + Aw > Bx &&
        Ay < By + Bh &&
        Ay + Ah > By) {
            return true;
    }
    return false;
}

function checkEnding() {
    if (player.x > maxX + 480 && !player.win) {
        player.win = true;
        setTimeout(() => {
            gameState = "menu"
        }  , 2000)
    }
}

function playerDeath() {
    player.dead = true;
    for (let i = 0; i < 10; i++) {
        // shakeScreen(i);
    }
    setTimeout(initialize, 300)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}