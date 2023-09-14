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
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Floor
    ctx.fillStyle = floor.colour;
    ctx.fillRect(0, 180, cnv.width, 90);
}

function drawGameObjects() {
// Game Objects
ctx.fillStyle = "black";
for (let i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].type == "spike") {
        drawSpike(gameObjects[i].x, gameObjects[i].y);
    } else if (gameObjects[i].type == "block") {
        fillRectCam(gameObjects[i].x, gameObjects[i].y, 30, 30)
    } else if (gameObjects[i].type == "slab") {
        fillRectCam(gameObjects[i].x, gameObjects[i].y, 30, 15)
    }
}
}

function drawPlayer() {
    if (player.mode == "cube") {
        ctx.fillStyle = player.colour;
        if (player.x < 90) {
            ctx.fillRect(player.x, camera.y - player.y - 30, 30, 30);
        } else {
            fillRectCam(player.x, player.y, 30, 30)
        }
        
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

function shakeScreen(loopAmt) {
    let oldCamerax = camera.x;
    let oldCameray = camera.y
    setTimeout(() => {
        camera.x = oldCamerax + (getRandomInt(-50, 50));
        camera.y = oldCameray + (getRandomInt(-20, 20));
    }, 30 * loopAmt)
}