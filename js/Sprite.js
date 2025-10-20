export class Sprite {
    constructor({ position, velocity, image, framesH = 1, framesV = 1, scale = 1 }) {
        this.position = position;
        this.image = image;
        this.framesH = framesH;
        this.framesV = framesV;
        this.scale = scale;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.width = (this.image.width / this.framesH) * this.scale;
            this.height = (this.image.height / this.framesV) * this.scale;
        };
    };

    draw(c) {
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.framesH,
            this.image.height / this.framesV,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesH) * this.scale,
            (this.image.height / this.framesV) * this.scale,
        );
    }
};
