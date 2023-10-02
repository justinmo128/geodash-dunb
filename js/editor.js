let buildCategory = "build"; // The current category selected
let currentObj = "block"; // The Object selected in the build menu
let selectedObj; // The object selected in canvas
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

function clickInEditor() {
    let coordX = Math.floor((mouseX + camera.x) /30) * 30;
    let coordY = Math.floor((camera.y - mouseY) /30) * 30;
    if (mouseX <= 480 && mouseX >= 0 && mouseY >= 0 && mouseY <= 330) {
        if (buildCategory == "build") {
            if (currentObj.split(" ")[1] == "portal") {
                editorObjects.push({
                    x: coordX,
                    y: coordY,
                    type: "portal",
                    portalType: currentObj.split(" ")[0],
                    h: 90
                })
            } else {
                editorObjects.push({
                    x: coordX,
                    y: coordY,
                    type: currentObj,
                    h: 30
                })
            }
        } else if (buildCategory == "edit") {

        } else {
            let index = editorObjects.findIndex(
                element => element.x == coordX && element.y == coordY
            )
            if (index > -1) {
                editorObjects.splice(index, 1)
            }
        }
    }
}

function drawEditor() {
    ctx.drawImage(document.getElementById("gamebg"), 0, -180);
    drawImgCam("floor", camera.x - player.x % 90, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = floor.colour;
    fillRectCam(camera.x, -90, cnv.width, 90);
    ctx.globalAlpha = 1;
    drawEditorObjects();
}

function drawEditorObjects() {
    for (let i = 0; i < editorObjects.length; i++) {
        if (editorObjects[i].type == "portal") {
            drawImgCam(`portal${editorObjects[i].portalType}over`, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h);
        } else {
            drawImgCam(editorObjects[i].type, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h);
        }
    }
}