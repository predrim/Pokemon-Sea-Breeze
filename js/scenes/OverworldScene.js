import { Sprite } from "../classes/Sprite.js";
import { makeBoundaries, copyRows } from "../core/utils.js"
import { TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, WORLD_SCALE } from "../core/globalConfig.js";

export class OverworldScene {
    constructor(config) {
        // --- 1. CONFIGURATION ---
        this.tileSize = config.tileSize || TILE_SIZE;
        this.encounterChance = config.encounterChance;
        this.onBattleStart = config.onBattleStart;

        // --- 2. IMAGES
        const image = new Image();
        image.src = config.imageSrc;

        const foregroundImage = new Image();
        foregroundImage.src = config.foregroundSrc;

        const playerImage = new Image();
        playerImage.src = './assets/Characters/Players/Crys.png';

        // --- 3. STATE ---
        this.isPlayerMoving = false;
        this.lastKey = '';
        this.walkAnimationTimer = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.currentTile = { ...config.playerStartingPosition };

        // --- 4. POSITIONING ---
        // Center the map around the player's position
        const offset = {
            x: -((this.currentTile.x * this.tileSize + this.tileSize/2) - (CANVAS_WIDTH/2)),
            y: -((this.currentTile.y * this.tileSize + this.tileSize/2) - (CANVAS_HEIGHT/2))
        };

        // --- 5. SPRITES & OBJECTS ---
        this.background = new Sprite ({
            position: { x: offset.x, y: offset.y },
            image: image,
            scale: WORLD_SCALE
        });

        this.foreground = new Sprite({
            position: { x: offset.x, y: offset.y},
            image: foregroundImage,
            scale: WORLD_SCALE
        });

        this.player = new Sprite({
            position: {
                x: CANVAS_WIDTH / 2 - this.tileSize / 2, // Center of Screen
                y: CANVAS_HEIGHT / 2 - this.tileSize / 2,
            },
            image: playerImage,
            frameAmountH: 4,
            frameAmountV: 4,
            scale: WORLD_SCALE
        });

        // --- 6. BOUNDARIES ---
        const collisionRows = [];
        copyRows(collisionRows, config.collisions, 70);
        this.collisionBoundaries = makeBoundaries(collisionRows, offset);

        const encounterRows = [];
        copyRows(encounterRows, config.encounters || [], 70);
        this.encounterBoundaries = makeBoundaries(encounterRows, offset);

        this.dialogues = config.dialogues || {};

        const interactionRows = [];
        copyRows(interactionRows, config.interactions || [], 70);
        this.interactionBoundaries = makeBoundaries(interactionRows, offset);

        // Elements that move with the map
        this.movables = [this.background, this.foreground, ...this.collisionBoundaries, ...this.encounterBoundaries, ...this.interactionBoundaries];  
        
        // --- 7. DIALOGUE BOX ---
        this.txtBoxElement = document.getElementById('txt-box');
        this.txtElement = document.getElementById('txt');

    }

    // ==================
    //    MAIN METHODS
    // ==================

    draw(ctx) {
        this.background.draw(ctx);
        this.player.draw(ctx);
        this.foreground.draw(ctx);
    }

    update(keys) {
        const animationSpeed = 8;

        // 1. Handle Walking Animation
        if (this.isPlayerMoving) {
            this.walkAnimationTimer++;
            this.player.frameH = Math.floor(this.walkAnimationTimer / animationSpeed) % this.player.frameAmountH;
        }

        // 2. Handle Continuous Movement (Moving the map to target)
        if (this.isPlayerMoving) {
            if (this.lastKey === 'w') {
                this.movables.forEach(movable => {movable.position.y += 4});
                // Check if the target has been reached
                if (this.background.position.y >= this.targetY) {
                    this.finishMovement(0, -1);
                }
            }
            else if (this.lastKey === 'a') {
                this.movables.forEach(movable => { movable.position.x += 4 });
                if (this.background.position.x >= this.targetX) {
                    this.finishMovement(-1, 0);
                }
            }
            else if (this.lastKey === 's') {
                this.movables.forEach(movable => { movable.position.y -= 4 });
                if (this.background.position.y <= this.targetY) {
                    this.finishMovement(0, 1);
                }
            }
            else if (this.lastKey === 'd') {
                this.movables.forEach(movable => { movable.position.x -= 4 });
                if (this.background.position.x <= this.targetX) {
                    this.finishMovement(1, 0);
                }
            }
        }

        // 3. Handle Input (Starting Movement)
        // Sets player's target tile based on what key was pressed
        if (!this.isPlayerMoving) {
            if (keys.w.pressed) {
                this.moveInDirection('w', 3, 0, 1);
            } else if (keys.a.pressed) {
                this.moveInDirection('a', 1, 1, 0);
            } else if (keys.s.pressed) {
                this.moveInDirection('s', 0, 0, -1);
            } else if (keys.d.pressed) {
                this.moveInDirection('d', 2, -1, 0);
            }
        }
    }

