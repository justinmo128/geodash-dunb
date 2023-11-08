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
    ctx.globalAlpha = 1;
    for (let i = 0; i < editorObjects.length; i++) {
        let imgName = editorObjects[i].id;
        let objProps = objectList.find((element) => editorObjects[i].id == element.id)
        let xOffset = objProps.visualOffsetx;
        let yOffset = objProps.visualOffsety;
        if (editorObjects[i].isPortal) {
            imgName = `portal_${editorObjects[i].portalType}_over`;
        }
        drawImgCamRotate(imgName, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h, editorObjects[i].w, editorObjects[i].angle, objProps.w, objProps.h, xOffset, yOffset);
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "lime";
    if (selectedIndex > -1) {
        fillRectCam(editorObjects[selectedIndex].x, editorObjects[selectedIndex].y, editorObjects[selectedIndex].w, editorObjects[selectedIndex].h);
    }
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
        console.log(editorObjects[selectedIndex].w, editorObjects[selectedIndex].h)
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