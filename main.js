import { Sprite } from "./js/Sprite.js";

import { Boundary } from "./js/Boundary.js";

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Global variables
let isPlayerMoving = false;
let lastKey = '';
let animationTimer = 0;
let targetX = 0;
let targetY = 0;
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

// Screen size
canvas.width = 1024;
canvas.height = 576;

// Camera (and character) placement
const offset = {
    x: -864,
    y: -1152
};

const collisionsMap = [];

// Add each row from collisions[] to collisionsMap[]
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
};

const boundaries = [];

// get the coordinates from every collision in
// collisionMap[] and adds to boundaries[]
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 0) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
});

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

const movables = [background, foreground, ...boundaries]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    c.imageSmoothingEnabled = false;
    background.draw(c);

    // boundaries.forEach(boundary => {
    //     boundary.draw(c);
    // });

    player.draw(c);

    foreground.draw(c);

    const animationSpeed = 8;

    if (isPlayerMoving) {
        animationTimer++;
        player.frameH = Math.floor(animationTimer / animationSpeed) % player.frameAmountH;
    }

    // gradually moves the movables until player reaches the targeted tile
    if (isPlayerMoving && lastKey === 'w') {
        movables.forEach(movable => { movable.position.y += 4 });
        if (background.position.y >= targetY) {
            isPlayerMoving = false;
        }
    }
    else if (isPlayerMoving && lastKey === 'a') {
        movables.forEach(movable => { movable.position.x += 4 });
        if (background.position.x >= targetX) {
            isPlayerMoving = false;
        }
    }
    else if (isPlayerMoving && lastKey === 's') {
        movables.forEach(movable => { movable.position.y -= 4 });
        if (background.position.y <= targetY) {
            isPlayerMoving = false;
        }
    }
    else if (isPlayerMoving && lastKey === 'd') {
        movables.forEach(movable => { movable.position.x -= 4 });
        if (background.position.x <= targetX) {
            isPlayerMoving = false;
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
};
animate();


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
    }

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