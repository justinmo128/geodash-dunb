function drawEditor() {
    drawBG();
    drawGrid();
    drawFloorRoof(floor);
    drawEditorObjects();
}

function drawEditorObjects() {
    ctx.globalAlpha = 1;
    for (let i = 0; i < editorObjects.length; i++) {
        let imgName = editorObjects[i].id;
        let objProps = objectList.find((element) => editorObjects[i].id == element.id)
        let xOffset = objProps.visualOffsetx;
        let yOffset = objProps.visualOffsety;
        if (editorObjects[i].type == "portal") {
            imgName = `portal_${editorObjects[i].portalType}_over`;
        }
        if (onScreen(editorObjects[i])) {
            drawImgCamRotate(imgName, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h, editorObjects[i].w, editorObjects[i].angle, objProps.w, objProps.h, xOffset, yOffset);
        }
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "lime";
    if (selectedIndex > -1) {
        fillRectCam(editorObjects[selectedIndex].x, editorObjects[selectedIndex].y, editorObjects[selectedIndex].w, editorObjects[selectedIndex].h);
    }
}

function drawGrid() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    for (let i = 0; i < 30; i++) {
        ctx.fillRect(i * 30 - camera.x % 30 - 0.25, 0, 0.5, 330);
        ctx.fillRect(0, i*30 + camera.y % 30 - 0.25, 480, 0.5);
    }
    ctx.globalAlpha = 1;
}