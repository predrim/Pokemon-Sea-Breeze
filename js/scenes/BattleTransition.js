import { Sprite } from "../classes/Sprite.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../core/globalConfig.js";
import { wait } from "../core/utils.js";

export class BattleTransitionScene {
    constructor(previousScene, onComplete) {

        console.log("transition received previous scene: ", previousScene);
        this.previousScene = previousScene;
        this.onComplete = onComplete;
        this.isFinished = false;
        this.isWaiting = false;

        // Animation State
        this.transitionAnimationSpeed = 2;
        this.transitionTimer = 0;

        // Load Image
        const image = new Image();
        image.src = './assets/Transitions/encounterWild.png';

        // Setup Sprite
        this.bttlTransAnim = new Sprite({
            position: { x: 0, y: 0},
            image: image,
            frameH: 0,
            frameAmountH: 28,
            scale: 2.5
        });
    }

    draw(ctx) {
        // Draw the previous scene first (so the screen doesn't just cut to black)
        this.previousScene.draw(ctx);
        
        if (!this.isFinished) {
            // State 1: Draw the animation
            this.bttlTransAnim.draw(ctx);
        }
        else {
            // State 2: Draw Black Screen
            ctx.fillStyle = '#010101';
            ctx.fillRect(0 , 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }

    update() {
        // Animation logic
        // Only animate if the sprite sheet isn't finished yet
        if (!this.isFinished) {
            console.log("Animation Fame:", this.bttlTransAnim.frameH);

            if (this.bttlTransAnim.frameH < this.bttlTransAnim.frameAmountH - 1) {
                this.transitionTimer++;
                this.bttlTransAnim.frameH = Math.floor(this.transitionTimer / this.transitionAnimationSpeed);
            } else {
                this.isFinished = true;
                this.startBlackScreenPause();
            }
        }
    }

    // Helper to handle the async wait safely
    async startBlackScreenPause() {
        if (this.isWaiting) return; // prevent double-triggering
        this.isWaiting = true;

        await wait(1); // Wait 1 second

        // Signal main.js to switch to the actual battle
        this.onComplete();
    }
}