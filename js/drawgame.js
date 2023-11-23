function drawGame() {
    moveCamera();
    drawBG();
    drawBackgroundObjects();
    drawGameObjects();
    drawPlayer();
    drawFloors();
    if (showHitboxes) {
        drawHitboxes();
    }
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
            drawImgCamRotate(`portal_${gameObjs[i].portalType}_under`, gameObjs[i].x, gameObjs[i].y, gameObjs[i].h, gameObjs[i].w, gameObjs[i].angle, 30, 90, 10);
        }
    }
}

function drawPlayer() {
    if (player.mode == "ship") {
        ctx.save();
        ctx.translate(player.x - camera.x + 15, camera.y - player.y - player.h + player.h/2 + 270);
        ctx.rotate(player.angle * Math.PI / 180);
        ctx.drawImage(document.getElementById("player_ship"), -20, -15);
        ctx.restore();
    } else {
        drawImgCamRotate(`player_${player.mode}`, player.x, player.y, player.h, player.w, player.angle, 30, 30);
    }
}

function drawGameObjects() {
    for (let i = 0; i < gameObjs.length; i++) {
        let objProps = objectList.find((element) => gameObjs[i].id == element.id)
        let imgName = gameObjs[i].id;
        let xOffset = objProps.visualOffsetx;
        let yOffset = objProps.visualOffsety;
        if (gameObjs[i].isPortal) {
            imgName = `portal_${gameObjs[i].portalType}_over`
        }
        drawImgCamRotate(imgName, gameObjs[i].x, gameObjs[i].y, gameObjs[i].h, gameObjs[i].w, gameObjs[i].angle, objProps.w, objProps.h, xOffset, yOffset);
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
    fillRectCamRotate(player.x, player.y, player.w, player.h, player.angle);
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