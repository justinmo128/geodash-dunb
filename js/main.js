let gameState, background, floor, newFloor, roof, player;
let maxX = 0;
const physicsTPS = 120;
let levelInfo = document.getElementById("level-info");
let levelInfoName = document.getElementById("level-info-name");
let levelInfoDiff = document.getElementById("level-info-diff");
let levelInfoDiffIcon = document.getElementById("level-info-difficon");
let currentTime = Date.now();
let deltaTime = 0;

class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = 30;
        this.w = 30;
        this.type = "block";
        this.hbx = this.x;
        this.hby = this.y;
        this.hbw = 30;
        this.hbh = 30;
        this.hbType = "blue";
    }
}

class Spike {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = 30;
        this.w = 30;
        this.type = "spike";
        this.hbx = this.x + 12;
        this.hby = this.y + 10;
        this.hbw = 6;
        this.hbh = 9;
        this.hbType = "red";
    }
}

class Slab {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.h = 15;
        this.w = 30;
        this.type = "slab";
        this.hbx = this.x;
        this.hby = this.y;
        this.hbw = 30;
        this.hbh = 15;
        this.hbType = "blue";
    }
}

class Portal {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.h = 90;
        this.w = 30;
        this.type = "portal";
        this.hbx = this.x;
        this.hby = this.y;
        this.hbw = 30;
        this.hbh = 90;
        this.hbType = "green";
        this.portalType = type.split("_").pop();
        this.activated = false;
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
        if (levelJSON.objects[i].type == "block") {
            gameObjs[i] = new Block(levelJSON.objects[i].x, levelJSON.objects[i].y)
        } else if (levelJSON.objects[i].type == "spike") {
            gameObjs[i] = new Spike(levelJSON.objects[i].x, levelJSON.objects[i].y)
        } else if (levelJSON.objects[i].type == "slab") {
            gameObjs[i] = new Slab(levelJSON.objects[i].x, levelJSON.objects[i].y)
        } else if (levelJSON.objects[i].type.split("_")[0] == "portal") {
            gameObjs[i] = new Portal(levelJSON.objects[i].x, levelJSON.objects[i].y, levelJSON.objects[i].type)
        }
        if (gameObjs[i].x > maxX) {
            maxX = gameObjs[i].x;
        }
    }
}

function initialize() {
    gameState = "gameLoop";
    player = {
        mode: "cube",
        x: 0,
        y: 0,
        w: 30,
        h: 30,
        bluehbx: 11,
        bluehby: 11,
        bluehbw: 8,
        bluehbh: 8,
        xVel: 311.58, // units per second, 30 units is a block
        gravity: -2851.5625, // units per second squared
        yVel: 0,
        grounded: true,
        dead: false,
        win: false,
        angle: 0
    };
    camera = {
        x: 0, y: 270
    };
    background = {
        colour: "#4287f5",
        x: 0,
        y: 0
    }
    floor = {
        colour: "#0548b3",
        y: 0
    }
    newFloor = {
        canCollide: false,
    }
    roof = {
        canCollide: false,
        h: 90
    };
    levelInfo.style.display = "flex";
    levelInfoName.innerHTML = levelJSON.name;
    levelInfoDiff.innerHTML = `${levelJSON.difficulty} ${getDifficulty(levelJSON.difficulty)}`;
    levelInfoDiffIcon.style.backgroundImage = `url(img/diff${getDifficulty(levelJSON.difficulty)}.png)`;
}

window.addEventListener("load", physics)
function physics() {
    deltaTime = Date.now() - currentTime;
    if (gameState == "gameLoop" && !player.dead) {
        applyGravity();
        if (keyHeld) {jump()}
        rotatePlayer();
        checkCollision();
        movePlayer();
        checkEnding();
    }
    currentTime = Date.now();
    setTimeout(physics, 1000/physicsTPS);
}

function applyGravity() {
    // player.y += player.yVel * deltaTime / 1000 * 0.5;
    // player.yVel += player.gravity * deltaTime / 1000;
    // player.y += player.yVel * deltaTime / 1000 * 0.5;

    player.y += player.yVel /physicsTPS * 0.5;
    player.yVel += player.gravity / physicsTPS;
    player.y += player.yVel /physicsTPS * 0.5;
    
    // Max Velocity
    if (player.yVel >= 480 && player.mode == "ship") {
        player.yVel = 480;
    } else if (player.yVel <= -384 && player.mode == "ship") {
        player.yVel = -384
    }  

    // Set Gravity
    if (player.mode == "cube") {
        if (player.yVel > -812.5) {
            player.gravity = -2851.5625;
        } else {
            player.gravity = 0;
        }
    } else if (player.mode == "ship") {
        if (keyHeld) {
            player.gravity = 0;
        } else if (player.yVel > 66) {
            player.gravity = -745.2;
        } else {
            player.gravity = -496.8;
        }
    }

    if (player.grounded || player.roofed) {
        player.yVel = 0;
    }
    if (player.roofed && !keyHeld) {
        player.roofed = false;
        player.y--;
    }
    player.bluehby = player.y + 11;
}

