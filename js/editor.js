let buildCategory = "build"; // The current category selected
let currentObj = "block"; // The Object selected in the build menu
let selectedIndex = -1; // The object selected in canvas
let editorTabs = document.getElementsByClassName("editor-tab");
let editorTabBtns = document.getElementsByClassName("editor-tab-btn");
let editorDivs = document.getElementsByClassName("editor-div");
let buildObjs = document.getElementsByClassName("build-object");
let editorObjects = [];

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
    currentObj = buildObjs[i].title.toLowerCase();
}

document.getElementById("editor-leave").addEventListener("click", editorLeave)
function editorLeave() {
    gameState = "menu";
    for (let i = 0; i < editorDivs.length; i++) {
        editorDivs[i].style.display = "none";
    }
}

document.getElementById("delete-obj-btn").addEventListener("click", () => {
    deleteObject(selectedIndex)
})
function deleteObject(index) {
    selectedIndex = -1;
    editorObjects.splice(index, 1)
}

function clickInEditor() {
    let coordX = mouseX + camera.x;
    let coordY = camera.y - mouseY;
    let snappedX = Math.floor((coordX) /30) * 30;
    let snappedY = Math.floor((coordY) /30) * 30;
    if (mouseX <= 480 && mouseX >= 0 && mouseY >= 0 && mouseY <= 330) {
        if (buildCategory == "build") {
            if (currentObj.split(" ")[1] == "portal") {
                editorObjects.push({
                    x: snappedX,
                    y: snappedY - 30,
                    type: "portal",
                    portalType: currentObj.split(" ")[0],
                    h: 90,
                    w: 30
                })
            } else {
                editorObjects.push({
                    x: snappedX,
                    y: snappedY,
                    type: currentObj,
                    h: 30,
                    w: 30
                })
            }
            selectedIndex = editorObjects.length - 1;
        } else if (buildCategory == "edit") {
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
            console.log(selectedIndex)
        } else {
            for (let i = 0; i < editorObjects.length; i++) {
                if (coordX >= editorObjects[i].x && coordX <= editorObjects[i].x + editorObjects[i].w && coordY >= editorObjects[i].y && coordY <= editorObjects[i].y + editorObjects[i].h) {
                    deleteObject(i)
                    break;
                }
            }
        }
    }
}

function editorKeys(e) {
    if (selectedIndex > -1) {
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
        }
    }
}

function drawEditor() {
    ctx.drawImage(document.getElementById("gamebg"), 0, -180);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 1;
    drawGrid();
    drawImgCam("floor", camera.x - player.x % 90, 0, 0);
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