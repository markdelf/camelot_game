function TurnManager(opts) {}

TurnManager.prototype = {
    turns: [],
    currentTurn: null,
    turnCounter: 0,
    isFirstTurn: function() {
        return this.turnCounter <= 0;
    },
    nextTurn: function() {
        if (this.currentTurn) {
            //submit data from currentTurn
            this.turns.push(this.currentTurn);
        }
        this.turnCounter++;
        this.currentTurn = new Turn();
    },
    getCurrentTurn: function() {
        return this.currentTurn;
    }
}