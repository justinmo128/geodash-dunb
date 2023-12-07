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
let showHitboxes = false;
let levelTime = 0;
let activeTriggers = [];
let song;

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
            type: objProps.type,
            activated: false,
        })
        if (gameObjs[i].w < 30 || gameObjs[i].h < 30) {
            gameObjs[i].rotCenter = [gameObjs[i].x + 15, gameObjs[i].y + 15];
        } else {
            gameObjs[i].rotCenter = [gameObjs[i].x + gameObjs[i].w / 2, gameObjs[i].y + gameObjs[i].h / 2];
        }
        if (gameObjs[i].type == "portal") {
            gameObjs[i].portalType = objProps.portalType;
        } else if (gameObjs[i].type == "pad") {
            gameObjs[i].padType = objProps.padType;
        } else if (gameObjs[i].type == "orb") {
            gameObjs[i].orbType = objProps.orbType;
        } else if (gameObjs[i].type == "trigger") {
            gameObjs[i].colour = levelJSON.objects[i].colour;
            gameObjs[i].fadeTime = levelJSON.objects[i].fadeTime;
            gameObjs[i].target = levelJSON.objects[i].target;
            gameObjs[i].touchActivated = levelJSON.objects[i].touchActivated;
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
    song = new Audio(`songs/${levelJSON.song}`);
}

function initialize() {
    document.getElementById("pause-box").style.display = "block";
    document.getElementById("pause-balance").style.display = "block";
    for (let i = 0; i < gameObjs.length; i++) {
        gameObjs[i].activated = false;
    }
    gameState = "gameLoop";
    levelTime = 0;
    activeTriggers = [];
    gamePaused = false;
    player = {
        mode: levelJSON.mode,
        x: 0,
        y: 0,
        oldx: 0,
        oldy: 0,
        w: 30,
        h: 30,
        bluehbx: 10,
        bluehby: 10,
        bluehbw: 8,
        bluehbh: 8,
        xVel: 311.576, // units per second, 30 units is a block
        gravity: -2851.5625, // units per second squared
        gravityStatus: 1,
        yVel: 0,
        grounded: true,
        dead: false,
        win: false,
        easing: false,
        easeId: 0,
        angle: 0,
        touchingBlock: false,
        touchingOrb: [],
        ballRotStatus: 1
    };
    camera = {
        x: 0,
        y: 0,
        easing: false,
        easeId: 0
    };
    background = {
        colour: levelJSON.bgCol,
        x: 0,
        y: 0,
        fadeStart: 0
    }
    floor = {
        colour: levelJSON.floorCol,
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
        easeId: 0,
        fadeStart: 0
    };
    levelInfo.style.display = "flex";
    levelInfoName.innerHTML = levelJSON.name;
    levelInfoDiff.innerHTML = `${levelJSON.difficulty} ${getDifficulty(levelJSON.difficulty)}`;
    levelInfoDiffIcon.style.backgroundImage = `url(img/diff${getDifficulty(levelJSON.difficulty)}.png)`;
    song.currentTime = 0;
    song.play();
}

setInterval(gameLoop, 1000/physicsTPS)
function gameLoop() {
    let now = performance.now();
    deltaTime = now - lastUpdate;
    lastUpdate = now;
    if (gameState == "gameLoop" && !player.dead && !gamePaused) {
        levelTime += deltaTime;
        player.oldx = player.x;
        player.oldy = player.y;
        updateTriggers();
        movePlayer();
        if (keyHeld) {jump()}
        applyGravity();
        checkCollision();
        rotatePlayer();
        checkEnding();
    } else if (gameState == "editor") {
        swipe();
        moveEditorCam();
    }
}

function updateTriggers() {
    for (let i = 0; i < activeTriggers.length; i++) {
        let timePassed = (levelTime - activeTriggers[i].startTime) / 1000;
        let fadeTime = activeTriggers[i].fadeTime;
        if (timePassed >= fadeTime) {
            if (activeTriggers[i].target == "floor") {
                floor.colour = activeTriggers[i].colour;
            } else {
                background.colour = activeTriggers[i].colour;
            }
            activeTriggers.splice(i, 1);
            break;
        }

        let oldCol = activeTriggers[i].oldCol;
        let newCol = activeTriggers[i].newCol;
        let setCol = [];
        for (let i = 0; i < 3; i++) {
            setCol[i] = Math.round(oldCol[i] + (newCol[i] - oldCol[i]) * (timePassed/fadeTime));
        }
        
        if (activeTriggers[i].target == "floor") {
            changeColour(floor, `rgb(${setCol[0]}, ${setCol[1]}, ${setCol[2]})`);
        } else {
            changeColour(background, `rgb(${setCol[0]}, ${setCol[1]}, ${setCol[2]})`);
        }
    }
}

