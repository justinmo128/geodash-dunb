function checkCollision() {
    // Object collision
    for (let i = 0; i < gameObjs.length; i++) {
        // Blue Player + Blue Obj (Running into blocks)
        if (collides(player.bluehbx, player.bluehby, player.bluehbw, player.bluehbh, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && gameObjs[i].hbType == "blue") {
            playerDeath();
            return;
        }
        // Red Player + Blue Obj (Landing on blocks)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && 
        gameObjs[i].hbType == "blue") {
            if (player.yVel <= 0 && player.y + player.bluehbh > gameObjs[i].y + gameObjs[i].h) {
                player.y = gameObjs[i].y + gameObjs[i].hbh;
                player.bluehby = player.y + 11;
                player.grounded = true;
                return;
            } else if (player.y + player.h - player.bluehbh < gameObjs[i].y && player.mode == "ship") {
                player.roofed = true;
                console.log(player.yVel)
                player.y = gameObjs[i].y - player.h;
                player.bluehby = player.y + 11;
                return;
            }
        }
        // Red Player + Red Obj (Spikes)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && gameObjs[i].hbType == "red") {
            playerDeath();
            return;
        }
        // Red Player + Green Obj (Portals, Orbs, Pads)
        else if (collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) &&
        gameObjs[i].isPortal && !gameObjs[i].activated) {
            if (player.mode !== gameObjs[i].portalType) {
                player.yVel = 0;
            }
            player.mode = gameObjs[i].portalType;
            if (gameObjs[i].portalType == "ship") {
                if (gameObjs[i].y - 120 < 0 && !gameObjs[i].activated) {
                    ease(newFloor, [0, newFloor.y * -1], 200, "linear")
                    ease(roof, [0, roof.y * -1 + 390], 200, "linear")
                    ease(camera, [0, 315 - camera.y], 200, "linear")
                    newFloor.hby = 0;
                } else if (!gameObjs[i].activated) {
                    ease(newFloor, [0, gameObjs[i].y - 120 - newFloor.y], 200, "linear")
                    ease(roof, [0, gameObjs[i].y - 120 + 390 - roof.y], 200, "linear")
                    ease(camera, [0, gameObjs[i].y - 120 + 315 - camera.y], 200, "linear")
                    newFloor.hby = gameObjs[i].y - 120;
                }
                roof.hby = newFloor.hby + 390;
                newFloor.canCollide = true;
                roof.canCollide = true;
                player.angle = 0;
                gameObjs[i].activated = true;
            } else {
                cubeTransition = true;
                ease(camera, [0, 270 - camera.y], 200, "linear", () => {
                    cubeTransition = false;
                })
                newFloor.canCollide = false;
                roof.canCollide = false;
                player.angle = 0;
                gameObjs[i].activated = true;
            }
        }
    }
    // Ground, roof collision
    if (player.y <= newFloor.hby && newFloor.canCollide) {
        player.y = newFloor.y;
        player.bluehby = player.y + 11;
        player.grounded = true;
        if (!player.easing) {
            player.easing = true;
            ease(player, [0, 0, 0-player.angle], 150, "linear", () => {player.easing = false}, true, true);
        }
        return;
    } else if (player.y <= 0) {
        player.y = 0;
        player.bluehby = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y + player.h >= roof.hby - roof.h && roof.canCollide) {
        player.roofed = true;
        player.y = roof.y - roof.h - player.h;
        
        if (!player.easing) {
            player.easing = true;
            ease(player, [0, 0, 0-player.angle], 150, "linear", () => {player.easing = false}, true, true);
        }
        
        return;
    }
    player.grounded = false;
    player.roofed = false;
}

function collides(Ax, Ay, Aw, Ah, Bx, By, Bw, Bh) {
    if (Ax <= Bx + Bw &&
        Ax + Aw >= Bx &&
        Ay <= By + Bh &&
        Ay + Ah >= By) {
            return true;
    }
    return false;
}

function playerDeath() {
    player.dead = true;
    setTimeout(initialize, 300)
}