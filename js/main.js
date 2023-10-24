let gameState, background, floor, newFloor, roof, player;
let maxX = 0;
const physicsTPS = 120;
let levelInfo = document.getElementById("level-info");
let levelInfoName = document.getElementById("level-info-name");
let levelInfoDiff = document.getElementById("level-info-diff");
let levelInfoDiffIcon = document.getElementById("level-info-difficon");
let cubeTransition = false;

let levelJSON = [];
let gameObjs = [];
function startLevel(levelName) {
    fetch(`levels/${levelName}.json`)
        .then((res) => res.json())
        .then((data) => levelJSON = data)
        .then(createGameObjects)
        .then(initialize);
}

function createGameObjects() {
    maxX = 0;
    gameObjs = [];
    for (let i = 0; i < levelJSON.objects.length; i++) {
        let objProps = objectList.find((element) => levelJSON.objects[i].id == element.id)

        gameObjs.push({
            id: levelJSON.objects[i].id,
            x: levelJSON.objects[i].x,
            y: levelJSON.objects[i].y,
            angle: levelJSON.objects[i].angle,
            h: objProps.h,
            w: objProps.w,
            hbx: levelJSON.objects[i].x + objProps.hbx,
            hby: levelJSON.objects[i].y + objProps.hby,
            hbw: objProps.hbw,
            hbh: objProps.hbh,
            hbType: objProps.hbType,
            isPortal: objProps.isPortal,
            activated: false
        })
        if (gameObjs[i].isPortal) {
            gameObjs[i].portalType = objProps.portalType;
        }
        if (gameObjs[i].angle !== 0) {
            rotateObject(gameObjs[i], 0, true);
            let xDiff = gameObjs[i].x - levelJSON.objects[i].x;
            console.log(xDiff)
            let yDiff = gameObjs[i].y - levelJSON.objects[i].y;
            gameObjs[i].x -= xDiff;
            gameObjs[i].y -= yDiff;
            gameObjs[i].hbx -= xDiff;
            gameObjs[i].hby -= yDiff;
        }

        if (gameObjs[i].x > maxX) {
            maxX = gameObjs[i].x;
        }
    }
}

function initialize() {
    for (let i = 0; i < gameObjs.length; i++) {
        gameObjs[i].activated = false;
    }
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
        xVel: 311.579742, // units per second, 30 units is a block
        gravity: -2851.5625, // units per second squared
        yVel: 0,
        grounded: true,
        dead: false,
        win: false,
        easing: false,
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
        y: 0,
        hby: 0
    }
    roof = {
        canCollide: false,
        h: 90,
        y: 390,
        hby: 390
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
        if (keyHeld) {jump()}
        rotatePlayer();
        checkCollision();
        movePlayer();
        checkEnding();
    }
    setTimeout(physics, 1000/physicsTPS);
}

function applyGravity() {
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
    if (player.grounded && player.mode == "cube") {
        let roundedAngle = Math.round(player.angle/90)*90;
        let angleDiff = roundedAngle - player.angle;
        if (!player.easing) {
            player.easing = true;
            ease(player, [0, 0, angleDiff], angleDiff * 2, "linear", () => {player.easing = false}, true, true);
        }
    } else {
        if (player.mode == "cube") {
            player.angle += 360/physicsTPS;
        } else if (player.mode == "ship" && !player.easing) {
            player.angle = player.yVel / -8;
        }
    }
    player.angle = player.angle % 360;
}

function jump() {
    if (player.mode == "cube") {
        if (player.grounded) {
            player.yVel = 620;
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

function checkEnding() {
    if (player.x > maxX + 480 && !player.win) {
        player.win = true;
        setTimeout(initializeMenu, 2000)
    }
}