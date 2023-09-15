// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 480;
cnv.height = 270;
let camera = {
    x: 0,
    y: 180
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
    drawPlayer();
    drawGameObjects();
}

function drawLevelComponents() {
    // Background
    ctx.globalAlpha = 1;
    if (player.x < 90) {
        drawImgCam("gamebg", camera.x - 90, camera.y, 240);
    } else {
        drawImgCam("gamebg", (camera.x - player.x % 512), camera.y, 240);
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Floor
    ctx.globalAlpha = 1;
    if (player.x < 90) {
        drawImgCam("floor", camera.x, 0, 0);
    } else {
        drawImgCam("floor", camera.x - player.x % 90, 0, 0);
    }
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = floor.colour;
    fillRectCam(camera.x, -90, cnv.width, 90);
    ctx.globalAlpha = 1;
}

function drawGameObjects() {
    // Game Objects
    ctx.fillStyle = "black";
    for (let i = 0; i < gameObjects.length; i++) {
        drawImgCam(gameObjects[i].type, gameObjects[i].x, gameObjects[i].y, gameObjects[i].h)
    }
}

function drawPlayer() {
    if (player.mode == "cube") {
        if (player.x < 90) {
            ctx.drawImage(document.getElementById("player"), player.x, camera.y - player.y - 30)
        } else {
            drawImgCam("player", player.x, player.y, 30)
        }
        // ctx.fillStyle = player.colour;
        // if (player.x < 90) {
        //     ctx.fillRect(player.x, camera.y - player.y - 30, 30, 30);
        // } else {
        //     fillRectCam(player.x, player.y, 30, 30)
        // }
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

function drawRotated(x, y, angle) {
    ctx.save();
    ctx.translate(x, y)
    ctx.rotate(angle);
    
}