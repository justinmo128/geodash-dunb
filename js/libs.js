// Camera
function moveCamera() {
    if (player.x - 140 > gameObjs[gameObjs.length - 1].x && !player.dead) {
        camera.x = gameObjs[gameObjs.length - 1].x + 50;
        return;
    } else if (player.x < 90) {
        camera.x = 0;
    } else {
        camera.x = player.x - 90;
    }
    if (player.y == 0 && player.mode == "cube" && !player.dead) {
        camera.y = 270;
    }
}

function fillRectCam(x, y, w, h) {
    ctx.fillRect(x - camera.x, camera.y - y - h, w, h);
}

function drawImgCam(imgName, x, y, h) {
    ctx.drawImage(document.getElementById(imgName), x - camera.x, camera.y - y - h)
}

function shakeScreen(loopAmt) {
    let oldCamerax = camera.x;
    let oldCameray = camera.y;
    setTimeout(() => {
        camera.x = oldCamerax + (getRandomInt(-50, 50));
        camera.y = oldCameray + (getRandomInt(-20, 20));
    }, 30 * loopAmt)
}

// Random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // max exclusive, min inclusive
}