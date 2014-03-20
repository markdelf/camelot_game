function TurnManager(opts) {}

TurnManager.prototype = {
    turns: [],
    currentTurn: null,
    turnCounter: 1,
    roundCounter: 1,
    isFirstTurn: function() {
        return this.turnCounter <= 1;
    },
    nextTurn: function() {
        if (this.currentTurn) {
            //submit data from currentTurn
            this.turns.push(this.currentTurn);
        }
        this.turnCounter++;
        this.roundCounter = Math.floor(this.turnCounter / 2);
        var that = this;
        $(".round-number").each(function() {
            $(this).html(that.roundCounter);
        });
        this.currentTurn = new Turn();
    },
    getCurrentTurn: function() {
        return this.currentTurn;
    }
}