export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {

        if (!this.textures.exists('screen_bg')) {
            this.load.image('screen_bg', 'assets/screen_bg.png');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.image(0, 0, 'screen_bg')
            .setOrigin(0, 0)
            .setDisplaySize(width, height);

        this.add.rectangle(0, 0, width, height, 0x0a0908, 0.45)
            .setOrigin(0, 0);

        const panelWidth = 1180;
        const panelHeight = 670;

        const panel = this.add.rectangle(centerX, centerY, panelWidth, panelHeight, 0x100e0c, 0.88);
        panel.setStrokeStyle(2, 0x8C4A32, 0.9);

        const innerBorder = this.add.rectangle(centerX, centerY, panelWidth - 18, panelHeight - 18);
        innerBorder.setStrokeStyle(1, 0xC88A36, 0.45);

        this.add.line(0, 0, centerX - 180, centerY - 245, centerX + 180, centerY - 245, 0xC88A36, 0.6).setOrigin(0, 0);

        this.add.text(centerX, centerY - 275, 'DIEGO VELÁZQUEZ', {
            fontSize: '34px',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'bold',
            color: '#f2ca50',
            letterSpacing: 2
        }).setOrigin(0.5);

        const bioText = "Diego Rodríguez de Silva y Velázquez (Sevilla, bautizado el 6 de junio de 1599-Madrid, 6 de agosto de 1660), " +
            "conocido como Diego Velázquez, fue un pintor barroco español considerado uno de los máximos exponentes de la " +
            "pintura española y maestro de la pintura universal. Pasó sus primeros años en Sevilla, " +
            "donde desarrolló un estilo naturalista de iluminación tenebrista, por influencia de Caravaggio y sus seguidores.\n\n" +
            "Su catálogo consta de unas 120 o 130 obras. El reconocimiento como pintor universal se produjo tardíamente, " +
            "hacia 1850. Alcanzó su máxima fama entre 1880 y 1920, coincidiendo con la época de los pintores impresionistas franceses, " +
            "para los que fue un referente. Manet se sintió maravillado con su obra y le calificó como «pintor de pintores» " +
            "y «el más grande pintor que jamás ha existido». La parte fundamental de sus cuadros que integraban la colección " +
            "real se conserva en el Museo del Prado en Madrid.";

        this.add.text(centerX, centerY - 75, bioText, {
            fontSize: '18px',
            fontFamily: 'Plus Jakarta Sans, sans-serif ',
            color: '#e7e1de',
            lineSpacing: 10,
            wordWrap: { width: 1040, useAdvancedWrap: true },
            align: 'justify',
        }).setOrigin(0.5);

        this.add.text(centerX + 520, centerY + 135, '(Fuente: Wikipedia)', {
            fontSize: '13px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontStyle: 'italic',
            color: '#d0c5af'
        }).setOrigin(1, 0.5);

        this.add.line(0, 0, centerX - 140, centerY + 140, centerY + 165, 0x8C4A32, 0.5).setOrigin(0, 0);


        const btnY = centerY + 225;
        const btnWidth = 270;
        const btnHeight = 52;

        const btnStart = this.add.rectangle(centerX, btnY, btnWidth, btnHeight, 0x8C4A32)
            .setStrokeStyle(1.5, 0xf2ca50, 0.8)
            .setInteractive({ useHandCursor: true });

        const btnStartText = this.add.text(centerX, btnY, 'COMENZAR EL JUEGO ▶', {
            fontSize: '15px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontStyle: 'bold',
            color: '#FFFFFF',
            letterSpacing: 1
        }).setOrigin(0.5);


        btnStart.on('pointerover', () => {
            btnStart.setFillStyle(0xC88A36);
            btnStart.setStrokeStyle(2, 0xFFD700, 1);
            this.tweens.add({
                targets: [btnStart, btnStartText],
                scaleX: 1.04,
                scaleY: 1.04,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        btnStart.on('pointerout', () => {
            btnStart.setFillStyle(0x8C4A32);
            btnStart.setStrokeStyle(1.5, 0xf2ca50, 0.8);
            this.tweens.add({
                targets: [btnStart, btnStartText],
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        btnStart.on('pointerdown', () => {
            if (this.sound.get('success_sound')) {
                this.sound.play('success_sound', { volume: 0.6 });
            }

            const bgMusic = this.sound.get('bg_music');
            if (bgMusic && !bgMusic.isPlaying) {
                bgMusic.play({ loop: true, volume: 0.4 });
            }

            this.cameras.main.fadeOut(350, 16, 14, 12);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameScene');
            });
        });

        this.cameras.main.fadeIn(400, 16, 14, 12)
    }
}