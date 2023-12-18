let levelJSON = [];
function startLevel(levelName) {
    fetch(`levels/${levelName}.json`)
        .then((res) => res.json())
        .then((data) => levelJSON = data)
        .then(createGameObjects)
        .then(initialize);
}

let importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
importInput.addEventListener("change", importLevel)
function importLevel() {
    new Response(importInput.files[0]).json()
        .then(json => {levelJSON = json})
        .then(createGameObjects)
        .then(initialize);
}

function createGameObjects() {
    maxX = 0;
    levelStartPos = [];
    gameObjs = [];
    collectedCoins = [];
    activeTriggers = [];
    for (let i = 0; i < levelJSON.objects.length; i++) {
        let objProps = objectList.find((element) => levelJSON.objects[i].id == element.id)

        gameObjs.push({
            id: levelJSON.objects[i].id,
            x: levelJSON.objects[i].x,
            y: levelJSON.objects[i].y,
            angle: levelJSON.objects[i].angle,
            h: objProps.h ?? fallback.h,
            w: objProps.w ?? fallback.w,
            hasHitbox: objProps.hasHitbox ?? fallback.hasHitbox,
            type: objProps.type ?? fallback.type,
            activated: false,
        })
        if (gameObjs[i].w < 30 || gameObjs[i].h < 30) {
            gameObjs[i].rotCenter = [gameObjs[i].x + 15, gameObjs[i].y + 15];
        } else {
            gameObjs[i].rotCenter = [gameObjs[i].x + gameObjs[i].w / 2, gameObjs[i].y + gameObjs[i].h / 2];
        }
        if (gameObjs[i].type == "portal") {
            gameObjs[i].portalType = objProps.portalType ?? fallback.portalType;
        } else if (gameObjs[i].type == "pad") {
            gameObjs[i].padType = objProps.padType ?? fallback.padType;
        } else if (gameObjs[i].type == "orb") {
            gameObjs[i].orbType = objProps.orbType ?? fallback.orbType;
        } else if (gameObjs[i].type == "trigger") {
            gameObjs[i].colour = levelJSON.objects[i].colour;
            gameObjs[i].fadeTime = levelJSON.objects[i].fadeTime;
            gameObjs[i].target = levelJSON.objects[i].target;
            gameObjs[i].touchActivated = levelJSON.objects[i].touchActivated;
        } else if (gameObjs[i].id == "coin") {
            gameObjs[i].xVel = 0;
            gameObjs[i].yVel = 0;
            gameObjs[i].oldx = gameObjs[i].x;
            gameObjs[i].oldy = gameObjs[i].y;
        } else if (gameObjs[i].id == "startpos") {
            levelStartPos.push({
                x: levelJSON.objects[i].x,
                y: levelJSON.objects[i].y,
                mode: levelJSON.objects[i].mode,
                flipGravity: levelJSON.objects[i].flipGravity
            })
        }
        if (gameObjs[i].hasHitbox) {
            gameObjs[i].hbx = levelJSON.objects[i].x + (objProps.hbx ?? fallback.hbx);
            gameObjs[i].hby = levelJSON.objects[i].y + (objProps.hby ?? fallback.hby);
            gameObjs[i].hbw = (objProps.hbw ?? fallback.hbw);
            gameObjs[i].hbh = (objProps.hbh ?? fallback.hbh);
            gameObjs[i].hbType = (objProps.hbType ?? fallback.hbType);
        }
        if (gameObjs[i].angle !== 0) {
            rotateObject(gameObjs[i], 0, true);
            translateAfterRotation(gameObjs[i], levelJSON.objects[i]);
        }
        if (gameObjs[i].x > maxX) {
            maxX = gameObjs[i].x;
        }
    }
    song = new Audio(`songs/${levelJSON.song}`);
}