// Camera
function moveCamera() {
    if (player.x - 140 > maxX && !player.dead) {
        camera.x = maxX + 50;
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

function drawImgCamRotate(imgName, x, y, w, h, angle) {
    ctx.save();
    ctx.translate(x - camera.x + w/2, camera.y - y - h + h/2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(document.getElementById(imgName), w/-2, h/-2);
    ctx.restore();
}

// Drawing Common Elements
function drawBG() {
    background.x = camera.x * -0.2;
    background.y = camera.y * 0.2;
    ctx.drawImage(document.getElementById("gamebg"), background.x % 512, background.y % 512 - 245)
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 1;
}

function drawFloorRoof(type) {
    ctx.globalAlpha = 1;
    ctx.drawImage(document.getElementById("floor"), player.x / 90 - camera.x % 90 - 90, camera.y - type.y)
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = type.colour;
    fillRectCam(camera.x, type.y, cnv.width, -90);
    ctx.globalAlpha = 1;
}

// Random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // max exclusive, min inclusive
}

// Easing
function ease(instance, vector, duration, style) {
    let intervalID = 0;
    let instanceSave = Object.assign({}, instance);
    if (style == "linear" && !instance.activated) {
        intervalID = setInterval(() => {
            instance.x += vector[0]/duration*(1000/physicsTPS);
            instance.y += vector[1]/duration*(1000/physicsTPS);
            instance.angle += vector[2]/duration*(1000/physicsTPS);
        }, (1000/physicsTPS))
    }
    setTimeout(() => {
        clearInterval(intervalID);
        instance.x = instanceSave.x + vector[0];
        instance.y = instanceSave.y + vector[1];
    }, duration)
}