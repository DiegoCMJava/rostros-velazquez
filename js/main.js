import PreloadScene from "./scenes/PreloadScene.js";
import IntroScene from "./scenes/IntroScene.js";
import GameScene from "./scenes/GameScene.js";


const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 1536,
        height: 864,
    },
    backgroundColor: '#100e0c',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        PreloadScene,
        IntroScene,
        GameScene
    ]
}

const game = new Phaser.Game(config);

window.phaserGame = game;