function rotatePlayer() {
    if (player.grounded || player.roofed) {
        if (player.mode == "cube") {
            let roundedAngle = Math.round(player.angle/90)*90;
            player.angle += 720/physicsTPS;
            if (player.angle > roundedAngle) {
                player.angle = roundedAngle;
            }
        } else if (player.mode == "ship") {
            if (player.roofed && player.angle !== 0) {
                player.angle += 500/physicsTPS;
                if (player.angle > 360) {
                    player.angle = 0;
                }
            } else {
                player.angle -= 500/physicsTPS;
                if (player.angle < 0) {
                    player.angle = 0;
                }
            }
        }
    } else {
        if (player.mode == "cube") {
            player.angle += 360/physicsTPS;
        } else if (player.mode == "ship") {
            player.angle = player.yVel / -8;
        }
    }
    player.angle = player.angle % 360;
    if (player.angle < 0) {
        player.angle = 360 + player.angle;
    }
}

function jump() {
    if (player.mode == "cube") {
        if (player.grounded) {
            player.yVel = 660;
        }
    } else if (player.mode == "ship" && player.y + player.h < roof.y && roof.canCollide && !player.roofed) {
        if (player.yVel > 66) {
            player.yVel += 621 / physicsTPS;
        } else {
            player.yVel += 761.4 / physicsTPS;
        }
    }
}

function movePlayer() {
    player.x += player.xVel / physicsTPS;
    player.bluehbx = player.x + 11;
}

function checkCollision() {
    // Object collision
    for (let i = 0; i < gameObjs.length; i++) {
        // Blue Player + Blue Obj (Running into blocks)
        if (collides(player.bluehbx, player.bluehby, player.bluehbw, player.bluehbh, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && gameObjs[i].hbType == "blue") {
            playerDeath();
            return;
        }
        // Red Player + Blue Obj (Landing on blocks)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && 
        gameObjs[i].hbType == "blue") {
            if (player.yVel <= 0 && player.y + player.bluehbh > gameObjs[i].y + gameObjs[i].h) {
                player.y = gameObjs[i].y + gameObjs[i].hbh;
                player.bluehby = player.y + 11;
                player.grounded = true;
                return;
            } else if (player.y + player.h - player.bluehbh < gameObjs[i].y && player.mode == "ship") {
                player.roofed = true;
                console.log(player.yVel)
                player.y = gameObjs[i].y - player.h;
                player.bluehby = player.y + 11;
                return;
            }
        }
        // Red Player + Red Obj (Spikes)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && gameObjs[i].hbType == "red") {
            playerDeath();
            return;
        }
        // Red Player + Green Obj (Portals, Orbs, Pads)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) &&
        gameObjs[i].type == "portal" && !gameObjs[i].activated) {
            if (player.mode !== gameObjs[i].portalType) {
                player.yVel = 0;
            }
            player.mode = gameObjs[i].portalType;
            if (gameObjs[i].portalType == "ship") {
                newFloor.y = gameObjs[i].y - 120;
                if (newFloor.y < 0) {
                    newFloor.y = 0;
                }
                ease(camera, [0, (newFloor.y + 315) - camera.y], 200, "linear")
                roof.y = newFloor.y + 390;
                newFloor.canCollide = true;
                roof.canCollide = true;
                player.angle = 0;
                gameObjs[i].activated = true;
            }
        }
    }
    // Ground, roof collision
    if (player.y <= 0) {
        player.y = 0;
        player.bluehby = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y <= newFloor.y && newFloor.canCollide) {
        player.y = newFloor.y;
        player.bluehby = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y + player.h >= roof.y - roof.h && roof.canCollide) {
        player.roofed = true;
        player.y = roof.y - roof.h - player.h;
        return;
    }
    player.grounded = false;
    player.roofed = false;
}

function collides(Ax, Ay, Aw, Ah, Bx, By, Bw, Bh) {
    if (Ax <= Bx + Bw &&
        Ax + Aw >= Bx &&
        Ay <= By + Bh &&
        Ay + Ah >= By) {
            return true;
    }
    return false;
}

function checkEnding() {
    if (player.x > maxX + 480 && !player.win) {
        player.win = true;
        setTimeout(initializeMenu, 2000)
    }
}

function playerDeath() {
    player.dead = true;
    setTimeout(initialize, 300)
}

function getDifficulty(n) {
    if (n == 10) {
        return "Demon";
    } else if (n >= 8) {
        return "Insane";
    } else if (n >= 6) {
        return "Harder";
    } else if (n >= 4) {
        return "Hard";
    } else if (n == 3) {
        return "Normal";
    } else {
        return "Easy";
    }
}