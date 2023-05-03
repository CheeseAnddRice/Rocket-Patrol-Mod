/* 
Rocket Patrol++ by Marcus Williamson. about 6 hours

-----Mod List-----
- Time display (10)
- Adds time for successful hits (15)
- Spaceships speed up every 30 seconds (5)
- "FIRE" UI text (5)
- Mouse movement (15)
- Particle explosions (15)
- High score (5)
- Randomized ship directions (5)
- Smaller, faster ship worth 100 points (15)
- Randomized explosion sound (10)
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    fps: {
        forceSetTimeOut: true,
        target: 60
    }
}
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let highScore = 0;

// keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;