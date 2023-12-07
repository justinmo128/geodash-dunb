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
    if (player.y - camera.y > 155 && player.mode == "cube") {
        camera.y = player.y - 155;
    } else if (player.y - camera.y < 40 && player.mode == "cube") {
        camera.y = player.y - 40;
    }
    if (camera.y < 0 && player.mode == "cube") {
        camera.y = 0;
    }
}

function fillRectCam(x, y, w, h) {
    if (x - camera.x >= -30 && x - camera.x <= 480) {
        ctx.fillRect(x - camera.x, camera.y - y - h + 270, w, h);
    }
}

function fillRectCamRotate(x, y, w, h, angle) {
    ctx.save();
    ctx.translate(x - camera.x + w/2, camera.y - y - h + h/2 + 270);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillRect(w/-2, h/-2, w, h);
    ctx.restore();
}

function drawImgCamRotate(imgName, x, y, h, w = 0, angle = 0, ogw, ogh, xOffset = 0, yOffset = 0) {
    let objImg = document.getElementById(imgName);
    if (angle !== 0) {
        ctx.save();
        ctx.translate(x - camera.x + w/2, camera.y - y - h + h/2 + 270);
        ctx.rotate(angle * Math.PI / 180);
        ctx.drawImage(objImg, ogw/-2 - xOffset, ogh/-2 - yOffset);
        ctx.restore();
    } else {
        ctx.drawImage(objImg, x - camera.x - xOffset, camera.y - y - h + 270 - yOffset)
    }
}

// Drawing Common Elements
function drawBG() {
    background.x = camera.x * -0.05;
    background.y = camera.y * 0.05;
    ctx.globalAlpha = 1;
    ctx.drawImage(document.getElementById("gamebg"), background.x % 512, background.y % 512 - 175)
    ctx.globalCompositeOperation = "multiply"
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1;
}

function drawFloorRoof(type) {
    ctx.globalAlpha = 1;
    ctx.drawImage(document.getElementById("floor"), camera.x * -1 % 90 - 90, camera.y - type.y + 270)
    ctx.globalCompositeOperation = "multiply"
    ctx.fillStyle = type.colour;
    fillRectCam(camera.x, type.y, cnv.width, -90);
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 1;
}

// Easing
function ease(instance, vector, duration = 200, style = "linear", doAfter = "", ignoreX = false, ignoreY = false, ignoreAngle = false) {
    let instanceSave = Object.assign({}, instance);
    clearInterval(instance.easeId);
    instance.easeId = 0;
    if (style == "linear") {
        instance.easeId = setInterval(() => {
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
        clearInterval(instance.easeId);
        if (instance.easeId > 0 && !ignoreX) {
            instance.x = instanceSave.x + vector[0];
        }
        if (instance.easeId > 0 && !ignoreY) {
            instance.y = instanceSave.y + vector[1];
        }
        if (instance.easeId > 0 && !ignoreAngle) {
            instance.angle = instanceSave.angle + vector[2];
        }
        if (doAfter !== "") {
            doAfter();
        }
    }, duration)
}

function clearEase(instance) {
    instance.easing = false;
    clearInterval(instance.easeId);
    instance.easeId = 0;
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
    let rad = angle * Math.PI / 180;
    let xPrime = (x - centerX) * Math.cos(rad) - (y - centerY) * Math.sin(rad);
    let yPrime = (x - centerX) * Math.sin(rad) + (y - centerY) * Math.cos(rad);
    let newCoords = [Math.round(centerX + xPrime), Math.round(centerY + yPrime)];
    return newCoords;
}

function rotateObject(obj, oldAngle = 0, rotateHitbox = false) {
    let botLeftPrime = calculateRotatedPoint(obj.rotCenter[0], obj.rotCenter[1], obj.x, obj.y, oldAngle - obj.angle);
    let topRightPrime = calculateRotatedPoint(obj.rotCenter[0], obj.rotCenter[1], obj.x + obj.w, obj.y + obj.h, oldAngle - obj.angle);
    obj.x = Math.min(botLeftPrime[0], topRightPrime[0]);
    obj.y = Math.min(botLeftPrime[1], topRightPrime[1]);
    obj.w = Math.max(botLeftPrime[0], topRightPrime[0]) - obj.x;
    obj.h = Math.max(botLeftPrime[1], topRightPrime[1]) - obj.y;
    if (rotateHitbox) {
        botLeftPrime = calculateRotatedPoint(obj.rotCenter[0], obj.rotCenter[1], obj.hbx, obj.hby, oldAngle - obj.angle);
        topRightPrime = calculateRotatedPoint(obj.rotCenter[0], obj.rotCenter[1], obj.hbx + obj.hbw, obj.hby + obj.hbh, oldAngle - obj.angle);
        obj.hbx = Math.min(botLeftPrime[0], topRightPrime[0]);
        obj.hby = Math.min(botLeftPrime[1], topRightPrime[1]);
        obj.hbw = Math.max(botLeftPrime[0], topRightPrime[0]) - obj.hbx;
        obj.hbh = Math.max(botLeftPrime[1], topRightPrime[1]) - obj.hby;
    }
}

let objectList = [];
    fetch(`js/objects.json`)
    .then((res) => res.json())
    .then((data) => objectList = data)

function floorToNearest(num, roundTo) {
    return Math.floor((num)/roundTo) * roundTo;
}

function translateAfterRotation(newobj, oldobj) {
    let xDiff = newobj.x - oldobj.x;
    let yDiff = newobj.y - oldobj.y;
    newobj.x -= xDiff;
    newobj.y -= yDiff;
    newobj.hbx -= xDiff;
    newobj.hby -= yDiff;
}