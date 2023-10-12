function drawGame() {
    moveCamera();
    drawLevelComponents();
    drawBackgroundObjects();
    drawPlayer();
    drawGameObjects();
    drawHitboxes();
}

function drawLevelComponents() {
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    background.x = camera.x * -0.2;
    ctx.drawImage(document.getElementById("gamebg"), background.x % 512, -50)
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