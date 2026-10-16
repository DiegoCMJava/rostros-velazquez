import Board from "../objects/Board.js";
import LevelManager from "../managers/LevelManager.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {

        this.add.rectangle(0, 0, 1536, 864, 0x100e0c).setOrigin(0, 0);
        //this.add.rectangle(0, 0, 1536, 110, 0x151311).setOrigin(0, 0);
        this.add.line(0, 0, 0, 110, 1536, 110, 0x8C4A32, 0.4).setOrigin(0, 0);

        this.boardArea = {
            x: 0,
            y: 110,
            width: 1536,
            height: 754,
            centerX: 768,
            centerY: 487
        };

        this.add.rectangle(this.boardArea.centerX, this.boardArea.centerY, 1480, 710)
            .setStrokeStyle(1.5, 0x8C4A32, 0.35);

        this.board = new Board(this, this.boardArea);
        this.levelManager = new LevelManager(30);

        this.score = 0;
        this.attempts = 0;
        this.timeRemaining = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.isProcessing = false;
        this.matchedPairs = 0;
        this.totalPairs = 0;
        this.levelTimer = null;
        this.memorizeTimer = null;

        this.bgVolume = 0.4;
        this.isMuted = false;



        // UI
        const topYLabel = 32;
        const topYValue = 68;
        const audioY = 50;

        this.add.text(60, topYLabel, 'NIVEL', { fontSize: '13px', fontFamily: 'Plus Jakarta Sans', fontStyle: 'bold', color: '#C88A36' });
        this.levelText = this.add.text(60, topYValue, '1 / 30', { fontSize: '26px', fontFamily: 'Playfair Display', fontStyle: 'bold', color: '#f2ca50' });
        this.add.text(210, topYLabel, 'TIEMPO', { fontSize: '13px', fontFamily: 'Plus Jakarta Sans', fontStyle: 'bold', color: '#C88A36' });
        this.timeText = this.add.text(210, topYValue, '00:00', { fontSize: '26px', fontFamily: 'Playfair Display', fontStyle: 'bold', color: '#e7e1de' });
        this.add.text(360, topYLabel, 'INTENTOS', { fontSize: '13px', fontFamily: 'Plus Jakarta Sans', fontStyle: 'bold', color: '#C88A36' });
        this.attemptsText = this.add.text(360, topYValue, '0', { fontSize: '26px', fontFamily: 'Playfair Display', fontStyle: 'bold', color: '#e7e1de' });
        this.add.text(510, topYLabel, 'PUNTOS', { fontSize: '13px', fontFamily: 'Plus Jakarta Sans', fontStyle: 'bold', color: '#C88A36' });
        this.scoreText = this.add.text(510, topYValue, '0', { fontSize: '26px', fontFamily: 'Playfair Display', fontStyle: 'bold', color: '#f2ca50' });
        this.statusText = this.add.text(768, 150, '', {
            fontSize: '20px',
            fontFamily: 'Playfair Display',
            fontStyle: 'bold',
            color: '#f2ca50',
            align: 'center'
        }).setOrigin(0.5);


        const btnRestart = this.add.rectangle(1180, 50, 160, 42, 0x1E1B18)
            .setInteractive({ useHandCursor: true });

        const btnRestartText = this.add.text(1180, 50, 'REINICIAR', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        btnRestart.on('pointerover', () => btnRestart.setFillStyle(0xdb993f));
        btnRestart.on('pointerout', () => btnRestart.setFillStyle(0x1E1B18));
        btnRestart.on('pointerdown', () => this.restartCurrentLevel());

        this.btnNextLevel = this.add.rectangle(1380, 50, 190, 42, 0x8C4A32)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);
        this.btnNextLevelText = this.add.text(1380, 50, 'SIGUIENTE NIVEL ▶', {
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5).setVisible(false);

        this.btnNextLevel.on('pointerover', () => this.btnNextLevel.setFillStyle(0x8C4A36));
        this.btnNextLevel.on('pointerout', () => this.btnNextLevel.setFillStyle(0x8C4A32));
        this.btnNextLevel.on('pointerdown', () => this.onNextLevelClicked());

        this.btnMute = this.add.rectangle(730, audioY, 44, 42, 0x1E1B18)
            .setStrokeStyle(1, 0x8C4A32, 0.8)
            .setInteractive({ useHandCursor: true });

        this.btnMuteText = this.add.text(730, audioY, '🔊', {
            fontSize: '18px'
        }).setOrigin(0.5);

        this.btnMute.on('pointerover', () => this.btnMute.setFillStyle(0x3A322C));
        this.btnMute.on('pointerout', () => this.btnMute.setFillStyle(0x1E1B18));
        this.btnMute.on('pointerdown', () => this.toggleMute());

        this.btnVolDown = this.add.rectangle(790, audioY, 36, 42, 0x1E1B18)
            .setStrokeStyle(1, 0x8C4A32, 0.8)
            .setInteractive({ useHandCursor: true });

        this.add.text(790, audioY, '-', {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#e7e1de'
        }).setOrigin(0.5);

        this.btnVolDown.on('pointerover', () => this.btnVolDown.setFillStyle(0x3A322C));
        this.btnVolDown.on('pointerout', () => this.btnVolDown.setFillStyle(0x1E1B18));
        this.btnVolDown.on('pointerdown', () => this.changeVolume(-0.1));

        this.volText = this.add.text(855, audioY, `VOL: ${Math.round(this.bgVolume * 100)}%`, {
            fontSize: '14px',
            fontFamily: 'Plus Jakarta Sans',
            fontStyle: 'bold',
            color: '#f2ca50'
        }).setOrigin(0.5);

        this.btnVolUp = this.add.rectangle(920, audioY, 36, 42, 0x1E1B18)
            .setStrokeStyle(1, 0x8C4A32, 0.8)
            .setInteractive({ useHandCursor: true });

        this.add.text(920, audioY, '+', {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#e7e1de'
        }).setOrigin(0.5);

        this.btnVolUp.on('pointerover', () => this.btnVolUp.setFillStyle(0x3A322C));
        this.btnVolUp.on('pointerout', () => this.btnVolUp.setFillStyle(0x1E1B18));
        this.btnVolUp.on('pointerdown', () => this.changeVolume(0.1));

        this.startLevel();


        if (!this.sound.get('bg_music')) {
            this.bgMusic = this.sound.add('bg_music', {
                loop: true,
                volume: this.bgVolume

            });
        } else {
            this.bgMusic = this.bgMusic = this.sound.get('bg_music');
        }

        const startMusic = () => {
            if (!this.bgMusic.isPlaying && !this.isMuted) {
                this.bgMusic.play();
            }
        };

        if (this.sound.locked) {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, startMusic);
        } else {
            startMusic();
        }
    }

    startLevel() {
        if (this.levelTimer) this.levelTimer.remove();
        if (this.memorizeTimer) this.memorizeTimer.remove();

        this.hideNextLevelButton();

        this.firstCard = null;
        this.secondCard = null;
        this.isProcessing = true;
        this.matchedPairs = 0;
        this.totalPairs = this.levelManager.getPairsCount();
        this.attempts = this.levelManager.getMaxAttempts();
        this.timeRemaining = this.levelManager.getTimeLimit();

        this.updateUI();
        this.statusText.setText('¡Memoriza los rostros!');

        const cardDeck = this.levelManager.getCardsForCurrentLevel();
        this.board.createBoard(cardDeck, (card) => {
            this.handleCardClick(card);
        });

        this.board.setInteraction(false);

        const previewTime = this.levelManager.getPreviewDuration();

        this.memorizeTimer = this.time.delayedCall(previewTime, () => {
            this.board.hideAllCards(() => {
                this.isProcessing = false;
                this.board.setInteraction(true);
                this.statusText.setText('¡Encuentra las parejas!');
                this.startLevelTimer();
            });
        });
    }

    startLevelTimer() {
        this.levelTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeRemaining--;
                this.timeText.setText(this.formatTime(this.timeRemaining));

                if (this.timeRemaining <= 0) {
                    this.levelTimer.remove();
                    this.handleLevelFailed('¡Tiempo agotado!');
                }
            }
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.bgMusic) this.bgMusic.pause();
            this.btnMuteText.setText('🔇');
            this.volText('MUTE');
        } else {
            if (this.bgMusic) {
                if (this.bgMusic.isPaused) {
                    this.bgMusic.resume();
                } else if (!this.bgMusic.isPlaying) {
                    this.bgMusic.play();
                }
            }
            this.btnMuteText.setText('🔊');
            this.volText.setText(`VOL: ${Math.round(this.bgVolume * 100)}%`)
        }

    }

    changeVolume(delta) {
        if (this.isMuted) {
            this.toggleMute()
        }

        this.bgVolume = Phaser.Math.Clamp(this.bgVolume + delta, 0, 1);
        this.bgVolume = Math.round(this.bgVolume * 10) / 10;

        if (this.bgMusic) {
            this.bgMusic.setVolume(this.bgVolume);
        }

        if (this.bgVolume === 0) {
            this.btnMuteText.setText('🔇');
            this.volText.setText('0%');
        } else {
            this.btnMuteText.setText('🔊');
            this.volText.setText(`VOL: ${Math.round(this.bgVolume * 100)}%`);

        }
    }

    handleCardClick(card) {
        if (this.isProcessing || card.isFlipped || card.isMatched) return;

        card.flip();

        if (!this.firstCard) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.isProcessing = true;
            this.checkPairMatch();
        }
    }

    checkPairMatch() {
        const isMatch = this.firstCard.faceId === this.secondCard.faceId;

        if (isMatch) {
            this.sound.play('success_sound', { volume: 0.7 });
            this.firstCard.setMatched();
            this.secondCard.setMatched();
            this.addScore(100);
            this.matchedPairs++;

            this.firstCard = null;
            this.secondCard = null;
            this.isProcessing = false;

            if (this.matchedPairs >= this.totalPairs) {
                this.handleLevelWin();
            }
        } else {
            this.sound.play('lose_sound', { volume: 1.0 });
            this.attempts--;
            this.subtractScore(25);
            this.updateUI();

            if (this.attempts <= 0) {
                this.handleLevelFailed('¡Sin intentos restantes!')
            } else {
                this.time.delayedCall(800, () => {
                    if (this.firstCard) this.firstCard.flip();
                    if (this.secondCard) this.secondCard.flip();
                    this.firstCard = null;
                    this.secondCard = null;
                    this.isProcessing = false;
                });
            }
        }

    }

    addScore(points) {
        this.score += points;
        this.scoreText.setText(`${this.score}`);
    }

    subtractScore(points) {
        this.score = Math.max(0, this.score - points);
        this.scoreText.setText(`${this.score}`);
    }

    handleLevelWin() {
        if (this.levelTimer) this.levelTimer.remove();
        this.board.setInteraction(false);

        if (this.input) {
            this.input.setDefaultCursor('default');
        }
        if (this.game.canvas) {
            this.game.canvas.style.cursor = 'default';
        }

        if (this.levelManager.currentLevel >= 13) {
            if (this.bgMusic && this.bgMusic.isPlaying) {
                this.bgMusic.stop();
            }
            this.sound.play('victory_sound', { volume: 0.9 });
            this.statusText.setText('¡HAS COMPLETADO LOS 13 NIVELES!');
            this.showVictoryModal();
        } else {
            this.statusText.setText('¡Nivel superado! Presiona el botón de "SIGUIENTE NIVEL" para continuar.');
            this.showNextLevelButton();
        }
    }

    handleLevelFailed(reason) {
        if (this.levelTimer) this.levelTimer.remove();
        this.board.setInteraction(false);
        this.statusText.setText(`${reason}\nReiniciando nivel...`);

        this.sound.play('game_over_sound', { volume: 0.8 });

        this.time.delayedCall(2000, () => {
            this.startLevel();
        });
    }

    restartCurrentLevel() {
        if (this.levelTimer) this.levelTimer.remove();
        if (this.memorizeTimer) this.memorizeTimer.remove();

        this.hideNextLevelButton();
        this.startLevel();
    }

    showNextLevelButton() {
        this.btnNextLevel.setVisible(true).setInteractive({ useHandCursor: true });
        this.btnNextLevelText.setVisible(true);

        this.tweens.add({
            targets: [this.btnNextLevel, this.btnNextLevelText],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 250,
            yoyo: true,
            repeat: 1
        });
    }

    hideNextLevelButton() {
        this.btnNextLevel.setVisible(false).disableInteractive();
        this.btnNextLevelText.setVisible(false);
    }

    onNextLevelClicked() {
        this.hideNextLevelButton();
        const hasNext = this.levelManager.nextLevel();
        if (hasNext) {
            this.startLevel();
        }
    }

    fullRestart() {
        if (this.levelTimer) this.levelTimer.remove();
        if (this.memorizeTimer) this.memorizeTimer.remove();

        if (this.bgMusic && !this.bgMusic.isPlaying && !this.isMuted) {
            this.bgMusic.play();
        }

        this.score = 0;
        this.levelManager.reset();
        this.startLevel();
    }

    updateUI() {
        this.levelText.setText(`${this.levelManager.currentLevel} / 13`);
        this.attemptsText.setText(`${this.attempts}`);
        this.timeText.setText(this.formatTime(this.timeRemaining));
        this.scoreText.setText(`${this.score}`);
    }

    formatTime(totalSenconds) {
        const seconds = Math.max(0, totalSenconds);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    showVictoryModal() {
        const overlay = this.add.rectangle(768, 400, 1536, 800, 0x000000, 0.7);
        const box = this.add.rectangle(768, 400, 600, 300, 0x1E1B1B).setStrokeStyle(4, 0xC88A36);

        this.add.text(768, 330, '¡FELICITACIONES!', {
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);

        this.add.text(768, 380, `Has superado los 13 niveles con un total de: \n${this.score} puntos`, {
            fontSize: '20px',
            color: '#FFFFFF',
            aling: 'center'
        }).setOrigin(0.5);

        const btnPlayAgain = this.add.rectangle(768, 460, 200, 45, 0x8C4A32).setInteractive({ useHandCursor: true });
        this.add.text(768, 460, 'JUGAR DE NUEVO', {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            aling: 'center'
        }).setOrigin(0.5);

        btnPlayAgain.on('pointerdown', () => {
            overlay.destroy();
            box.destroy();
            this.fullRestart();
        });
    }
}