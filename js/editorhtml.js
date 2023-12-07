let editorTabs = document.getElementsByClassName("editor-tab");
let editorTabBtns = document.getElementsByClassName("editor-tab-btn");
let setDifficulty = document.getElementById("difficulty");
let levelDiff = document.getElementById("level-diff");
let levelDiffIcon = document.getElementById("level-difficon");
let camXEl = document.getElementById("cam-x");
let camYEl = document.getElementById("cam-y");
let objXEl = document.getElementById("obj-x");
let objYEl = document.getElementById("obj-y");
let objAngleEl = document.getElementById("obj-angle");
let triggerColColourEl = document.getElementById("col-colour");
let triggerColTimeEl = document.getElementById("fade-time");
let triggerColTargetEl = document.getElementById("col-target");
let triggerColTouchEl = document.getElementById("touch-trigger");
let editorDivs = document.getElementsByClassName("editor-div");
let buildObjs = document.getElementsByClassName("build-object");
let levelBGColEl = document.getElementById("level-bg-col");
levelBGColEl.value = "#287DFF";
let levelFloorColEl = document.getElementById("level-floor-col");
levelFloorColEl.value = "#0066FF";
let editorImport = document.createElement('input');
editorImport.type = 'file';
editorImport.accept = '.json';

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

document.getElementById("level-settings-btn").addEventListener("click", toggleSettings)
function toggleSettings() {
    if (document.getElementById("level-settings-box").style.display != "flex") {
        document.getElementById("level-settings-box").style.display = "flex";
    } else {
        document.getElementById("level-settings-box").style.display = "none";
    }
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
        triggerColTimeEl.value = 0;
    }
    if (selectedIndex > -1 && editorObjects[selectedIndex].type == "trigger") {
        document.getElementById("trigger-col-edit").style.display = "flex";
        triggerColColourEl.value = editorObjects[selectedIndex].colour;
        triggerColTimeEl.value = editorObjects[selectedIndex].fadeTime;
        triggerColTargetEl.value = editorObjects[selectedIndex].target;
    } else {
        document.getElementById("trigger-col-edit").style.display = "none";
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
triggerColColourEl.addEventListener("change", () => {
    editorObjects[selectedIndex].colour = triggerColColourEl.value;
})
triggerColTimeEl.addEventListener("change", () => {
    editorObjects[selectedIndex].fadeTime = triggerColTimeEl.value;
})
triggerColTargetEl.addEventListener("change", () => {
    editorObjects[selectedIndex].target = triggerColTargetEl.value;
})
triggerColTouchEl.addEventListener("change", () => {
    editorObjects[selectedIndex].touchActivated = triggerColTouchEl.checked;
})

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

        if (exportArray[i].id.split('_')[0] == "trigger") {
            exportArray[i].colour = editorObjects[i].colour;
            exportArray[i].fadeTime = editorObjects[i].fadeTime;
            exportArray[i].target = editorObjects[i].target;
            exportArray[i].touchActivated = editorObjects[i].touchActivated;
        }
    }
    selectedMode = document.querySelector('input[name="mode-select"]:checked').value;
    let exportObject = {
        name: document.getElementById("level-name").value,
        difficulty: setDifficulty.value,
        bgCol: levelBGColEl.value,
        floorCol: levelFloorColEl.value,
        mode: selectedMode,
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

document.getElementById("load-btn").addEventListener("click", () => {editorImport.click()})
editorImport.addEventListener("change", loadLevel)
function loadLevel() {
    new Response(editorImport.files[0]).json()
        .then(json => {levelJSON = json})
        .then(createEditorObjects)
}

function createEditorObjects() {
    editorObjects = [];
    for (let i = 0; i < levelJSON.objects.length; i++) {
        buildObject(levelJSON.objects[i].id, levelJSON.objects[i].x, levelJSON.objects[i].y, levelJSON.objects[i].angle, false)
        if (editorObjects[i].type == "trigger") {
            editorObjects[i].colour = levelJSON.objects[i].colour;
            editorObjects[i].fadeTime = levelJSON.objects[i].fadeTime;
            editorObjects[i].target = levelJSON.objects[i].target;
            if (levelJSON.objects[i].touchActivated) {
                editorObjects[i].touchActivated = levelJSON.objects[i].touchActivated;
            } else {
                editorObjects[i].touchActivated = false;
            }
            
            updateHTML();
        }
        if (editorObjects[i].angle !== 0) {
            editorObjects[i].x = levelJSON.objects[i].x;
            editorObjects[i].y = levelJSON.objects[i].y;
        }
    }
    setDifficulty.value = levelJSON.difficulty;
    levelBGColEl.value = levelJSON.bgCol;
    levelFloorColEl.value = levelJSON.floorCol;
    let modeSelectBtns = document.getElementsByClassName("mode-select");
    for (let i = 0; i < modeSelectBtns.length; i++) {
        if (modeSelectBtns[i].id == `${levelJSON.mode}-radio`) {
            modeSelectBtns[i].checked = true;
        } else {
            modeSelectBtns[i].checked = false;
        }
    }

    document.getElementById("level-name").value = levelJSON.name;
}