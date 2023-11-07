function drawGame() {
    moveCamera();
    drawBG();
    drawBackgroundObjects();
    drawPlayer();
    drawGameObjects();
    drawFloors();
    // drawHitboxes();
    if (gamePaused) {
        drawPause();
    }
}

function drawFloors() {
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
        if (gameObjs[i].isPortal) {
            let xOffset = setOffset(gameObjs[i].angle)[0];
            let yOffset = setOffset(gameObjs[i].angle)[1];
            drawImgCamRotate(`portal_${gameObjs[i].portalType}_under`, gameObjs[i].x - xOffset, gameObjs[i].y - yOffset, gameObjs[i].h, gameObjs[i].w, gameObjs[i].angle);
        }
    }
}

function drawPlayer() {
    let offset = 0;
    if (player.mode == "ship") {
        offset = 5;
    }
    drawImgCamRotate(`player_${player.mode}`, player.x - offset, player.y, player.h, player.w, player.angle);
}

function drawGameObjects() {
    for (let i = 0; i < gameObjs.length; i++) {
        let imgName = gameObjs[i].id;
        let xOffset = 0, yOffset = 0;
        if (gameObjs[i].isPortal) {
            imgName = `portal_${gameObjs[i].portalType}_over`
            xOffset = setOffset(gameObjs[i].angle)[0];
            yOffset = setOffset(gameObjs[i].angle)[1];
        }
        drawImgCamRotate(imgName, gameObjs[i].x - xOffset, gameObjs[i].y - yOffset, gameObjs[i].h, gameObjs[i].w, gameObjs[i].angle);
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
        if (gameObjs[i].hasHitbox) {
            ctx.fillStyle = gameObjs[i].hbType;
            fillRectCam(gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh)
        }
    }
    ctx.globalAlpha = 1;
}

function drawPause() {
    if (pauseVisible) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.globalAlpha = 1;
        ctx.drawImage(document.getElementById("pause_play"), 190, 113);
        ctx.drawImage(document.getElementById("pause_invisible"), 26, 129);
        ctx.drawImage(document.getElementById("pause_practice"), 108, 129);
        ctx.drawImage(document.getElementById("pause_menu"), 302, 129);
        ctx.drawImage(document.getElementById("pause_restart"), 384, 129);
    } else {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(document.getElementById("pause_visible"), 6, 284);
    }
    

}