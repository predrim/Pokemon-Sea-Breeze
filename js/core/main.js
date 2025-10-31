// Core Imports
import { Sprite } from "../classes/Sprite.js";
import { Boundary } from "../classes/Boundary.js";
import { battleScene } from "../scenes/BattleScene.js";
import { copyRows } from "./utils.js";

// Data Imports
import { dialogues } from "../data/Towns/Sea_Breeze/dialogues.js";
import { collisions } from "../data/Towns/Sea_Breeze/collisions.js"
import { interactions } from "../data/Towns/Sea_Breeze/interactions.js"
import { encounters } from "../data/Towns/Sea_Breeze/encounters.js"

// Canvas Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

// UI Elements
const txtBoxElement = document.getElementById('txt-box');
const txtElement = document.getElementById('txt');

// Global State variables
const tileSize = 64;
let isPlayerMoving = false;
let lastKey = '';
let walkAnimationTimer = 0;
let transitionTimer = 0;
let battleDelayTimer = 0;
let isDialogueActive = false;
let targetX = 0;
let targetY = 0;
let encounterChance = 15;
const spawnTile= {
    x: 22,
    y: 23
}
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
};
const battle = {
    initiated: false,
    delayComplete: false
};

// Image Assets
const town1 = new Image();
town1.src = './assets/Towns/Sea_Breeze/Sea_Breeze_Town.png';

const town1F = new Image();
town1F.src = './assets/Towns/Sea_Breeze/F-Sea_Breeze_Town.png';

const playerImage = new Image();
playerImage.src = './assets/Crys.png';

const battleTransition = new Image();
battleTransition.src = './assets/Transitions/encounterWild.png';

// Camera Offset (controls map positioning relative to player)
const offset = {
    x: -(((spawnTile.x*tileSize) -tileSize/2) - (canvas.width/2)),
    y: -(((spawnTile.y*tileSize) -tileSize/2) - (canvas.height/2))
};

// Map Data Conversion
// convert raw tile data into 2D maps
const collisionsMap = [];
copyRows(collisionsMap, collisions, 70);
const collisionTiles = [];

const encountersMap = [];
copyRows(encountersMap, encounters, 70);
const encounterTiles = [];

const interactionsMap = [];
copyRows(interactionsMap, interactions, 70);
const interactables = [];

/**
 * Creates "Boundary" objects from tile data.
 * Each non-zero tile represents an active boundary or trigger.
 */
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

// Generate all boundaries 
makeBoundaries(collisionsMap, collisionTiles);
makeBoundaries(encountersMap, encounterTiles);
makeBoundaries(interactionsMap, interactables);

// Sprite Definitions

// Player (stationary in the center; Map moves around them)
const player = new Sprite({
    position: {
        x: canvas.width / 2 - tileSize / 2,
        y: canvas.height / 2 - tileSize / 2,
    },
    image: playerImage,
    frameH: 0,
    frameV: 0,
    frameAmountH: 4,
    frameAmountV: 4,
    scale: 4
});

// Battle transition animation
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

// Map background (boundaries are generated based on it)
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: town1,
    scale: 4
});

// Map foreground (for tiles displayed above the character)
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: town1F,
    scale: 4
});

// Elements that move with the map
const movables = [background, foreground, ...collisionTiles, ...encounterTiles, ...interactables];

// Detects rectangular overlap between two objects
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

// ==== Main game loop ====
function animate() {
    window.requestAnimationFrame(animate)
    c.imageSmoothingEnabled = false;
    
    // Overworld mode
    if (!isDialogueActive && !battle.initiated) {

        background.draw(c);
        player.draw(c);
        foreground.draw(c);
    
        const animationSpeed = 8;

        if (isPlayerMoving) {
            walkAnimationTimer++;
            player.frameH = Math.floor(walkAnimationTimer / animationSpeed) % player.frameAmountH;
        }

        // Gradually moves the world until player reaches targeted position
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
                moveInDirection('w', 3, 0, tileSize);
            } else if (keys.a.pressed) {
                moveInDirection('a', 1, tileSize, 0);
            } else if (keys.s.pressed) {
                moveInDirection('s', 0, 0, -tileSize);
            } else if (keys.d.pressed) {
                moveInDirection('d', 2, -tileSize, 0);
            }
        }
    } 
    // End of Overworld mode
    

    // Battle mode
    else if (battle.initiated) {
        const transitionAnimationSpeed = 2;

        if (bttlTransAnim.frameH < bttlTransAnim.frameAmountH) {
            // Play Battle transition
            transitionTimer++;
            bttlTransAnim.frameH = Math.floor(transitionTimer / transitionAnimationSpeed);
            bttlTransAnim.draw(c);
        } else {
            // Color Screen black before switching to Battle Scene
            c.fillStyle = '#010101';
            c.fillRect(0,0, canvas.width, canvas.height);

            // Delay Battle Scene switch
            if (!battle.delayComplete) {
                battleDelayTimer++;
                
                if (battleDelayTimer > 60) {
                    battle.delayComplete = true;
                }
            } else {
                // End of Battle Transition
                // Start of Battle
                battleScene(c);
            }
        }
    }
};
animate();

// Handles directional movement setup
function moveInDirection(key, frameV, offsetX, offsetY) {
    lastKey = key;
    player.frameV = frameV;
    movePlayer(offsetX, offsetY);
}

// Returns true or false based on a probability percentage
function checkProbability(chancePercentage) {
    chancePercentage /= 100;
    return Math.random() < chancePercentage;
};

/**
 * Attempts to move the player in a given direction.
 * Checks collisions with all collision tiles before moving.
 */
function movePlayer(corX, corY) {
    let canMoveDir = true;

    // Player hitbox (smaller than sprite for collision accuracy)
    const hitbox = {
        position: {
            x: player.position.x + 16,
            y: player.position.y + 16
        },
        width: 32,
        height: 32
    };

    // Test for collisions ahead
    for (let i = 0; i < collisionTiles.length; i++) {
        const boundary = collisionTiles[i];
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

    // Move world if path is clear
    if (canMoveDir) {
        isPlayerMoving = true;
        targetY = background.position.y + corY;
        targetX = background.position.x + corX;
    }
}

/**
 * Checks if player walked into an encounter tile
 * Possibly triggers a battle if so
 */
function checkForEncounter() {
    // Player hitbox (smaller than sprite for collision accuracy)
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
                battleDelayTimer = 0;
                battle.delayComplete = false;
            }
            break;
        }
    }
}


// Keyboard Controls
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

        // Spacebar -> Interact or close dialogue
        case ' ':
            if (isDialogueActive) {
                isDialogueActive = false;
                txtBoxElement.style.display = 'none';
                break;
            }

            // Interaction logic
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
            
            // Move interaction hitbox in front of player
            if (player.frameV === 0) interactionTarget.position.y += tileSize;
            else if (player.frameV === 1) interactionTarget.position.x -= tileSize;
            else if (player.frameV === 2) interactionTarget.position.x += tileSize;
            else if (player.frameV === 3) interactionTarget.position.y -= tileSize;

            // Check if player is facing an interactable object
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