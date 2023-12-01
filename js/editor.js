let buildCategory = "build"; // The current category selected
let currentObj = "block_standard"; // The Object selected in the build menu
let selectedIndex = -1; // The object selected in canvas
let editorObjects = [];
let initMouseX = 0;
let initMouseY = 0;
let initCamX = 0;
let initCamY = 0;
let movedCam = false;
let inputs = document.getElementsByTagName("input");
let swipeEnabled = false;
let swipeObjs = [];
let editSwipeActive = false;
let savedAngle = 0;

for (let i = 0; i < editorTabBtns.length; i++) {
    editorTabBtns[i].addEventListener("click", () => {
        switchCategory(editorTabBtns[i].innerHTML.toLowerCase());
    })
}
for (let i = 0; i < buildObjs.length; i++) {
    buildObjs[i].addEventListener("click", () => {
        buildObjSelect(i);
    })
}

function moveEditorCam() {
    movedCam = false;
    if (mouseInBounds() && mouseHeld && !swipeEnabled) {
        if ((initMouseX - mouseX) > 5 || (initMouseX - mouseX) < -5 || (initMouseY - mouseY) > 5 || (initMouseY - mouseY) < -5) {
            camera.x = initCamX + initMouseX - mouseX;
            camera.y = initCamY - (initMouseY - mouseY);
            movedCam = true;
        }
        updateHTML();
    }
    if (camera.y < -30) {
        camera.y = -30;
        updateHTML();
    }
    if (camera.x < 0) {
        camera.x = 0;
        updateHTML();
    }
}

function swipe() {
    if (mouseInBounds() && mouseHeld && swipeEnabled) {
        if (buildCategory == "build") {
            let objProps = objectList.find((element) => currentObj == element.id);
            let same = swipeObjs.some(e => e[0] === snappedX + objProps.editorOffsetx && e[1] === snappedY + objProps.editorOffsety);
            if (!same) {
                buildObject(currentObj, snappedX, snappedY, savedAngle, true);
                swipeObjs.push([snappedX + objProps.editorOffsetx, snappedY + objProps.editorOffsety]);
            }
        } else if (buildCategory == "delete") {
            for (let i = 0; i < editorObjects.length; i++) {
                if (coordX >= editorObjects[i].x && coordX <= editorObjects[i].x + editorObjects[i].w && coordY >= editorObjects[i].y && coordY <= editorObjects[i].y + editorObjects[i].h) {
                    deleteObject(i)
                }
            }
            updateHTML();
        }
    }
}

function buildObject(id, x, y, angle, offset) {
    let objProps = objectList.find((element) => id == element.id);
    let offsetX = 0;
    let offsetY = 0;
    if (offset) {
        offsetX = objProps.editorOffsetx;
        offsetY = objProps.editorOffsety;
    }

    editorObjects.push({
        id: id,
        x: x + offsetX,
        y: y + offsetY,
        angle: angle,
        h: objProps.h,
        w: objProps.w,
        hbType: objProps.hbType,
        type: objProps.type
    })

    selectedIndex = editorObjects.length - 1;
    if (editorObjects[selectedIndex].w < 30 || editorObjects[selectedIndex].h < 30) {
        editorObjects[selectedIndex].rotCenter = [editorObjects[selectedIndex].x + 15, editorObjects[selectedIndex].y + 15];
    } else {
        editorObjects[selectedIndex].rotCenter = [editorObjects[selectedIndex].x + editorObjects[selectedIndex].w / 2, editorObjects[selectedIndex].y + editorObjects[selectedIndex].h / 2];
    }
    if (editorObjects[selectedIndex].type == "portal") {
        editorObjects[selectedIndex].portalType = objProps.portalType;
    }
    if (editorObjects[selectedIndex].angle !== 0) {
        rotateObject(editorObjects[selectedIndex]);
    }
    if (editorObjects[selectedIndex].type == "trigger") {
        editorObjects[selectedIndex].colour = "#000000";
        editorObjects[selectedIndex].fadeTime = 0;
        editorObjects[selectedIndex].target = "background";
        editorObjects[selectedIndex].touchActivated = false;
    }
    updateHTML();
}

function clickInEditor() {
    if (buildCategory == "build" && mouseInBounds() && !movedCam && !swipeEnabled) {
        buildObject(currentObj, snappedX, snappedY, savedAngle, true);
    } else if (buildCategory == "edit" && mouseInBounds() && !movedCam) {
        let indices = [];
        let selectedInIndices = false;
        for (let i = 0; i < editorObjects.length; i++) {
            if (coordX >= editorObjects[i].x && coordX <= editorObjects[i].x + editorObjects[i].w && coordY >= editorObjects[i].y && coordY <= editorObjects[i].y + editorObjects[i].h) {
                indices.push(i);
            }
        }
        for (let i = 0; i < indices.length; i++) {
            if (selectedIndex == indices[i]) {
                selectedInIndices = true;
                selectedIndex = indices[i + 1];
                break;
            }
        }
        if (!selectedInIndices || selectedIndex === undefined) {
            selectedIndex = indices[0];
        }
        updateHTML();
    } else if (mouseInBounds() && !movedCam && !swipeEnabled) {
        for (let i = 0; i < editorObjects.length; i++) {
            if (coordX >= editorObjects[i].x && coordX <= editorObjects[i].x + editorObjects[i].w && coordY >= editorObjects[i].y && coordY <= editorObjects[i].y + editorObjects[i].h) {
                deleteObject(i)
                break;
            }
        }
        updateHTML();
    }
}

function editorKeys(e) {
    let cursorInInput = false;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) {
            cursorInInput = true;
        }
    }
    if (selectedIndex > -1 && gameState == "editor" && !cursorInInput) {
        let validKeyPressed = true;
        if (e.key == "w") {
            editorObjects[selectedIndex].y += 30;
        } else if (e.key == "a") {
            editorObjects[selectedIndex].x -= 30;
        } else if (e.key == "s") {
            editorObjects[selectedIndex].y -= 30;
        } else if (e.key == "d") {
            editorObjects[selectedIndex].x += 30;
        } else if (e.key == "ArrowUp") {
            editorObjects[selectedIndex].y++;
        } else if (e.key == "ArrowLeft") {
            editorObjects[selectedIndex].x--;
        } else if (e.key == "ArrowDown") {
            editorObjects[selectedIndex].y--;
        } else if (e.key == "ArrowRight") {
            editorObjects[selectedIndex].x++;
        } else if (e.key == "r") {
            let oldAngle = editorObjects[selectedIndex].angle;
            editorObjects[selectedIndex].angle += 90;
            editorObjects[selectedIndex].angle %= 360;
            savedAngle = editorObjects[selectedIndex].angle;
            rotateObject(editorObjects[selectedIndex], oldAngle);
        } else {
            validKeyPressed = false;
        }
        if (validKeyPressed) {
            updateHTML();
        }
    }
}

function mouseInBounds() {
    if (mouseX <= 480 && mouseX >= 0 && mouseY >= 0 && mouseY <= 330) {
        return true;
    }
    return false;
}