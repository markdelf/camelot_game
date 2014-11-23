function Board(game, opts) {
    this.game = game;
    this.init();
}

Board.prototype = {
    size: {
        w: 12,
        h: 16
    },
    tiles: [],
    game: null,
    castleStructure: [2, 8, 10],
    el: null,
    selectedTile: null,
    padding: 10,
    resize: function() {
        var window_w = $(window).width();
        var window_h = $(window).height();

        var tile_h = (window_h - this.padding) / this.size.h;
        var tile_w = (window_w - this.padding) / this.size.w;
        var tile_size = (tile_h > tile_w) ? tile_w : tile_h;
        $(".tile").each(function() {
            $(this).css("width", tile_size + "px");
            $(this).css("height", tile_size + "px");
        });
        this.el.css("width", ((tile_size * this.size.w) + this.padding) + "px");
    },
    init: function() {
        this.tiles = [];
        var hc = 1;
        var reverseCastle = this.castleStructure.slice(0).reverse();
        while (hc <= this.size.h) {
            var wc = 1;
            while (wc <= this.size.w) {
                var tile = new Tile({
                    row: hc,
                    col: wc,
                    alternate: ((hc + wc) % 2 == 1),
                    board: this
                });
                var fromLast = hc - this.size.h + 3;
                if (this.castleStructure[hc - 1]) {
                    var blanksEachSide = (this.size.w - this.castleStructure[hc - 1]) / 2;
                    if (wc <= blanksEachSide) {
                        tile.active = false;
                    } else if (wc > (this.size.w - blanksEachSide)) {
                        tile.active = false;
                    }
                } else if (fromLast > 0 && reverseCastle[fromLast - 1]) {
                    var blanksEachSide = (this.size.w - reverseCastle[(fromLast - 1)]) / 2;
                    if (wc <= blanksEachSide) {
                        tile.active = false;
                    } else if (wc > (this.size.w - blanksEachSide)) {
                        tile.active = false;
                    }
                }
                if (wc == 1) {
                    tile.first = true;
                }
                this.tiles.push(tile);
                wc++;
            }
            hc++;
        }
    },
    render: function() {
        var that = this;
        var that = this;
        if (this.el == null) {
            this.el = $("<div></div>").addClass("board");
            for (var t in this.tiles) {
                this.el.append(this.tiles[t].render());
            }
        }
        return this.el;
    },
    getTile: function(id) {
        for (var p in this.tiles) {
            if (this.tiles[p].id == id) {
                return this.tiles[p];
            }
        }
    },
    //traversal vector [x,y]
    traverse: function(fromTile, vector) {
        var newid = fromTile.id.charCodeAt(0) + parseInt(vector[0])
        var col = String.fromCharCode(newid);

        var row = parseInt(fromTile.id.substr(1)) + vector[1];
        var nextId = col.toString() + row.toString();
        var tile = this.getTile(nextId);
        if (tile && !tile.isOutlier()) {
            return tile;
        } else {
            return null;
        }
    },
    getTilesBetween: function(fromTile, toTile) {
        var fromRow = parseInt(fromTile.id.substr(1));
        var fromCol = parseInt(fromTile.id.charCodeAt(0) - 65);

        var toRow = parseInt(toTile.id.substr(1));
        var toCol = parseInt(toTile.id.charCodeAt(0) - 65);

        var interval = 1;
        var traversalVector;
        var tilesBetween = [];

        if (fromCol == toCol) {
            if (fromRow > toRow) {
                interval *= -1;
            }
            traversalVector = [0, interval];
        } else if (fromRow == toRow) {
            if (fromCol > toCol) {
                interval *= -1;
            }
            traversalVector = [interval, 0];
        } else {
            console.log("Tiles must be in same row or column");
            return tilesBetween;
        }
        var cursorTile = fromTile;
        while (cursorTile != toTile && cursorTile != null) {
            var tempTile = this.traverse(cursorTile, traversalVector);
            if (tempTile != null && tempTile != toTile) {
                tilesBetween.push(tempTile);
            }
            cursorTile = tempTile;
        }
        return tilesBetween;
    },
    clearSelected: function() {
        this.el.find(".selected").removeClass("selected");
        this.el.find(".valid-move").removeClass("valid-move");
        this.el.find(".valid-move-diverging").removeClass("valid-move-diverging");
        this.selectedTile = null;
    },
    onTileSelect: function(tile) {
        if (!tile.isEmpty()) {
            tile.el.addClass('selected');
            this.selectedTile = tile;
            var moveControl = new MoveControl({
                board: this,
                turn: this.game.turnManager.getCurrentTurn(),
                currentTile: this.selectedTile,
                currentUnit: this.selectedTile.getUnit(),
                highlight: true
            });
            moveControl.checkAllDirections();
        }
    },
    getOppositeDirection: function(vector) {
        return [vector[0] * -1, vector[1] * -1];
    }
};