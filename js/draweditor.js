let camXEl = document.getElementById("cam-x");
let camYEl = document.getElementById("cam-y");
let objXEl = document.getElementById("obj-x");
let objYEl = document.getElementById("obj-y");
let objAngleEl = document.getElementById("obj-angle")

function drawEditor() {
    drawBG();
    drawGrid();
    drawFloorRoof(floor);
    drawEditorObjects();
}

function drawEditorObjects() {
    for (let i = 0; i < editorObjects.length; i++) {
        let imgName = editorObjects[i].id;
        let xOffset = 0;
        let yOffset = 0;
        if (editorObjects[i].isPortal) {
            imgName = `portal_${editorObjects[i].portalType}_over`;
            xOffset = setOffset(editorObjects[i].angle)[0];
            yOffset = setOffset(editorObjects[i].angle)[1];
        }
        drawImgCamRotate(imgName, editorObjects[i].x - xOffset, editorObjects[i].y - yOffset, editorObjects[i].h, editorObjects[i].w, editorObjects[i].angle);
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

function updateHTML() {
    camXEl.value = camera.x;
    camYEl.value = camera.y;
    if (selectedIndex > -1) {
        objXEl.value = editorObjects[selectedIndex].x;
        objYEl.value = editorObjects[selectedIndex].y;
        objAngleEl.value = editorObjects[selectedIndex].angle;
    } else {
        objXEl.value = 0;
        objYEl.value = 0;
        objAngleEl.value = 0;
    }
}

camXEl.addEventListener("change", () => {
    camera.x = +camXEl.value;
})
camYEl.addEventListener("change", () => {
    camera.x = +camXEl.value;
})
objXEl.addEventListener("change", () => {
    editorObjects[selectedIndex].x = +objXEl.value;
})
objYEl.addEventListener("change", () => {
    editorObjects[selectedIndex].y = +objYEl.value;
})
objAngleEl.addEventListener("change", () => {
    editorObjects[selectedIndex].angle = +objAngleEl.value;
    editorObjects[selectedIndex].angle %= 360;
})