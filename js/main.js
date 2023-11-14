let gameState, background, floor, newFloor, roof, player;
let maxX = 0;
const physicsTPS = 240;
let levelInfo = document.getElementById("level-info");
let levelInfoName = document.getElementById("level-info-name");
let levelInfoDiff = document.getElementById("level-info-diff");
let levelInfoDiffIcon = document.getElementById("level-info-difficon");
let cubeTransition = false;
let gamePaused = false;
let pauseVisible = true;
let lastUpdate = performance.now();
let deltaTime = 0;

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
            hasHitbox: objProps.hasHitbox,
            isPortal: objProps.isPortal,
            activated: false
        })
        if (gameObjs[i].isPortal) {
            gameObjs[i].portalType = objProps.portalType;
        }
        if (gameObjs[i].hasHitbox) {
            gameObjs[i].hbx = levelJSON.objects[i].x + objProps.hbx;
            gameObjs[i].hby = levelJSON.objects[i].y + objProps.hby;
            gameObjs[i].hbw = objProps.hbw;
            gameObjs[i].hbh = objProps.hbh;
            gameObjs[i].hbType = objProps.hbType;
        }
        if (gameObjs[i].angle !== 0) {
            rotateObject(gameObjs[i], 0, true);
            translateAfterRotation(gameObjs[i], levelJSON.objects[i]);
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
    gamePaused = false;
    player = {
        mode: "cube",
        x: 0,
        y: 0,
        w: 30,
        h: 30,
        bluehbx: 10,
        bluehby: 10,
        bluehbw: 8,
        bluehbh: 8,
        xVel: 311.579742, // units per second, 30 units is a block
        gravity: -2851.5625, // units per second squared
        yVel: 0,
        grounded: true,
        dead: false,
        win: false,
        easing: false,
        easeId: 0,
        angle: 0
    };
    camera = {
        x: 0,
        y: 0,
        easing: false,
        easeId: 0
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
        hby: 0,
        easeId: 0
    }
    roof = {
        canCollide: false,
        h: 90,
        y: 390,
        hby: 390,
        easeId: 0
    };
    levelInfo.style.display = "flex";
    levelInfoName.innerHTML = levelJSON.name;
    levelInfoDiff.innerHTML = `${levelJSON.difficulty} ${getDifficulty(levelJSON.difficulty)}`;
    levelInfoDiffIcon.style.backgroundImage = `url(img/diff${getDifficulty(levelJSON.difficulty)}.png)`;
}

setInterval(physics, 1000/physicsTPS)
function physics() {
    let now = performance.now();
    deltaTime = now - lastUpdate;
    lastUpdate = now;
    if (gameState == "gameLoop" && !player.dead && !gamePaused) {
        applyGravity();
        if (keyHeld) {jump()}
        rotatePlayer();
        movePlayer();
        checkFloorRoofCollision();
        checkCollision();
        checkEnding();
    }
}

function applyGravity() {
    // Max Velocity
    if (player.yVel >= 432 && player.mode == "ship") {
        player.yVel = 432;
    } else if (player.yVel <= -345.6 && player.mode == "ship") {
        player.yVel = -345.6
    }  

    // Apply Velocity and Gravity
    player.y += player.yVel /(1000/deltaTime) * 0.5;
    player.yVel += player.gravity / (1000/deltaTime);
    player.y += player.yVel /(1000/deltaTime) * 0.5;
    
    // Set Gravity
    if (player.mode == "cube") {
        if (player.yVel > -810) {
            player.gravity = -2472;
        } else {
            player.gravity = 0;
        }
    } else if (player.mode == "ship") {
        if (keyHeld) {
            player.gravity = 0;
        } else if (player.yVel > 110) {
            player.gravity = -1419.584;
        } else {
            player.gravity = -894.11526;
        }
    }

    if (player.grounded || player.roofed) {
        player.yVel = 0;
    }
    if (player.roofed && !keyHeld) {
        player.y--;
    }
    player.bluehby = player.y + 11;
}

function rotatePlayer() {
    if (player.grounded && player.mode == "cube") {
        let roundedAngle = Math.round(player.angle/90)*90;
        let angleDiff = roundedAngle - player.angle;
        if (!player.easing && player.angle % 90 != 0) {
            player.easing = true;
            ease(player, [0, 0, angleDiff], angleDiff * 2, "linear", () => {player.easing = false}, true, true);
        }
    } else if (!player.easing && player.mode == "ship" && player.roofed || !player.easing && player.mode == "ship" && player.grounded) {
        player.easing = true;
        ease(player, [0, 0, 0-player.angle], 100, "linear", () => {player.easing = false}, true, true);
    } else {
        if (player.mode == "cube") {
            clearEase(player)
            player.angle += 380/(1000/deltaTime);
        } else if (player.mode == "ship" && !player.easing) {
            player.angle = Math.atan(player.yVel/player.xVel) * -180 / Math.PI;
        }
    }
    player.angle = player.angle % 360;
}

function jump() {
    if (player.mode == "cube" && player.grounded) {
        player.yVel = 556.2;
        // To convert from GD velocity to my velocity, multiply by 54
    } else if (player.mode == "ship" && player.y + player.h < roof.y && roof.canCollide && !player.roofed) {
        if (player.yVel > 120) {
            player.yVel += 1180.5102 / (1000/deltaTime);
        } else {
            player.yVel += 1341.1656 / (1000/deltaTime);
        }
    }
}

function movePlayer() {
    player.x += player.xVel / (1000/deltaTime);
    player.bluehbx = player.x + 11;
}

function checkEnding() {
    if (player.x > maxX + 480 && !player.win) {
        player.win = true;
        setTimeout(initializeMenu, 2000)
    }
}

function pauseGame() {
    gamePaused = true;
    pauseVisible = true;
}

function clickInPause() {
    if (pauseVisible) {
        if (checkClick(190, 290, 113, 217)) {
            gamePaused = false;
        } else if (checkClick(26, 96, 129, 202)) {
            pauseVisible = false;
        } else if (checkClick(108, 178, 129, 202)) {
            // This button does nothing because I decided to not implement the functionality.
        } else if (checkClick(302, 372, 129, 202)) {
            initializeMenu();
        } else if (checkClick(384, 454, 129, 202)) {
            initialize();
        }
    } else if (checkClick(6, 46, 284, 344)) {
        pauseVisible = true;
    }
}