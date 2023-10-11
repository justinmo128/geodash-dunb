function drawGame() {
    moveCamera();
    drawLevelComponents();
    drawPlayer();
    drawGameObjects();
    // drawHitboxes();
}

function drawLevelComponents() {
    // Background
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
    ctx.drawImage(document.getElementById("floor"), player.x / 90 - camera.x % 90 - 90, camera.y)
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = floor.colour;
    fillRectCam(camera.x, -90, cnv.width, 90);
    // NewFloor
    if (newFloor.canCollide) {
        ctx.globalAlpha = 1;
        ctx.drawImage(document.getElementById("floor"), player.x / 90 - camera.x % 90 - 90, camera.y - newFloor.y)
        ctx.globalAlpha = 0.6;
        fillRectCam(camera.x, newFloor.y, cnv.width, -90);
    }
    // Roof
    if (roof.canCollide) {
        ctx.globalAlpha = 1;
        ctx.drawImage(document.getElementById("floor"), player.x / 90 - camera.x % 90 - 90, camera.y - roof.y - 90)
        ctx.globalAlpha = 0.6;
        fillRectCam(camera.x, roof.y, cnv.width, 90);
    }
    ctx.globalAlpha = 1;
}

function drawGameObjects() {
    for (let i = 0; i < gameObjs.length; i++) {
        if (gameObjs[i].type == "portal") {
            drawImgCam(`portal${gameObjs[i].portalType}under`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
            drawImgCam(`portal${gameObjs[i].portalType}over`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
        } else {
            drawImgCam(gameObjs[i].type, gameObjs[i].x, gameObjs[i].y, gameObjs[i].h);
        }
    }
    if (player.win) {
        ctx.drawImage(document.getElementById("levelcomplete"), 40, 100);
    }
}

function drawPlayer() {
    drawImgCamRotate(player.mode, player.x, player.y, player.w, player.h, player.angle);
}

function drawHitboxes() {
    ctx.globalAlpha = 0.5;
    // Player
    ctx.fillStyle = "red";
    fillRectCam(player.x, player.y, player.w, player.h)
    ctx.fillStyle = "blue";
    fillRectCam(player.bluehbx, player.bluehby, player.bluehbw, player.bluehbh)
    // Objects
    for (let i = 0; i < gameObjs.length; i++) {
        ctx.fillStyle = gameObjs[i].hbType;
        fillRectCam(gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh)
    }
    ctx.globalAlpha = 1;
}