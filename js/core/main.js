// --- IMPORTS ---
import { OverworldScene } from "../scenes/OverworldScene.js";
import { BattleTransitionScene } from "../scenes/BattleTransition.js";
import { AssetLoader } from "../classes/AssetLoader.js";
import { maps } from "../../data/maps.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CURRENT_MAP} from "./globalConfig.js";

// --- CANVAS SETUP ---
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.imageSmoothingEnabled = false;

// --- GLOBAL STATE ---
let currentScene = null;
let assetLoader = new AssetLoader();

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
};

// --- INITIALIZATION ---
async function initGame() {
    // Load the data for map
    console.log("Loading Map...");
    const mapConfig = await assetLoader.loadMap(maps[CURRENT_MAP]);
    
    // Battle Callback
    mapConfig.onBattleStart = () => {
        console.log("Transitioning to battle Scene...");
        currentScene = new BattleTransitionScene(currentScene, () => {
            console.log("Transition Done. Starting Battle!");
        });
    };

    // Start the Scene
    currentScene = new OverworldScene(mapConfig);
    console.log("Game Started!");
    
    // Start Loop
    animate();
}

// --- GAME LOOP ---
function animate() {
    window.requestAnimationFrame(animate);

    // Clear screen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentScene) {
        currentScene.update(keys);
        currentScene.draw(ctx);
    }
}

// --- INPUT HANDLING ---
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': keys.w.pressed = true; break;
        case 'a': keys.a.pressed = true; break;
        case 's': keys.s.pressed = true; break;
        case 'd': keys.d.pressed = true; break;

        case ' ':
            if (currentScene && currentScene.checkForInteraction) {
                const txtBox = document.getElementById('txt-box');
                // If the dialogue box is open, close it
                if (currentScene.isTalking) {
                    currentScene.closeDialogue();
                } else {
                    currentScene.checkForInteraction();
                }
            }
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w': keys.w.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
        case 's': keys.s.pressed = false; break;
        case 'd': keys.d.pressed = false; break;
    }
});

// Run the game
initGame();