function drawLevelComponents() {
    // Background
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    if (player.x < 90) {
        drawImgCam("gamebg", camera.x - 90, camera.y - 50, 240);
    } else if (player.x - 140 > maxX) {
        drawImgCam("gamebg", (camera.x - (gameObjs[gameObjs.length - 1].x + 140) % 512), camera.y - 50, 240);
    } else {
        drawImgCam("gamebg", (camera.x - player.x % 512), camera.y - 50, 240);
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Floor
    ctx.globalAlpha = 1;
    if (player.x < 90) {
        drawImgCam("floor", camera.x, 0, 0);
    } else if (player.x - 140 > maxX) {
        drawImgCam("floor", (camera.x - (gameObjs[gameObjs.length - 1].x + 140) % 90), camera.y - 50, 240);
    } else {
        drawImgCam("floor", camera.x - player.x % 90, 0, 0);
    }
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = floor.colour;
    fillRectCam(camera.x, -90, cnv.width, 90);
    // NewFloor
    if (newFloor.canCollide) {
        if (player.x < 90) {
            drawImgCam("floor", camera.x, newFloor.y, 0);
        } else if (player.x - 140 > maxX) {
            drawImgCam("floor", (camera.x - (gameObjs[gameObjs.length - 1].x + 140) % 90), newFloor.y, 0);
        } else {
            drawImgCam("floor", camera.x - player.x % 90, newFloor.y, 0);
        }
        fillRectCam(camera.x, newFloor.y, cnv.width, -90);
    }
    // Roof
    if (roof.canCollide) {
        if (player.x < 90) {
            drawImgCam("floor", camera.x, 0, 0);
        } else if (player.x - 140 > maxX) {
            drawImgCam("floor", (camera.x - (gameObjs[gameObjs.length - 1].x + 140) % 90), roof.y, 90);
        } else {
            drawImgCam("floor", camera.x - player.x % 90, roof.y, 90);
        }
        fillRectCam(camera.x, roof.y, cnv.width, 90);
    }
    ctx.globalAlpha = 1;
}

function drawPortalUnder() {
    for (let i = 0; i < gameObjs.length; i++) {
        if (player.x < 90 && gameObjs[i].type == "portal") {
            ctx.drawImage(document.getElementById(`portal${gameObjs[i].portalType}under`), gameObjs[i].x - 15, camera.y - gameObjs[i].y - gameObjs[i].h)
        } else if (gameObjs[i].type == "portal") {
            drawImgCam(`portal${gameObjs[i].portalType}under`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
        }
    }
}

function drawGameObjects() {
    // Game Objects
    for (let i = 0; i < gameObjs.length; i++) {
        if (gameObjs[i].type == "portal") {
            if (player.x < 90) {
                ctx.drawImage(document.getElementById(`portal${gameObjs[i].portalType}over`), gameObjs[i].x - 15, camera.y - gameObjs[i].y - gameObjs[i].h)
            } else {
                drawImgCam(`portal${gameObjs[i].portalType}over`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
            }
        } else {
            if (player.x < 90) {
                ctx.drawImage(document.getElementById(gameObjs[i].type), gameObjs[i].x, camera.y - gameObjs[i].y - gameObjs[i].h)
            } else {
                drawImgCam(gameObjs[i].type, gameObjs[i].x, gameObjs[i].y, gameObjs[i].h);
            }
        }
    }
    if (player.win) {
        ctx.drawImage(document.getElementById("levelcomplete"), 40, 100);
    }
}

function drawPlayer() {
    if (player.mode == "cube") {
        if (player.x < 90) {
            ctx.drawImage(document.getElementById("player"), player.x, camera.y - player.y - 30);
        } else {
            drawImgCam("player", player.x, player.y, 30);
        }
    } else {
        if (player.x < 90) {
            ctx.drawImage(player.mode, player.x, camera.y - player.y - 30);
        } else {
            drawImgCam(player.mode, player.x, player.y, 30);
        }
    }
}

function drawHitboxes() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    fillRectCam(player.x, player.y, player.w, player.h)
    ctx.fillStyle = "blue";
    fillRectCam(player.blueHBx, player.blueHBy, player.blueHBw, player.blueHBh)
    for (let i = 0; i < gameObjs.length; i++) {
        ctx.fillStyle = gameObjs[i].hbType;
        fillRectCam(gameObjs[i].HBx, gameObjs[i].HBy, gameObjs[i].HBw, gameObjs[i].HBh)
    }
    ctx.globalAlpha = 1;
}