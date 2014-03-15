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
            this.el = $("<div></div>").attr("id", "ui-container");
        }
        if (this.endTurnButton == null) {
            this.endTurnButton = $("<button>End Turn</button>").attr("id", "endTurn").bind("click", function() {
                that.endTurnClicked();
            });
            this.el.append(this.endTurnButton);
        }
        return this.el;
    },
    endTurnClicked: function() {
        this.game.changeTurn();
    }
}