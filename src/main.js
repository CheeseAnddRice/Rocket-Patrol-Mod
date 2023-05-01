/* 
(Mod name) by Marcus Williamson. 1 hours
Mods: Time display (10), adds time for successful hits (15), spaceships speed up every 30 seconds (5)
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