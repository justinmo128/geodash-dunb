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
    if (player.y == 0 && player.mode == "cube" && !player.dead && !cubeTransition) {
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
function ease(instance, vector, duration = 200, style = "linear", doAfter = "", ignoreX = false, ignoreY = false, ignoreAngle = false) {
    let intervalID = 0;
    let instanceSave = Object.assign({}, instance);
    if (style == "linear") {
        intervalID = setInterval(() => {
            if (!ignoreX) {
                instance.x += vector[0]/duration*(1000/physicsTPS);
            }
            if (!ignoreY) {
                instance.y += vector[1]/duration*(1000/physicsTPS);
            }
            if (!ignoreAngle) {
                instance.angle += vector[2]/duration*(1000/physicsTPS);
            }
        }, (1000/physicsTPS))
    }
    setTimeout(() => {
        clearInterval(intervalID);
        if (!ignoreX) {
            instance.x = instanceSave.x + vector[0];
        }
        if (!ignoreY) {
            instance.y = instanceSave.y + vector[1];
        }
        if (!ignoreAngle) {
            instance.angle = instanceSave.angle + vector[2];
        }
        if (doAfter !== "") {
            doAfter();
        }
    }, duration)
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

function calculateRotatedPoint(centerX = 0, centerY = 0, x, y, angle) {
    let rad = (360 - angle) * (Math.PI / 180);
    let xPrime = (x - centerX) * Math.cos(rad) - (y - centerY) * Math.sin(rad);
    let yPrime = (x - centerX) * Math.sin(rad) + (y - centerY) * Math.cos(rad);
    let newCoords = [centerX + xPrime, centerY + yPrime];
    return newCoords;
}