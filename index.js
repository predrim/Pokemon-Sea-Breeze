const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const town1 = new Image();
town1.src = './assets/Sea_Breeze_Town.png';
console.log(town1);

const playerImage = new Image();
playerImage.src = './assets/Crys.png';

const pWidth = playerImage.width;
const pHeight = playerImage.height;

class Sprite {
    constructor({ position, velocity, image }) {
        this.position = position
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x: -864,
        y: -1152
    },
    image: town1
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

function animate() {
    window.requestAnimationFrame(animate)
    c.imageSmoothingEnabled = false;
    background.draw();
    c.drawImage(
        playerImage,
        0,
        0,
        pWidth / 4,
        pHeight / 4,
        canvas.width / 2 - pWidth / 2,
        canvas.height / 2 - pHeight / 2,
        pWidth, pHeight
    );

    if (keys.w.pressed) background.position.y += 3
    else if (keys.a.pressed) background.position.x += 3
    else if (keys.s.pressed) background.position.y -= 3
    else if (keys.d.pressed) background.position.x -= 3
}
animate();

let lastKey = ''
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