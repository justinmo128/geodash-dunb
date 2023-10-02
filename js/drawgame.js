function drawLevelComponents() {
    // Background
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    if (player.x < 90) {
        drawImgCam("gamebg", camera.x - 90, camera.y - 50, 240);
    } else if (player.x - 140 > maxX) {
        drawImgCam("gamebg", (camera.x - (gameObjects[gameObjects.length - 1].x + 140) % 512), camera.y - 50, 240);
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
        drawImgCam("floor", (camera.x - (gameObjects[gameObjects.length - 1].x + 140) % 90), camera.y - 50, 240);
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
            drawImgCam("floor", (camera.x - (gameObjects[gameObjects.length - 1].x + 140) % 90), newFloor.y, 0);
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
            drawImgCam("floor", (camera.x - (gameObjects[gameObjects.length - 1].x + 140) % 90), roof.y, 90);
        } else {
            drawImgCam("floor", camera.x - player.x % 90, roof.y, 90);
        }
        fillRectCam(camera.x, roof.y, cnv.width, 90);
    }
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