let buildCategory = "build";
let editorTabs = document.getElementsByClassName("editor-tab");
let editorTabBtns = document.getElementsByClassName("editor-tab-btn");
let editorDivs = document.getElementsByClassName("editor-div");

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