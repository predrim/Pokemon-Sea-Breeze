export class Sprite {
    constructor({ position, image, frameH = 0, frameV = 0, frameAmountH = 1, frameAmountV = 1, scale = 1 }) {
        this.position = position;
        this.image = image;
        this.frameH = frameH;
        this.frameV = frameV;
        this.frameAmountH = frameAmountH;
        this.frameAmountV = frameAmountV;
        this.scale = scale;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.width = (this.image.width / this.frameAmountH) * this.scale;
            this.height = (this.image.height / this.frameAmountV) * this.scale;
        };
    };

    draw(c) {
        c.drawImage(
            this.image,
            this.image.width / this.frameAmountH * this.frameH,
            this.image.height / this.frameAmountV * this.frameV,
            this.image.width / this.frameAmountH,
            this.image.height / this.frameAmountV,
            this.position.x,
            this.position.y,
            (this.image.width / this.frameAmountH) * this.scale,
            (this.image.height / this.frameAmountV) * this.scale,
        );
    }
};
