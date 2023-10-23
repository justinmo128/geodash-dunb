let buildCategory = "build"; // The current category selected
let currentObj = "block_standard"; // The Object selected in the build menu
let selectedIndex = -1; // The object selected in canvas
let editorTabs = document.getElementsByClassName("editor-tab");
let editorTabBtns = document.getElementsByClassName("editor-tab-btn");
let editorDivs = document.getElementsByClassName("editor-div");
let buildObjs = document.getElementsByClassName("build-object");
let editorObjects = [];
let initMouseX = 0;
let initMouseY = 0;
let initCamX = 0;
let initCamY = 0;
let movedCam = false;
let setDifficulty = document.getElementById("difficulty");
let levelDiff = document.getElementById("level-diff");
let levelDiffIcon = document.getElementById("level-difficon");

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

setDifficulty.addEventListener("change", changeDifficulty)
function changeDifficulty() {
    levelDiff.innerHTML = getDifficulty(setDifficulty.value);
    levelDiffIcon.style.backgroundImage = `url(img/diff${getDifficulty(setDifficulty.value)}.png)`;
}

function switchCategory(newCat) {
    buildCategory = newCat;
    for (let i = 0; i < editorTabs.length; i++) {
        editorTabs[i].style.display = "none";
        editorTabBtns[i].style.backgroundImage = `url("img/editorselectbtn.png")`;
    }
    document.getElementById(`${newCat}-box`).style.display = "flex";
    document.getElementById(`${newCat}-btn`).style.backgroundImage = `url("img/editorselectbtnon.png")`;
}

function buildObjSelect(i) {
    for (let j = 0; j < buildObjs.length; j++) {
        buildObjs[j].style.backgroundImage = `url("img/buttongray.png")`
    }
    buildObjs[i].style.backgroundImage = `url("img/buttoncyan.png")`
    currentObj = buildObjs[i].title;
}

document.getElementById("delete-obj-btn").addEventListener("click", () => {
    deleteObject(selectedIndex)
})
function deleteObject(index) {
    selectedIndex = -1;
    editorObjects.splice(index, 1)
}

document.getElementById("deselect-btn").addEventListener("click", deselect)
function deselect() {
    selectedIndex = -1;
}

window.addEventListener("load", moveEditorCam);
function moveEditorCam() {
    if (mouseInBounds() && mouseHeld) {
        if ((initMouseX - mouseX) > 5 || (initMouseX - mouseX) < -5 || (initMouseY - mouseY) > 5 || (initMouseY - mouseY) < -5) {
            camera.x = initCamX + initMouseX - mouseX;
            camera.y = initCamY - (initMouseY - mouseY);
            movedCam = true;
        } else {
            movedCam = false;
        }
    }
    if (camera.y < 240) {
        camera.y = 240;
    }
    if (camera.x < 0) {
        camera.x = 0;
    }
    setTimeout(moveEditorCam, 1000/240)
}

function clickInEditor() {
    let coordX = mouseX + camera.x;
    let coordY = camera.y - mouseY;
    let snappedX = Math.floor((coordX) /30) * 30;
    let snappedY = Math.floor((coordY) /30) * 30;
    if (buildCategory == "build" && mouseInBounds() && !movedCam) {
        let objProps = objectList.find((element) => currentObj == element.id)
        editorObjects.push({
            id: currentObj,
            x: snappedX,
            y: snappedY,
            angle: 0,
            h: objProps.h,
            w: objProps.w,
            hbType: objProps.hbType,
            isPortal: objProps.isPortal
        })
        selectedIndex = editorObjects.length - 1;
        if (editorObjects[selectedIndex].isPortal) {
            editorObjects[selectedIndex].portalType = objProps.portalType;
        }
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
    } else if (mouseInBounds() && !movedCam) {
        for (let i = 0; i < editorObjects.length; i++) {
            if (coordX >= editorObjects[i].x && coordX <= editorObjects[i].x + editorObjects[i].w && coordY >= editorObjects[i].y && coordY <= editorObjects[i].y + editorObjects[i].h) {
                deleteObject(i)
                break;
            }
        }
    }
}

function editorKeys(e) {
    if (selectedIndex > -1 && gameState == "editor") {
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
            rotateObject(editorObjects[selectedIndex], oldAngle);
        }
    }
}

function mouseInBounds() {
    if (mouseX <= 480 && mouseX >= 0 && mouseY >= 0 && mouseY <= 330) {
        return true;
    }
    return false;
}

document.getElementById("export-btn").addEventListener("click", exportLevel)
function exportLevel() {
    let exportArray = [];
    for (let i = 0; i < editorObjects.length; i++) {
        exportArray.push({
            x: editorObjects[i].x,
            y: editorObjects[i].y,
            id: editorObjects[i].id,
            angle: editorObjects[i].angle
        })

        if (exportArray[i].type == "portal") {
            exportArray[i].type = `portal_${editorObjects[i].portalType}`;
        }
    }
    let exportObject = {
        name: document.getElementById("level-name").value,
        difficulty: setDifficulty.value,
        objects: exportArray
    }
    let jsonExport = JSON.stringify(exportObject)
    let a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([jsonExport], {type:"application/json"})
    )
    a.download = `${exportObject.name}.json`
    a.click()
}