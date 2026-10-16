export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }
    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(0, 0, width, height, 0x100e0c).setOrigin(0, 0);

        const loadingText = this.add.text(width / 2, height / 2 - 40, "CARGANDO...", {
            fontSize: '24px',
            fontFamily: 'Playfair Display, serif',
            color: '#f2ca50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const percentText = this.add.text(width / 2, height / 2 + 35, "0%", {
            fontSize: '16px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            color: '#d0c5af',
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x1E1B18, 0.9);
        progressBox.lineStyle(2, 0x8C4A32, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 12, 320, 24, 6);
        progressBox.strokeRoundedRect(width / 2 - 160, height / 2 - 12, 320, 24, 6);

        const progressBar = this.add.graphics();

        this.load.on('progress', (value) => {
            percentText.setText(`${Math.floor(value * 100)}%`);
            progressBar.clear();
            progressBar.fillStyle(0xf2ca50, 1);
            progressBar.fillRoundedRect(width / 2 - 156, height / 2 - 8, 312 * value, 16, 4);

        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });


        this.load.setPath('./assets/');

        this.load.image('screen_bg', 'images/screen.png');

        this.load.spritesheet('faces_spritesheet', 'images/faces_spritesheet.png', {
            frameWidth: 128,
            frameHeight: 126
        });

        this.load.audio('bg_music', 'audio/bg_sound.mp3');
        this.load.audio('lose_sound', 'audio/lose_sound.wav');
        this.load.audio('success_sound', 'audio/success.ogg');
        this.load.audio('game_over_sound', 'audio/game_over.wav');
        this.load.audio('victory_sound', 'audio/victory_sound.wav');


    }

    create() {
        this.scene.start('IntroScene');
    }
}