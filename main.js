import { Sprite } from "./js/Sprite.js";
import { Boundary } from "./js/Boundary.js";
import { dialogues } from "./js/data/Towns/Sea_Breeze/dialogues.js";
import { battleScene } from "./js/BattleScene.js";

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const txtBoxElement = document.getElementById('txt-box');
const txtElement = document.getElementById('txt');

// Global variables
let isPlayerMoving = false;
let lastKey = '';
let walkAnimationTimer = 0;
let transitionTimer = 0;
let isDialogueActive = false;
let targetX = 0;
let targetY = 0;
let encounterChance = 15;
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
};

const town1 = new Image();
town1.src = './assets/Towns/Sea_Breeze/Sea_Breeze_Town.png';

const town1F = new Image();
town1F.src = './assets/Towns/Sea_Breeze/F-Sea_Breeze_Town.png';

const playerImage = new Image();
playerImage.src = './assets/Crys.png';

const battleTransition = new Image();
battleTransition.src = './assets/Transitions/encounterWild.png';

// Screen size
canvas.width = 1024;
canvas.height = 576;

// Camera (and character) placement
const offset = {
    x: -864,
    y: -1152
};

// copy every row from tilesArray and pushes them into arrayMap
function copyRows(arrayMap, tilesArray) {
    for (let i = 0; i < tilesArray.length; i += 70) {
        arrayMap.push(tilesArray.slice(i, i + 70));
    };
}

const collisionsMap = [];
copyRows(collisionsMap, collisions);
const boundaries = [];

const encountersMap = [];
copyRows(encountersMap, encounters);
const encounterTiles = [];

const interactionsMap = [];
copyRows(interactionsMap, interactions);
const interactables = [];

// makes Boundaries based on the coordinates from each tile in
// arrayMap[] and adds them to rowsArray[]
function makeBoundaries(arrayMap, rowsArray) {
    arrayMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol !== 0) {
                const boundary = new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
                boundary.symbol = symbol;

                rowsArray.push(boundary);
            }
        })
    });
}

makeBoundaries(collisionsMap, boundaries);
makeBoundaries(encountersMap, encounterTiles);
makeBoundaries(interactionsMap, interactables);

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 64 / 2,
        y: canvas.height / 2 - 64 / 2,
    },
    image: playerImage,
    frameH: 0,
    frameV: 0,
    frameAmountH: 4,
    frameAmountV: 4,
    scale: 4
});

const bttlTransAnim = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleTransition,
    frameH: 0,
    frameAmountH: 28,
    scale: 2
});

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: town1,
    scale: 4
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: town1F,
    scale: 4
});

const movables = [background, foreground, ...boundaries, ...encounterTiles, ...interactables];

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

const battle = {
    initiated: false
}

function animate() {
    window.requestAnimationFrame(animate)
    c.imageSmoothingEnabled = false;
    background.draw(c);

    // boundaries.forEach(boundary => {
    //     boundary.draw(c);
    // });

    // encounterTiles.forEach(encounterTile => {
    //     encounterTile.draw(c);
    // });

    player.draw(c);
    foreground.draw(c);

    const animationSpeed = 8;
    
    if (!isDialogueActive && !battle.initiated) {

        if (isPlayerMoving) {
            walkAnimationTimer++;
            player.frameH = Math.floor(walkAnimationTimer / animationSpeed) % player.frameAmountH;
        }


        // gradually moves the movables until player reaches the targeted tile
        if (isPlayerMoving && lastKey === 'w') {
            movables.forEach(movable => { movable.position.y += 4 });
            if (background.position.y >= targetY) {
                isPlayerMoving = false;
                checkForEncounter();
            }
        }
        else if (isPlayerMoving && lastKey === 'a') {
            movables.forEach(movable => { movable.position.x += 4 });
            if (background.position.x >= targetX) {
                isPlayerMoving = false;
                checkForEncounter();
            }
        }
        else if (isPlayerMoving && lastKey === 's') {
            movables.forEach(movable => { movable.position.y -= 4 });
            if (background.position.y <= targetY) {
                isPlayerMoving = false;
                checkForEncounter();
            }
        }
        else if (isPlayerMoving && lastKey === 'd') {
            movables.forEach(movable => { movable.position.x -= 4 });
            if (background.position.x <= targetX) {
                isPlayerMoving = false;
                checkForEncounter();
            }
        }

        // sets player's target tile based on what key was pressed
        if (!isPlayerMoving) {

            if (keys.w.pressed) {
                lastKey = 'w';
                player.frameV = 3;
                movePlayer(0, 64);
            } else if (keys.a.pressed) {
                lastKey = 'a';
                player.frameV = 1;
                movePlayer(64, 0);
            } else if (keys.s.pressed) {
                lastKey = 's';
                player.frameV = 0;
                movePlayer(0, -64);
            } else if (keys.d.pressed) {
                lastKey = 'd';
                player.frameV = 2;
                movePlayer(-64, 0);
            }
        }
    }
    
    if (battle.initiated) {
        const transitionAnimationSpeed = 2;

        if (bttlTransAnim.frameH < bttlTransAnim.frameAmountH) {
            transitionTimer++;
            bttlTransAnim.frameH = Math.floor(transitionTimer / transitionAnimationSpeed);
            bttlTransAnim.draw(c);
        } else {
            bttlTransAnim.draw(c);
            battleScene();
        }
    }
};
animate();

