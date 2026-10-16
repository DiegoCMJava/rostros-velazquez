export default class LevelManager {
    /***
     * @param {number} totalAvailableFaces
     */
    constructor(totalAvailableFaces = 30) {
        this.totalAvailableFaces = totalAvailableFaces;
        this.currentLevel = 1;
        this.maxLevel = 30;
    }

    /** 
     * @returns {boolean} 
     */
    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            return true;
        }
        return false;
    }

    reset() {
        this.currentLevel = 1;
    }

    getPairsCount(level = this.currentLevel) {
        return Math.min(level + 1, this.totalAvailableFaces);
    }

    getPreviewDuration(level = this.currentLevel) {
        const pairs = this.getPairsCount(level);
        return 2500 + (pairs * 500);
    }
    getTimeLimit(level = this.currentLevel) {
        const pairs = this.getPairsCount(level);
        return 15 + (pairs * 5);
    }

    getMaxAttempts(level = this.currentLevel) {
        const pairs = this.getPairsCount(level);
        return Math.ceil(pairs * 1.4) + 2;
    }

    /**
     * @return {Array<number>}
     */
    getCardsForCurrentLevel() {
        const pairsCount = this.getPairsCount(this.currentLevel);
        const availableIndexes = Array.from({ length: this.totalAvailableFaces }, (_, i) => i);

        this.shuffle(availableIndexes);

        const selectedFaces = availableIndexes.slice(0, pairsCount);
        const cardDeck = [...selectedFaces, ...selectedFaces];

        this.shuffle(cardDeck);

        return cardDeck;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}