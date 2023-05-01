class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (player)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ships = [this.ship01, this.ship02, this.ship03];

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // display score
        this.p1Score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        // Game over flag
        this.gameOver = false;

        // 60-second timer (which can be extended by hits)
        scoreConfig.fixedWidth = 0;
        /*
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        */
        this.timer = game.settings.gameTimer;
        this.timerDisplay = this.add.text(game.config.width - (borderUISize + borderPadding) * 4, borderUISize + borderPadding * 2, 'Time: ' + this.timer * 0.001, scoreConfig);

        // Speed up every 20 or 30 seconds
        this.speedupThreshold = game.settings.speedUpFrequency;
        this.speedUpText = this.add.text(game.config.width / 2, game.config.height / 2 - borderPadding, 'Speed up!').setOrigin(0.5);
        this.speedUpText.alpha = 0;
    }

    update(time, delta) {
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // Doesn't work, not sure why
        /* for (let ship in this.ships) {
            console.log(ship);
            if (this.checkCollision(this.p1Rocket, ship)) {
                console.log("boom");
                this.shipExplode(ship);
                this.p1Rocket.reset();
                this.timer += 5000;
            }
        }
        */
        
        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
            this.timer += game.settings.timeBonus;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
            this.timer += game.settings.timeBonus;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
            this.timer += game.settings.timeBonus;
        }

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }

        // dynamic timer display
        if(!this.gameOver) {
            this.timer -= delta;
            this.timerDisplay.text = 'Time: ' + Math.round(this.timer * 0.001);
        }

        // game over
        if(Math.round(this.timer * 0.001) == 0) {
            this.gameOverScreen();
        }

        // Speed up every 30 seconds
        if (time > this.speedupThreshold) {
            this.speedupThreshold += game.settings.speedUpFrequency;
            for (let ship of this.ships) {
                ship.speedUp();
            }

            // Display speedup text
            this.time.delayedCall(game.settings.flashSpeed, () => {
                this.speedUpText.alpha = 1;
            }, null, this);
            this.time.delayedCall(game.settings.flashSpeed * 2, () => {
                this.speedUpText.alpha = 0;
            }, null, this);
            
        }

    }

    checkCollision(rocket, ship) {
        // simple AABB checking (Axis-Aligned Bounding Boxes)
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    gameOverScreen() {
        let gameoverConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', gameoverConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', gameoverConfig).setOrigin(0.5);
        this.gameOver = true;
    }
}