function Ui(game, opts) {
    this.game = game;
}

Ui.prototype = {
    game: null,
    endTurnButton: null,
    el: null,
    render: function() {
        var that = this;
        if (this.el == null) {
            this.el = $(".turn-manager-ui:first");
        }
        if (this.endTurnButton == null) {
            this.endTurnButton = $("#endTurn");
            this.endTurnButton.bind("click", function() {
                that.endTurnClicked();
            });
        }
        return this.el;
    },
    endTurnClicked: function() {
        this.game.changeTurn();
    }
}