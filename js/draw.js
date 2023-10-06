// Canvas and graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 480;
cnv.height = 330;
ctx.font = "30px Pusab";
ctx.textAlign = "center";
let camera = {
    x: 0,
    y: 270
}

// Draw Function
window.addEventListener("load", draw);
function draw() {
    if (gameState == "menu") {
        drawMenu();
    } else if (gameState == "gameLoop") {
        moveCamera();
        drawLevelComponents();
        drawPortalUnder();
        drawPlayer();
        drawGameObjects();
        drawHitboxes();
    } else if (gameState == "editor") {
        drawEditor();
    }
    requestAnimationFrame(draw);
}

function drawMenu() {
    ctx.drawImage(document.getElementById("gamebg"), 0, -180);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = background.colour;
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.globalAlpha = 1;
    if (menuState == "top") { 
        ctx.drawImage(document.getElementById("logo"), 40, 50);
        ctx.drawImage(document.getElementById("playbtn"), 100, 120);
        ctx.drawImage(document.getElementById("editorbtn"), 300, 150);
    } else if (menuState == "mainLevels") {
        ctx.drawImage(document.getElementById("greenarrow"), 10, 10);
        ctx.drawImage(document.getElementById("arrowleft"), 10, 130);
        ctx.drawImage(document.getElementById("arrowright"), 440, 130);
        ctx.drawImage(document.getElementById("levelbox"), 65, 60);
        ctx.fillStyle = "white";
        ctx.fillText(levels[menuSelect], 240, 130);
    } else if (menuState == "editorMenu") {
        ctx.drawImage(document.getElementById("greenarrow"), 10, 10);
        ctx.drawImage(document.getElementById("createbtn"), 75, 100);
        ctx.drawImage(document.getElementById("importbtn"), 275, 100);
    }
}