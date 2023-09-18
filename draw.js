// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 480;
cnv.height = 330;
let camera = {
    x: 0,
    y: 270
}

// Draw Function
window.addEventListener("load", draw)
function draw() {
    drawGame();
    setTimeout(draw, 50/3);
}

function drawGame() {
    moveCamera();
    drawLevelComponents();
    drawPortalUnder();
    drawPlayer();
    drawGameObjects();
}

function drawLevelComponents() {
    // Background
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    if (player.x < 90) {
        drawImgCam("gamebg", camera.x - 90, camera.y - 50, 240);
    } else {
        drawImgCam("gamebg", (camera.x - player.x % 512), camera.y - 50, 240);
    }
    ctx.globalAlpha = 0.5;
    // ctx.fillStyle = background.colour;
    // ctx.fillRect(0, 0, cnv.width, cnv.height);
    // // Floor
    // ctx.globalAlpha = 1;
    // if (player.x < 90) {
    //     drawImgCam("floor", camera.x, 0, 0);
    // } else {
    //     drawImgCam("floor", camera.x - player.x % 90, 0, 0);
    // }
    // NewFloor
    if (newFloor.canCollide) {
        if (player.x < 90) {
            drawImgCam("floor", camera.x, newFloor.y, 0);
        } else {
            drawImgCam("floor", camera.x - player.x % 90, newFloor.y, 0);
        }
    }
    // Roof
    // if (player.x < 90) {
    //     drawImgCam("floor", camera.x, 0, 0);
    // } else {
    //     drawImgCam("floor", camera.x - player.x % 90, 0, 0);
    // }
    ctx.globalAlpha = 0.6;
    // ctx.fillStyle = floor.colour;
    // fillRectCam(camera.x, -90, cnv.width, 90);

    ctx.globalAlpha = 1;
}

function drawPortalUnder() {
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].type == "portal") {
            drawImgCam(`portal${gameObjects[i].portalType}under`, gameObjects[i].x, gameObjects[i].y, gameObjects[i].h);
        }
    }
}

function drawGameObjects() {
    // Game Objects
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].type == "portal") {
            drawImgCam(`portal${gameObjects[i].portalType}over`, gameObjects[i].x, gameObjects[i].y, gameObjects[i].h);
        } else {
            drawImgCam(gameObjects[i].type, gameObjects[i].x, gameObjects[i].y, gameObjects[i].h);
        }
    }
}

function drawPlayer() {
    if (player.mode == "cube") {
        if (player.x < 90) {
            ctx.drawImage(document.getElementById("player"), player.x, camera.y - player.y - 30)
        } else {
            drawImgCam("player", player.x, player.y, 30)
        }
    } else {
        if (player.x < 90) {
            ctx.drawImage(player.mode, player.x, camera.y - player.y - 30)
        } else {
            drawImgCam(player.mode, player.x, player.y, 30)
        }
    }
}

function moveCamera() {
    if (gameState !== "death") {
        camera.x = player.x - 90;
    }
    if (player.y == 0 && player.mode == "cube") {
        camera.y = 270;
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

function drawImgCam(imgName, x, y, h) {
    ctx.drawImage(document.getElementById(imgName), x - camera.x, camera.y - y - h)
}

function shakeScreen(loopAmt) {
    let oldCamerax = camera.x;
    let oldCameray = camera.y
    setTimeout(() => {
        camera.x = oldCamerax + (getRandomInt(-50, 50));
        camera.y = oldCameray + (getRandomInt(-20, 20));
    }, 30 * loopAmt)
}

// function drawRotated(x, y, angle) {
//     ctx.save();
//     ctx.translate(x, y)
//     ctx.rotate(angle);
    
// }