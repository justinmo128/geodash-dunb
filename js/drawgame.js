function drawGame() {
    moveCamera();
    drawLevelComponents();
    drawBackgroundObjects();
    drawPlayer();
    drawGameObjects();
    // drawHitboxes();
}

function drawLevelComponents() {
    drawBG();
    drawFloorRoof(floor);
    if (newFloor.canCollide) {
        drawFloorRoof(newFloor);
    }
    if (roof.canCollide) {
        drawFloorRoof(roof);
    }
}

function drawBackgroundObjects() {
    for (let i = 0; i < gameObjs.length; i++) {
        if (gameObjs[i].type == "portal") {
            drawImgCam(`portal${gameObjs[i].portalType}under`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
        }
    }
}

function drawPlayer() {
    let offset = 0;
    if (player.mode == "ship") {
        offset = 5;
    }
    drawImgCamRotate(player.mode, player.x - offset, player.y, player.w, player.h, player.angle);
}

function drawGameObjects() {
    for (let i = 0; i < gameObjs.length; i++) {
        if (gameObjs[i].type == "portal") {
            drawImgCam(`portal${gameObjs[i].portalType}over`, gameObjs[i].x - 15, gameObjs[i].y, gameObjs[i].h);
        } else {
            drawImgCam(gameObjs[i].type, gameObjs[i].x, gameObjs[i].y, gameObjs[i].h);
        }
    }
    if (player.win) {
        ctx.drawImage(document.getElementById("levelcomplete"), 40, 100);
    }
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