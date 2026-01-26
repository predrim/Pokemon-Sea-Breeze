import { Sprite } from "../classes/Sprite.js";

const battleBackImg = new Image();
battleBackImg.src = '../assets/Battlebacks/general_bg.png';

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackImg,
    scale: 4
});

export function battleScene(ctx) {
    ctx.imageSmoothingEnabled = false;
    battleBackground.draw(ctx);
};