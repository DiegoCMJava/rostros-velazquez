import Card from "./Card.js";

export default class Board {
    /**
     * @param {Phaser.Scene} scene
     * @param {Object} bounds
     */

    constructor(scene, bounds) {
        this.scene = scene;
        this.bounds = bounds;
        this.cards = [];
    }

    /**
     * @param {number} totalCards
     * @returns {{rows: number, cols: number }}
     */

    calculateGrid(totalCards) {
        const aspectRatio = this.bounds.width / this.bounds.height;
        let bestCols = Math.ceil(Math.sqrt(totalCards * aspectRatio));
        let bestRows = Math.ceil(totalCards / bestCols);

        while (bestCols * bestRows < totalCards) {
            bestCols++;
        }

        if (this.bounds.width > this.bounds.height && bestRows > bestCols) {
            const temp = bestRows;
            bestRows = bestCols;
            bestCols = temp;
        }

        return { rows: bestRows, cols: bestCols };
    }
    /**
     * @param { Array<number> } cardFaceIds
     * @param { Function } onCardClick
     */

    createBoard(cardFaceIds, onCardClick) {
        this.clearBoard();

        const totalCards = cardFaceIds.length;
        const { rows, cols } = this.calculateGrid(totalCards);

        const maxCardSize = totalCards <= 12 ? 150 : (totalCards <= 24 ? 130 : 110);
        const gap = totalCards > 24 ? 12 : 16;

        const avaliableWidth = this.bounds.width - 100;
        const avaliableHeight = this.bounds.height - 80;

        const maxCellW = (avaliableWidth - (gap * (cols - 1))) / cols;
        const maxCellH = (avaliableHeight - (gap * (rows - 1))) / rows;

        const cardSize = Math.floor(Math.min(maxCardSize, maxCellW, maxCellH));
        let cardWidth = cardSize;
        let cardHeight = cardSize;

        const gridWidth = (cols * cardWidth) + ((cols - 1) * gap);
        const gridHeight = (rows * cardHeight) + ((rows - 1) * gap);

        const startX = this.bounds.centerX - (gridWidth / 2) + (cardWidth / 2);
        const startY = this.bounds.centerY - (gridHeight / 2) + (cardHeight / 2);

        cardFaceIds.forEach((faceId, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = startX + (col * (cardWidth + gap));
            const y = startY + (row * (cardHeight + gap));

            const card = new Card(this.scene, x, y, faceId, cardWidth, cardHeight, onCardClick);
            this.cards.push(card);

        });
    }

    /**
 * @param {Function} [onComplete]
 */
    hideAllCards(onComplete) {
        let CompletedCount = 0;
        const flippedCards = this.cards.filter(c => c.isFlipped);

        if (flippedCards.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        flippedCards.forEach((card, index) => {
            this.scene.time.delayedCall(index * 25, () => {
                card.flip(() => {
                    CompletedCount++
                    if (CompletedCount === flippedCards.length && onComplete) {
                        onComplete();
                    }
                });
            });
        });

    }

    /** 
     * @param {boolean} enabled 
     */
    setInteraction(enabled) {
        this.cards.forEach(card => {
            if (!card.isMatched) {
                if (enabled) {
                    card.enableInteraction();
                } else {
                    card.disableInteraction();
                }
            }
        });

        if (!enabled && this.scene && this.scene.input) {
            this.scene.input.setDefaultCursor('default');
            if (this.scene.game.canvas) {
                this.scene.game.canvas.style.cursor = 'default';
            }
        }
    }

    clearBoard() {
        this.cards.forEach(card => {
            if (card.destroy) card.destroy();
        });
        this.cards = [];
    }
}