function changeColour(target, colour) {
    let rgb = colour.match(/\d+/g).map(Number);
    target.colour = rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function applyGravity() {
    // Set Gravity
    if (player.mode == "cube") {
        player.gravity = -2793.528 * player.gravityStatus;
    } else if (player.mode == "ship") {
        if (keyHeld) {
            player.gravity = 0;
        } else if (player.yVel > 110 && player.gravityStatus == 1 || player.yVel < -110 && player.gravityStatus == -1) {
            player.gravity = -1419.584 * player.gravityStatus;
        } else {
            player.gravity = -894.11526 * player.gravityStatus;
        }
    } else { // ball
        player.gravity = -1676.4651 * player.gravityStatus;
    }

    // Apply Velocity
    player.y += player.yVel /(1000/deltaTime);
    player.bluehby = player.y + 11;

    // Apply Gravity
    player.yVel += player.gravity / (1000/deltaTime);

    // Max Velocity
    if ((player.mode == "cube" || player.mode == "ball") && ((player.yVel < -810 && player.gravityStatus == 1) || (player.yVel > 810 && player.gravityStatus == -1))) {
        player.yVel = -810 * player.gravityStatus;
    } else if (player.mode == "ship" && (player.yVel >= 432 && player.gravityStatus == 1 || player.yVel <= -432 && player.gravityStatus == -1)) {
        player.yVel = 432 * player.gravityStatus;
    } else if (player.mode == "ship" && (player.yVel <= -345.6 && player.gravityStatus == 1 || player.yVel >= 345.6 && player.gravityStatus == -1)) {
        player.yVel = -345.6 * player.gravityStatus;
    }
}

function rotatePlayer() {
    if (player.mode == "cube") {
        if (player.grounded) {
            let angleDiff = roundToNearest(player.angle, 90) - player.angle;
            if (player.gravityStatus == 1) {
                player.angle += Math.min(angleDiff, 2);
            } else {
                player.angle += Math.max(angleDiff, -2);
            }
        } else {
            console.log("Hi")
            player.angle += 420/(1000/deltaTime) * player.gravityStatus;
        }
    } else if (player.mode == "ship" && !player.easing && (player.roofed || player.grounded)) {
        player.easing = true;
        ease(player, [0, 0, 0-player.angle], 100, "linear", () => {player.easing = false}, true, true);
    } else if (player.mode == "ship" && !player.easing) {
        let dy = player.y - player.oldy;
        let dx = player.x - player.oldx;
        let newAngle = Math.atan(dy/dx) * -180 / Math.PI
        player.angle = (newAngle + player.angle)/2;
    } else { // Ball
        if (player.roofed) {
            player.ballRotStatus = -1;
        } else if (player.grounded) {
            player.ballRotStatus = 1;
        }
        player.angle += 600/(1000/deltaTime) * player.ballRotStatus;
    }
    player.angle %= 360;
}

function jump() {
    for (let i = 0; i < player.touchingOrb.length; i++) {
        if (bufferAvailable) {
            if (gameObjs[player.touchingOrb[i]].orbType == "yellow") {
                if (player.mode == "ball") {
                    player.yVel = 417.94812 * player.gravityStatus;
                } else {
                    player.yVel = 595.9602 * player.gravityStatus;
                }
                bufferAvailable = false;
                gameObjs[player.touchingOrb[i]].activated = true;
                return;
            }
        }
    }
    if (player.mode == "cube" && player.grounded) {
        player.yVel = 595.9602 * player.gravityStatus;
        bufferAvailable = false;
        // To convert from GD velocity to my velocity, multiply by 54
    } else if (player.mode == "ship" && player.y + player.h < roof.y && roof.canCollide) {
        if (player.yVel > 120 && player.gravityStatus == 1 || player.yVel < 120 && player.gravityStatus == -1) {
            player.yVel += 1180.5102 / (1000/deltaTime) * player.gravityStatus;
        } else {
            player.yVel += 1341.1656 / (1000/deltaTime) * player.gravityStatus;
        }
        bufferAvailable = false;
    } else if (player.mode == "ball" && (player.grounded || player.roofed) && bufferAvailable) {
        player.gravityStatus *= -1;
        player.yVel = -185.7735 * player.gravityStatus;
        bufferAvailable = false;
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

document.getElementById("pause-btn").addEventListener("mousedown", pauseGame)
document.getElementById("pause-btn").addEventListener("touchstart", pauseGame)
function pauseGame() {
    song.pause();
    gamePaused = true;
    pauseVisible = true;
    document.getElementById("pause-box").style.display = "none";
    document.getElementById("pause-balance").style.display = "none";
}

function clickInPause() {
    if (pauseVisible) {
        if (checkClick(190, 290, 113, 217)) {
            unpauseGame();
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

function unpauseGame() {
    gamePaused = false;
    document.getElementById("pause-box").style.display = "block";
    document.getElementById("pause-balance").style.display = "block";
    song.play();
}