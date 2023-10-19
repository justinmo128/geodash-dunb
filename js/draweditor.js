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
    updateHTML();
}

function drawEditorObjects() {
    for (let i = 0; i < editorObjects.length; i++) {
        let imgName = editorObjects[i].type;
        let xOffset = 0;
        let yOffset = 0;
        if (editorObjects[i].type == "portal") {
            imgName = `portal${editorObjects[i].portalType}over`;
            if (editorObjects[i].angle == 0) {
                xOffset = 15;
                yOffset = 0;
            } else if (editorObjects[i].angle == 90) {
                xOffset = -30;
                yOffset = 15;
            } else if (editorObjects[i].angle == 180) {
                xOffset = -15;
                yOffset = 0;
            } else if (editorObjects[i].angle == 270) {
                xOffset = 30;
                yOffset = -15;
            }
        }
        if (editorObjects[i].angle !== 0) {
            drawImgCamRotate(imgName, editorObjects[i].x - xOffset, editorObjects[i].y - yOffset, editorObjects[i].w, editorObjects[i].h, editorObjects[i].angle);
        } else {
            drawImgCam(imgName, editorObjects[i].x - xOffset, editorObjects[i].y - yOffset, editorObjects[i].h);
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

function updateHTML() {
    camXEl.innerHTML = camera.x;
    camYEl.innerHTML = camera.y;
    if (selectedIndex > -1) {
        objXEl.innerHTML = editorObjects[selectedIndex].x;
        objYEl.innerHTML = editorObjects[selectedIndex].y;
        objAngleEl.innerHTML = editorObjects[selectedIndex].angle;
    } else {
        objXEl.innerHTML = 0;
        objYEl.innerHTML = 0;
        objAngleEl.innerHTML = 0;
    }
}