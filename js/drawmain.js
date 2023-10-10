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

window.addEventListener("load", draw);
function draw() {
    if (gameState == "menu") {
        drawMenu();
    } else if (gameState == "gameLoop") {
        drawGame();
    } else if (gameState == "editor") {
        drawEditor();
    }
    requestAnimationFrame(draw);
}