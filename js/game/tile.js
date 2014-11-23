function Tile(opts) {
    this.board = opts.board,
    this.alternate = opts.alternate;

    this.id = String.fromCharCode(65 + (parseInt(opts.col) - 1)) + (this.board.size.h - parseInt(opts.row) + 1);
}

Tile.prototype = {
    id: null,
    board: null,
    active: true,
    alternate: false,
    first: false,
    el: null,
    overlay: null,
    unit: null,
    render: function() {
        var tile = this;
        if (this.el == null) {
            this.el = $("<div></div>").addClass("tile").attr("id", "tile_" + this.id);
            this.overlay = $("<div></div>").addClass("tile-overlay").appendTo(this.el);
            if (this.alternate) {
                this.el.addClass("alternate");
            }
            if (!this.active) {
                this.el.addClass("outlier");
            }
            if (this.first) {
                this.el.addClass("first");
            }
            this.el.data("tile", this);
            this.el.click(function(event) {
                if (tile.board.selectedTile &&
                    tile.board.selectedTile.getUnit() &&
                    tile.isValidMove()) {
                    tile.makeMove();
                } else {
                    if (tile.board.selectedTile != tile) {
                        tile.board.clearSelected();
                        tile.select();
                    } else {
                        tile.board.clearSelected();
                    }
                }
            });
        }
        return this.el;
    },
    makeMove: function() {
        var unit = this.board.selectedTile.removeUnit();
        try {
            var tilesBetween = this.board.getTilesBetween(this.board.selectedTile, this);
            this.board.game.turnManager.currentTurn.setStartTile(this.board.selectedTile);
            if (tilesBetween.length == 0) {
                this.board.game.turnManager.currentTurn.addMove(this);
            } else {
                for (var p in tilesBetween) {
                    var tile = tilesBetween[p];
                    if (!tile.isEmpty() && tile.getUnit().isEnemyUnit(unit.player)) {
                        this.board.game.turnManager.currentTurn.addJump(this);
                        var deadUnit = tile.removeUnit();
                        deadUnit.player.addToGraveyard(deadUnit);
                    } else {
                        this.board.game.turnManager.currentTurn.addCanter(this);
                    }
                }
            }
            this.addUnit(unit);
            this.board.clearSelected();
            this.select();
        } catch (ex) {
            this.board.selectedTile.addUnit(unit);
        }
    },
    addUnit: function(unit) {
        if (this.unit == null) {
            this.unit = unit;
            this.el.append(this.unit.getElement());
        }
    },
    removeUnit: function() {
        if (this.unit != null) {
            var unit = this.unit;
            unit.el.remove();
            this.unit = null;
            return unit;
        }
    },
    isEmpty: function() {
        return (this.unit == null);
    },
    getUnit: function() {
        return this.unit;
    },
    select: function() {
        if (this.isEmpty() || this.isOutlier() || !this.board.game.turnManager.getCurrentTurn().getPlayer().isLocal) {
            this.board.clearSelected();
        } else {
            if (!this.getUnit().isEnemyUnit(this.board.game.turnManager.getCurrentTurn().getPlayer())) {
                this.board.onTileSelect(this);
            }
        }
        return this;
    },
    unselect: function() {
        this.el.removeClass('selected');
        return this;
    },
    showValidMove: function() {
        if (this.isDivergingMove()) {
            this.hideDivergingMove();
        }
        this.el.addClass('valid-move');
        return this;
    },
    isValidMove: function() {
        return this.el.hasClass("valid-move");
    },
    hideValidMove: function() {
        this.el.removeClass('valid-move');
        return this;
    },
    showDivergingMove: function() {
        if (!this.isValidMove()) {
            this.el.addClass("valid-move-diverging");
        }
        return this;
    },
    isDivergingMove: function() {
        return this.el.hasClass("valid-move-diverging");
    },
    hideDivergingMove: function() {
        this.el.removeClass('valid-move-diverging');
        return this;
    },
    isOutlier: function() {
        return this.el.hasClass("outlier");
    }
};