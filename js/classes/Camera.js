export class Camera {
    constructor(config) {
        this.width = config.WIDTH;
        this.height = config.HEIGHT;
        this.target = null;

        this.x = 0;
        this.y = 0;
    };

    setTarget(newTarget) {
        this.target = newTarget;
    }

    update(tileSize) {
        if (!this.target) return;
        this.x = this.target.position.x - (this.width/2) + (tileSize/2);
        this.y = this.target.position.y - (this.height/2) + (tileSize/2);
    }

    begin(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    end(ctx) {
        ctx.restore();
    }
}