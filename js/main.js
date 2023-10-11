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
    bluehbx: 11,
    bluehby: 11,
    bluehbw: 8,
    bluehbh: 8,
    xVel: 311.58, // units per second, 30 units is a block
    gravity: -2851.5625, // units per second squared
    yVel: 0,
    grounded: true,
    roofed: false,
    dead: false,
    win: false,
    angle: 0
}
let maxX = 0;
const physicsTPS = 120;
let levelInfo = document.getElementById("level-info");
let levelInfoName = document.getElementById("level-info-name");
let levelInfoDiff = document.getElementById("level-info-diff");
let levelInfoDiffIcon = document.getElementById("level-info-difficon");

class gameOBJ {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.h = 30;
        this.w = 30;
        this.type = type;
        this.hbx = this.x;
        this.hby = this.y;
        if (this.type == "spike") {
            this.hbx = this.x + 12;
            this.hby = this.y + 10;
            this.hbw = 6;
            this.hbh = 9;
            this.hbType = "red";
        } else if (this.type == "block") {
            this.hbw = 30;
            this.hbh = 30;
            this.hbType = "blue";
        } else if (this.type == "slab") {
            this.hbw = 30;
            this.h = 15;
            this.hbh = 15;
            this.hbType = "blue";
        } else if (this.type.slice(0, 6) == "portal") {
            this.hbw = 30;
            this.h = 90;
            this.hbh = 90;
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
        mode: "cube",
        x: 0,
        y: 0,
        w: 30,
        h: 30,
        bluehbx: 11,
        bluehby: 11,
        bluehbw: 8,
        bluehbh: 8,
        xVel: 311.58, // units per second
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
    levelInfo.style.display = "flex";
    levelInfoName.innerHTML = levelJSON.name;
    levelInfoDiff.innerHTML = `${levelJSON.difficulty} ${getDifficulty(levelJSON.difficulty)}`;
    levelInfoDiffIcon.style.backgroundImage = `url(img/diff${getDifficulty(levelJSON.difficulty)}.png)`;
}

window.addEventListener("load", physics)
function physics() {
    if (gameState == "gameLoop" && !player.dead) {
        applyGravity();
        rotatePlayer();
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

    if (player.yVel >= 480 && player.mode == "ship") {
        player.yVel = 480;
    } else if (player.yVel <= -384 && player.mode == "ship") {
        player.yVel = -384
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
        } else if (player.yVel > 66) {
            player.gravity = -745.2;
        } else {
            player.gravity = -496.8;
        }
    }
    if (player.roofed && !keyHeld) {
        player.y--;
        player.roofed = false;
    }
    if (player.grounded || player.roofed) {
        player.yVel = 0;
    }
    player.bluehby = player.y + 11;
}

function rotatePlayer() {
    if (player.grounded || player.roofed) {
        if (player.mode == "cube") {
            let roundedAngle = Math.round(player.angle/90)*90;
            player.angle += 450/physicsTPS;
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
            if (player.y + player.h < gameObjs[i].y + gameObjs[i].h) {
                if (player.mode == "ship") {
                    player.roofed = true;
                    player.y = gameObjs[i].y - player.h;
                    return;
                }
            } else if (player.y > gameObjs[i].y) {
                player.y = gameObjs[i].y + gameObjs[i].hbh;
                player.bluehby = player.y + 11;
                player.grounded = true;
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
        gameObjs[i].type == "portal") {
            if (player.mode !== gameObjs[i].portalType) {
                player.yVel = 0;
            }
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
                player.angle = 0;
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
    } else if (player.y + player.h >= roof.y && roof.canCollide) {
        player.roofed = true;
        player.y = roof.y - player.h;
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
        setTimeout(() => {
            gameState = "menu"
        }  , 2000)
    }
}

function playerDeath() {
    player.dead = true;
    player.xVel = 0;
    player.yVel = 0;
    // for (let i = 0; i < 10; i++) {
    //     shakeScreen(i);
    // }
    setTimeout(initialize, 300)
}

function getDifficulty(diffNum) {
    if (diffNum == 10) {
        return "Demon";
    } else if (diffNum >= 8) {
        return "Insane";
    } else if (diffNum >= 6) {
        return "Harder";
    } else if (diffNum >= 4) {
        return "Hard";
    } else if (diffNum == 3) {
        return "Normal";
    } else {
        return "Easy";
    }
}