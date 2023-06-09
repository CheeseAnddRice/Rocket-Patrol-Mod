class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2; // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.playScene = scene;
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            // Mouse movement
            if(game.settings.mouseMovement) {
                this.x = this.playScene.input.x;
            }

            // Keyboard movement
            else {
                if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            
        }

        // fire button
        if (((Phaser.Input.Keyboard.JustDown(keyF) && !game.settings.mouseMovement) ||
            (this.playScene.input.mousePointer.isDown && game.settings.mouseMovement)) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // move up if firing
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}