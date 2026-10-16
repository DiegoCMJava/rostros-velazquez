export default class Card extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x 
     * @param {number} y 
     * @param {number} faceId
     * @param {number} width
     * @param {number} height
     * @param {Function} onClickCallback
     * @param {boolean} startsFaceUp
     */
    constructor(scene, x, y, faceId, width, height, onClickCallback, startsFaceUp = true) {
        super(scene, x, y);

        this.scene = scene;
        this.faceId = faceId;
        this.cardWidth = width;
        this.cardHeight = height;
        this.onClickCallback = onClickCallback;

        this.isFlipped = startsFaceUp;
        this.isMatched = false;
        this.isAnimating = false;

        if (this.scene.textures.exists('card_back')) {
            this.backSprite = this.scene.add.sprite(0, 0, 'card_back');
            this.backSprite.setDisplaySize(this.cardWidth, this.cardHeight);
        } else {
            this.backSprite = this.scene.add.container(0, 0);
            const bgRect = this.scene.add.rectangle(0, 0, this.cardWidth, this.cardHeight, 0x1E1B18);
            bgRect.setStrokeStyle(2.5, 0x8C4A32, 0.9);

            const innerBorder = this.scene.add.rectangle(0, 0, this.cardWidth - 10, this.cardHeight - 10);
            innerBorder.setStrokeStyle(1, 0xC88A36, 0.5);

            const iconBack = this.scene.add.text(0, 0, '╬', {
                fontSize: `${Math.floor(this.cardHeight * 0.25)}px`,
                color: '#C88A36'
            }).setOrigin(0.5);

            this.backSprite.add([bgRect, innerBorder, iconBack]);
        }

        this.frontBg = this.scene.add.rectangle(0, 0, this.cardWidth - 15, this.cardHeight - 15, 0x151311);
        this.frontBg.setStrokeStyle(2, 0xC88A36, 0.9);

        if (this.scene.textures.exists('faces_spritesheet')) {
            const frameIndex = Number(this.faceId);
            this.faceSprite = this.scene.add.sprite(0, 0, 'faces_spritesheet', frameIndex);
            this.faceSprite.setOrigin(0.5, 0.5);
            this.faceSprite.setDisplaySize(this.cardWidth * 0.88, this.cardHeight * 0.88);
        } else {
            this.faceSprite = this.scene.add.text(0, 0, `${this.faceId}`, {
                fontSize: `${Math.floor(this.cardHeight * 0.35)}px`,
                fontFamily: 'Playfair Display, serif',
                color: '#f2ca50',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        this.hitZone = this.scene.add.zone(0, 0, this.cardWidth, this.cardHeight)
            .setInteractive({ useHandCursor: true });

        this.add([this.frontBg, this.faceSprite, this.backSprite, this.hitZone]);

        this.backSprite.setVisible(!this.isFlipped);
        this.setFaceVisible(this.isFlipped);

        this.scene.add.existing(this);
        this.setSize(this.cardWidth, this.cardHeight);

        this.hitZone.on('pointerdown', this.handleClick, this);
        this.hitZone.on('pointerover', this.handlePointerOver, this);
        this.hitZone.on('pointerout', this.handlePointerOut, this);
    }

    setFaceVisible(visible) {
        if (this.frontBg) this.frontBg.setVisible(visible);
        if (this.faceSprite) this.faceSprite.setVisible(visible);
    }

    handleClick() {
        if (this.isFlipped || this.isMatched || this.isAnimating) return;
        if (this.onClickCallback) this.onClickCallback(this);
    }

    /**
     * @param {Function} [onComplete]
     */
    flip(onComplete) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            duration: 140,
            ease: 'Sine.easeIn',
            onComplete: () => {
                this.isFlipped = !this.isFlipped;
                this.backSprite.setVisible(!this.isFlipped);
                this.setFaceVisible(this.isFlipped);

                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    duration: 140,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.isAnimating = false;
                        if (onComplete) onComplete();
                    }
                });
            }
        });
    }

    handlePointerOver() {
        if (!this.isFlipped && !this.isMatched && !this.isAnimating) {
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.06,
                scaleY: 1.06,
                duration: 120,
                ease: 'Sine.easeOut'
            });
        }
    }

    handlePointerOut() {
        if (!this.isAnimating) {
            this.scene.tweens.add({
                targets: this,
                scaleY: 1,
                scaleX: 1,
                duration: 120,
                ease: 'Sine.easeOut'
            });
        }
    }

    enableInteraction() {
        if (this.isMatched || !this.hitZone) return;
        if (this.hitZone.input) {
            this.hitZone.input.enabled = true;
        } else {
            this.hitZone.setInteractive({ useHandCursor: true });
        }
    }

    disableInteraction() {
        if (this.hitZone && this.hitZone.input) {
            this.hitZone.input.enabled = false;
        }
    }

    setMatched() {
        this.isMatched = true;

        if (this, this.scene && this.scene.input) {
            this.scene.input.setDefaultCursor('default');
            if (this.scene.game.canvas) {
                this.scene.game.canvas.style.cursor = 'default';
            }
        }

        this.disableInteraction();

        this.scene.tweens.add({
            targets: this,
            alpha: 0.55,
            scaleX: 0.96,
            scaleY: 0.96,
            duration: 350,
            ease: 'Quad.easeInOut'
        });
    }
}