function checkProbability(chancePercentage) {
    chancePercentage /= 100;
    return Math.random() < chancePercentage;
};

// sets player target tile for moving
// stops player from moving in that direction if a boundary is detected
function movePlayer(corX, corY) {
    let canMoveDir = true;

    // custom hitbox for player
    // added "imprecision" for dealing with collisions
    const hitbox = {
        position: {
            x: player.position.x + 16,
            y: player.position.y + 16
        },
        width: 32,
        height: 32
    };

    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (rectangularCollision({
            rectangle1: hitbox,
            rectangle2: {
                ...boundary, position: {
                    x: boundary.position.x + corX,
                    y: boundary.position.y + corY
                }
            }
        })
        ) {
            canMoveDir = false;
            break;
        }
    }

    if (canMoveDir) {
        isPlayerMoving = true;
        targetY = background.position.y + corY;
        targetX = background.position.x + corX;
    }
}

function checkForEncounter() {
    // custom hitbox for player
    // added "imprecision" for dealing with collisions
    const hitbox = {
        position: {
            x: player.position.x + 16,
            y: player.position.y + 16
        },
        width: 32,
        height: 32
    }

    for (let i = 0; i < encounterTiles.length; i++) {
        const encounterTile = encounterTiles[i];
        if (rectangularCollision({
            rectangle1: hitbox,
            rectangle2: encounterTile
            
        })
        ) {
            if (checkProbability(encounterChance) && !battle.initiated) {
                console.log('A wild pokémon appears!');
                battle.initiated = true;
                transitionTimer = 0;
                bttlTransAnim.frameH = 0;
            }
            break;
        }
    }
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            break;

        case 'a':
            keys.a.pressed = true;
            break;

        case 's':
            keys.s.pressed = true;
            break;

        case 'd':
            keys.d.pressed = true;
            break;

        case ' ':
            if (isDialogueActive) {
                isDialogueActive = false;
                txtBoxElement.style.display = 'none';
                break;
            }

            const hitbox = {
                position: {
                    x: player.position.x + 16,
                    y: player.position.y + 16
                },
                width: 32,
                height: 32
            };

            const interactionTarget = {
                ...hitbox,
                position: { ...hitbox.position }
            };

            if (player.frameV === 0) interactionTarget.position.y += 64;
            else if (player.frameV === 1) interactionTarget.position.x -= 64;
            else if (player.frameV === 2) interactionTarget.position.x += 64;
            else if (player.frameV === 3) interactionTarget.position.y -= 64;

            for (let i = 0; i < interactables.length; i++) {
                const interactable = interactables[i];

                if (rectangularCollision({
                    rectangle1: interactionTarget,
                    rectangle2: interactable
                })
                ) {
                    // Get the dialogue text from the object
                    const dialogue = dialogues[interactable.symbol];

                    // Check if a dialogue exists for this symbol
                    if (dialogue) {
                        txtElement.innerText = dialogue;
                        isDialogueActive = true;
                        txtBoxElement.style.display = 'block';

                        isDialogueActive = true;
                    };

                    break;
                }
            }
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        case 's':
            keys.s.pressed = false;
            break;

        case 'd':
            keys.d.pressed = false;
            break;
    }
});