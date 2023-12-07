function checkCollision() {
    player.touchingBlock = false;
    player.touchingOrb = [];
    // Object collision
    for (let i = 0; i < gameObjs.length; i++) {
        // Blue Player + Blue Obj (Running into blocks)
        if (gameObjs[i].type == "trigger") {
            checkTriggerCollision(gameObjs[i]);
        } else if (gameObjs[i].hasHitbox && collides(player.bluehbx, player.bluehby, player.bluehbw, player.bluehbh, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh) && gameObjs[i].hbType == "blue") {
            playerDeath();
        } else if (gameObjs[i].hasHitbox && collides(player.x, player.y, player.w, player.h, gameObjs[i].hbx, gameObjs[i].hby, gameObjs[i].hbw, gameObjs[i].hbh)) {
            // Red Player + Green Obj (Portals, Orbs, Pads)
            if (gameObjs[i].type == "portal" && !gameObjs[i].activated) {
                player.yVel /= 1.96;
                if (gameObjs[i].portalType == "ship" || gameObjs[i].portalType == "cube") {
                    switchGamemode(gameObjs[i]);
                } else if (gameObjs[i].portalType == "upsidedown") {
                    player.gravityStatus = -1;
                    gameObjs[i].activated = true;
                } else if (gameObjs[i].portalType == "rightsideup") {
                    player.gravityStatus = 1;
                    gameObjs[i].activated = true;
                }
            } else if (gameObjs[i].type == "pad" && !gameObjs[i].activated) {
                gameObjs[i].activated = true;
                if (gameObjs[i].padType == "yellow") {
                    player.yVel = 862.0614 * player.gravityStatus;
                    return;
                }
            } else if (gameObjs[i].type == "orb" && !gameObjs[i].activated) {
                player.touchingOrb.push(i)
            }
            // Red Player + Blue Obj (Landing on blocks)
            else if (gameObjs[i].hbType == "blue") {
                let blockCollisionResults = checkBlockCollision(gameObjs[i]);
                player.grounded = blockCollisionResults[0];
                player.roofed = blockCollisionResults[1];
            // Red Player + Red Obj (Spikes)
            } else if (gameObjs[i].hbType == "red") {
                playerDeath();
            }
        }
    }
    if (player.grounded || player.roofed) {
        player.yVel = 0;
    }
}

function checkTriggerCollision(obj) {
    if (((player.x + player.w >= obj.x && !obj.touchActivated) || 
    (collides(player.x, player.y, player.w, player.h, obj.hbx, obj.hby, obj.hbw, obj.hbh) && obj.touchActivated)) && !obj.activated) {
        obj.activated = true;
        obj.startTime = levelTime;
        if (obj.target == "floor") {
            obj.oldColour = floor.colour;
        } else {
            obj.oldColour = background.colour;
        }

        obj.newCol = [];
        obj.oldCol = [];
        for (let i = 0; i < 3; i++) {
            obj.newCol[i] = parseInt(obj.colour.slice(i*2+1, i*2+3), 16);
            obj.oldCol[i] = parseInt(obj.oldColour.slice(i*2+1, i*2+3), 16);
        }
        
        for (let i = 0; i < activeTriggers.length; i++) {
            if (obj.target == activeTriggers[i].target) {
                activeTriggers.splice(i, 1);
            }
        }
        activeTriggers.push(obj);
    }
}

function checkBlockCollision(obj) {
    if (player.gravityStatus == 1) {
        if (player.y <= obj.y + obj.h && player.y + 10 >= obj.y + obj.h && player.yVel < 0) {
            player.y = obj.y + obj.hbh;
            player.bluehby = player.y + 11;
            return [true, false];
        } else if (player.mode == "ship" && player.y + player.h - 10 < obj.y && player.y + player.h > obj.y && player.yVel > 0) {
            player.y = obj.y - player.h;
            player.bluehby = player.y + 11;
            return [false, true];
        }
    } else {
        if (player.y + player.h >= obj.y && player.y + player.h - 10 <= obj.y && player.yVel > 0) {
            player.y = obj.y - player.h;
            player.bluehby = player.y + 11;
            return [true, false];
        } else if (player.mode == "ship" && player.y < obj.y + obj.h && player.y + 10 > obj.y + obj.h && player.yVel < 0) {
            player.y = obj.y + obj.hbh;
            player.bluehby = player.y + 11;
            return [false, true];
        }
    }
    return [false, false]
}

function switchGamemode(obj) {
    player.mode = obj.portalType;
    if (player.mode == "ship") {
        newFloor.hby = Math.max(0, floorToNearest((obj.y + obj.h / 2) - 150, 30));
        ease(newFloor, [0, Math.max(newFloor.y * -1, newFloor.hby - newFloor.y)], 200, "linear")
        ease(roof, [0, Math.max(roof.y * -1 + 390, newFloor.hby + 390 - roof.y)], 200, "linear")
        ease(camera, [0, Math.max(45 - camera.y, newFloor.hby + 45 - camera.y)], 200, "linear")
        roof.hby = newFloor.hby + 390;
        newFloor.canCollide = true;
        roof.canCollide = true;
    } else if (player.mode == "cube") {
        cubeTransition = true;
        ease(camera, [0, 0 - camera.y], 200, "linear", () => {cubeTransition = false;})
        newFloor.canCollide = false;
        roof.canCollide = false;
    }
    player.angle = 0;
    obj.activated = true;
}

function checkFloorRoofCollision() {
    // Ground, roof collision
    if (player.y <= newFloor.hby && newFloor.canCollide) {
        player.y = newFloor.y;
        player.bluehby = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y <= 0) {
        player.y = 0;
        player.bluehby = player.y + 11;
        player.grounded = true;
        return;
    } else if (player.y + player.h >= roof.hby - roof.h && roof.canCollide) {
        player.roofed = true;
        player.y = roof.y - roof.h - player.h;
        return;
    } else if (!player.touchingBlock) {
        player.grounded = false;
        player.roofed = false;
    }
    if (player.roofed && !keyHeld) {
        player.roofed = false;
    }
}

function collides(Ax, Ay, Aw, Ah, Bx, By, Bw, Bh) {
    if (Ax < Bx + Bw &&
        Ax + Aw > Bx &&
        Ay < By + Bh &&
        Ay + Ah > By) {
            return true;
    }
    return false;
}

function playerDeath() {
    player.dead = true;
    setTimeout(initialize, 300)
}