    // ============================
    //      HELPER LOGIC
    // ============================

    // Setup movement variables when a key is pressed
    moveInDirection(key, frameV, moveX, moveY) {
        this.lastKey = key;
        this.player.frameV = frameV;
        this.attemptMove(moveX, moveY);
    }

    // Resets flags after completing a step
    finishMovement(deltaX, deltaY) {
        this.isPlayerMoving = false;
        this.currentTile.x += deltaX;
        this.currentTile.y += deltaY;
        this.checkForEncounter();
    }

    // Logic to check collisions and setthe target coordinate
    attemptMove(moveX, moveY) {
        let canMoveDir = true;

        // Player hitbox (smaller than sprite for collision accuracy)
        const hitbox = {
        position: {
            x: this.player.position.x + 16,
            y: this.player.position.y + 16
        },
       width: 32,
        height: 32
        }

        // Check Collisions
        for (let i = 0; i < this.collisionBoundaries.length; i++) {
            const boundary = this.collisionBoundaries[i];

            // Predict where the boundary will be if we move
            const predictBoundaryPos = {
                x: boundary.position.x + (moveX * this.tileSize),
                y: boundary.position.y + (moveY * this.tileSize)
            };

            if (this.rectangularCollision({
                rectangle1: hitbox,
                rectangle2: { ...boundary, position: predictBoundaryPos }
            })) {
                canMoveDir = false;
                break;
            }
        }

        // Set Move Targets if clear
        if (canMoveDir) {
            this.isPlayerMoving = true;
            this.targetX = this.background.position.x + (moveX * this.tileSize);
            this.targetY = this.background.position.y + (moveY * this.tileSize);
        }
    }

    checkForInteraction() {
        const interactionHitbox = {
        position: {
                x: this.player.position.x + 16,
                y: this.player.position.y + 16
            },
            width: 32,
            height: 32
        }

        // Move interaction hitbox in front of player
        if (this.player.frameV === 0) interactionHitbox.position.y += this.tileSize;
        else if (this.player.frameV === 1) interactionHitbox.position.x -= this.tileSize;
        else if (this.player.frameV === 2) interactionHitbox.position.x += this.tileSize;
        else if (this.player.frameV === 3) interactionHitbox.position.y -= this.tileSize;

        for (let i = 0; i < this.interactionBoundaries.length; i++) {
            const boundary = this.interactionBoundaries[i];

            if (this.rectangularCollision({
                rectangle1: interactionHitbox,
                rectangle2: boundary
            })) {
                // Retrieve text from Json
                const text = this.dialogues[boundary.symbol];
                
                if (text) {
                    console.log("Dialogue Found: ", text);
                    this.txtElement.innerText = text;
                    this.txtBoxElement.style.display = 'block';
                }
                break;
            }
        }
    }

    checkForEncounter() {
        const hitbox = {
            position: {
                x: this.player.position.x + 16,
                y: this.player.position.y + 16
            },
            width: 32,
            height: 32
        }

        for (let i = 0; i < this.encounterBoundaries.length; i++) {
            const encounterTile = this.encounterBoundaries[i];

            if (this.rectangularCollision({
                rectangle1: hitbox,
                rectangle2: encounterTile
            })) {
                // RNG check
                if (Math.random() < (this.encounterChance / 100)) {
                    this.onBattleStart();
                }
                break;
            }
        }
    }

    // Standard AABB Collision Check
    rectangularCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
            rectangle1.position.y <= rectangle2.position.y + rectangle2.height
        );
    }
}