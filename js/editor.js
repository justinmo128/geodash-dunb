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
    savedAngle = 0;
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

document.getElementById("swipe-btn").addEventListener("click", toggleSwipe);
function toggleSwipe() {
    swipeEnabled = !swipeEnabled;
    if (swipeEnabled) {
        document.getElementById("swipe-btn").style.backgroundImage = `url("img/swipe-btnon.png")`;
    } else {
        document.getElementById("swipe-btn").style.backgroundImage = `url("img/swipe-btn.png")`;
    }
}

window.addEventListener("load", moveEditorCam);
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
    setTimeout(moveEditorCam, 1000/240)
}

window.addEventListener("load", swipe);
function swipe() {
    if (mouseInBounds() && mouseHeld && swipeEnabled) {
        if (buildCategory == "build") {
            let objProps = objectList.find((element) => currentObj == element.id);
            let same = swipeObjs.some(e => e[0] === snappedX + objProps.editorOffsetx && e[1] === snappedY + objProps.editorOffsety);
            if (!same) {
                editorObjects.push({
                    id: currentObj,
                    x: snappedX + objProps.editorOffsetx,
                    y: snappedY + objProps.editorOffsety,
                    angle: savedAngle,
                    h: objProps.h,
                    w: objProps.w,
                    hbType: objProps.hbType,
                    isPortal: objProps.isPortal
                })
                swipeObjs.push([snappedX + objProps.editorOffsetx, snappedY + objProps.editorOffsety]);
                selectedIndex = editorObjects.length - 1;
                if (editorObjects[selectedIndex].isPortal) {
                    editorObjects[selectedIndex].portalType = objProps.portalType;
                }
                if (editorObjects[selectedIndex].angle !== 0) {
                    rotateObject(editorObjects[selectedIndex]);
                }
                updateHTML();
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
    setTimeout(swipe, 1000/240)
}

function clickInEditor() {
    if (buildCategory == "build" && mouseInBounds() && !movedCam && !swipeEnabled) {
        let objProps = objectList.find((element) => currentObj == element.id);
        editorObjects.push({
            id: currentObj,
            x: snappedX + objProps.editorOffsetx,
            y: snappedY + objProps.editorOffsety,
            angle: savedAngle,
            h: objProps.h,
            w: objProps.w,
            hbType: objProps.hbType,
            isPortal: objProps.isPortal
        })
        selectedIndex = editorObjects.length - 1;
        if (editorObjects[selectedIndex].isPortal) {
            editorObjects[selectedIndex].portalType = objProps.portalType;
        }
        if (editorObjects[selectedIndex].angle !== 0) {
            rotateObject(editorObjects[selectedIndex]);
        }
        updateHTML();
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

let editorImport = document.createElement('input');
editorImport.type = 'file';
editorImport.accept = '.json';
editorImport.addEventListener("change", loadLevel)
document.getElementById("load-btn").addEventListener("click", () => {editorImport.click()})
function loadLevel() {
    new Response(editorImport.files[0]).json()
        .then(json => {levelJSON = json})
        .then(createEditorObjects)
}

function createEditorObjects() {
    editorObjects = [];
    for (let i = 0; i < levelJSON.objects.length; i++) {
        let objProps = objectList.find((element) => levelJSON.objects[i].id == element.id)

        editorObjects.push({
            id: levelJSON.objects[i].id,
            x: levelJSON.objects[i].x,
            y: levelJSON.objects[i].y,
            angle: levelJSON.objects[i].angle,
            h: objProps.h,
            w: objProps.w,
            hbType: objProps.hbType,
            isPortal: objProps.isPortal
        })
        if (editorObjects[i].isPortal) {
            editorObjects[i].portalType = objProps.portalType;
        }
        if (editorObjects[i].angle !== 0) {
            rotateObject(editorObjects[i], 0, false);
            let xDiff = editorObjects[i].x - levelJSON.objects[i].x;
            let yDiff = editorObjects[i].y - levelJSON.objects[i].y;
            editorObjects[i].x -= xDiff;
            editorObjects[i].y -= yDiff;
        }
    }
    setDifficulty.value = levelJSON.difficulty;
    document.getElementById("level-name").value = levelJSON.name;
}