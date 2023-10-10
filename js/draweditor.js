function drawEditor() {
    if (selectedIndex > -1) {
        objXEl.innerHTML = editorObjects[selectedIndex].x;
        objYEl.innerHTML = editorObjects[selectedIndex].y;
    } else {
        objXEl.innerHTML = 0;
        objYEl.innerHTML = 0;
    }
    
    // Background
    ctx.drawImage(document.getElementById("gamebg"), 0, -180);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 1;

    drawGrid();

    // Floor
    ctx.drawImage(document.getElementById("floor"), -1 * (camera.x) % 90 - 100, camera.y)
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = floor.colour;
    fillRectCam(camera.x, -90, cnv.width, 90);
    ctx.globalAlpha = 1;

    drawEditorObjects();
}

function drawEditorObjects() {
    for (let i = 0; i < editorObjects.length; i++) {
        if (editorObjects[i].type == "portal") {
            drawImgCam(`portal${editorObjects[i].portalType}over`, editorObjects[i].x - 15, editorObjects[i].y, editorObjects[i].h);
        } else {
            drawImgCam(editorObjects[i].type, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h);
        }
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "lime";
    if (selectedIndex > -1) {
        fillRectCam(editorObjects[selectedIndex].x, editorObjects[selectedIndex].y, editorObjects[selectedIndex].w, editorObjects[selectedIndex].h);
    }
    ctx.globalAlpha = 1;
}

function drawGrid() {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "gray";
    for (let i = 0; i < 30; i++) {
        ctx.fillRect(i * 30 - camera.x % 30, 0, 1, 330);
        ctx.fillRect(0, i*30 + camera.y % 30, 480, 1);
    }
    ctx.globalAlpha = 1;
}