class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, fast) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        if(fast) {
            this.moveSpeed = game.settings.spaceshipSpeed + 1;
        } else {
            this.moveSpeed = game.settings.spaceshipSpeed;
        }

        // Randomize direction
        this.leftFacing = true;
        if (Phaser.Math.Between(0, 1) == 1) {
            this.leftFacing = false;
            this.flipX = true;
        }
    }

    update() {
        // Left facing
        if(this.leftFacing) {
            // move spaceship left
            this.x -= this.moveSpeed;

            // wrap around from left edge to right edge
            if (this.x <= 0 - this.width) {
                this.reset();
            }
        }
        // Right facing
        else {
            this.x += this.moveSpeed;

            // wrap around from right edge to left edge
            if (this.x >= game.config.width + this.width) {
                this.reset();
            }
        }
    }

    reset() {
        if (this.leftFacing) {
            this.x = game.config.width;
        } else {
            this.x = 0 - this.width;
        }
    }

    speedUp() {
        this.moveSpeed += 1;
    }
}