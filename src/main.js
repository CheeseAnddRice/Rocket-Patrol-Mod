/* 
(Mod name) by Marcus Williamson. about 5 hours

-----Mod List-----
- Time display (10)
- Adds time for successful hits (15)
- Spaceships speed up every 30 seconds (5)
- "FIRE" UI text (5)
- Mouse movement (15)

Ideas: Speed and double shot powerup
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

// keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;