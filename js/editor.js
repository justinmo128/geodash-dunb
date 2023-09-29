let buildCategory = "build";
let editorTabs = document.getElementsByClassName("editor-tab");
let editorTabBtns = document.getElementsByClassName("editor-tab-btn");
let editorDivs = document.getElementsByClassName("editor-div");
let editorObjects = [{
        x: 100,
        y: 180,
        type: "spike"
    },
    {
        x: 130,
        y: 150,
        type: "spike"
    },
    {
        x: 160,
        y: 180,
        type: "spike"
    }
]

document.getElementById("editor-leave").addEventListener("click", editorLeave)
function editorLeave() {
    gameState = "menu";
    for (let i = 0; i < editorDivs.length; i++) {
        editorDivs[i].style.display = "none";
    }
}

document.getElementById("build-btn").addEventListener("click", () => switchCategory("build"));
document.getElementById("edit-btn").addEventListener("click", () => switchCategory("edit"));
document.getElementById("delete-btn").addEventListener("click", () => switchCategory("delete"));

function switchCategory(newCat) {
    buildCategory = newCat;
    for (let i = 0; i < editorTabs.length; i++) {
        editorTabs[i].style.display = "none";
        editorTabBtns[i].style.backgroundImage = `url("img/editorselectbtn.png")`;
    }
    document.getElementById(`${newCat}-box`).style.display = "flex";
    document.getElementById(`${newCat}-btn`).style.backgroundImage = `url("img/editorselectbtnon.png")`;
}

function clickInEditor() {
    console.log(`Clicked at ${mouseX + camera.x}, ${camera.y - mouseY}`)
}

function drawEditor() {
    ctx.drawImage(document.getElementById("gamebg"), 0, -180);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 1;
    drawEditorObjects();
    
}

function drawEditorObjects() {
    for (let i = 0; i < editorObjects.length; i++) {
        if (editorObjects[i].type == "portal") {
            drawImgCam(`portal${editorObjects[i].portalType}over`, editorObjects[i].x, editorObjects[i].y, editorObjects[i].h);
        } else {
            drawImgCam(editorObjects[i].type, editorObjects[i].x, editorObjects[i].y, 30);
        }
    }
}