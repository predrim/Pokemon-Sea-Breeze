// --- IMPORTS ---
import { OverworldScene } from "../scenes/OverworldScene.js";
import { BattleTransitionScene } from "../scenes/BattleTransition.js";
import { AssetLoader } from "../classes/AssetLoader.js";
import { maps } from "../../data/maps.js";
import { CANVAS_SIZE } from "./globalConfig.js";

// --- CANVAS SETUP ---
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_SIZE.WIDTH;
canvas.height = CANVAS_SIZE.HEIGHT;
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
    console.log("Loading Assets and Map...");
    
    const [mapConfig] = await Promise.all([
        assetLoader.loadMap(maps["T1_PH_F1"]),
        assetLoader.loadImage('./assets/Characters/Players/Crys.png'),
        assetLoader.loadFont('GSC', './assets/Fonts/pokemon-gsc.otf.woff2')
    ]);

    // Battle Callback
    mapConfig.onBattleStart = () => {
        console.log("Transitioning to battle Scene...");
        currentScene = new BattleTransitionScene(currentScene, () => {
            console.log("Transition Done. Starting Battle!");
        });
    };

    // Warp Callback
    const handleWarp = async (warpLocation, spawnPosition) => {
        const newMapData = await assetLoader.loadMap(maps[warpLocation]);
        mapConfig = newMapData;
        mapConfig.onWarp = handleWarp;
        currentScene = new OverworldScene(mapConfig, spawnPosition);
    };
    mapConfig.onWarp = handleWarp;

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
            if (currentScene && currentScene.state === "TALKING") {
                if (currentScene.canClose) {
                    currentScene.closeDialogue();
                }
            } else if (currentScene && currentScene.checkForInteraction) {
                currentScene.checkForInteraction();
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