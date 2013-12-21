function Board(game, opts){
	this.game = game;
	this.init();
}

Board.prototype = {
	size: {w: 12, h: 16},
	tiles: [],
	game: null,
	castleStructure: [2, 8, 10],
	el: null,
	selectedTile: null,
	init: function() {
		this.tiles = [];
		var hc = 1;
		var reverseCastle = this.castleStructure.slice(0).reverse();
		while (hc <= this.size.h) {
			var wc = 1;
			while(wc <= this.size.w) {
				var tile = new Tile({
					row: hc,
					col: wc,
					alternate: ((hc + wc) % 2 == 1),
					board: this
				});
				var fromLast = hc - this.size.h + 3;
				if(this.castleStructure[hc - 1]) {
					var blanksEachSide = (this.size.w - this.castleStructure[hc - 1]) / 2;
					if(wc <= blanksEachSide) {
						tile.active = false;
					} else if (wc > (this.size.w - blanksEachSide)) {
						tile.active = false;
					}
				} else if(fromLast > 0 && reverseCastle[fromLast -1]) {
					var blanksEachSide = (this.size.w - reverseCastle[(fromLast - 1)]) / 2;
					if(wc <= blanksEachSide) {
						tile.active = false;
					} else if (wc > (this.size.w - blanksEachSide)) {
						tile.active = false;
					}
				}
				if(wc == 1) {
					tile.first = true;
				}
				this.tiles.push(tile);
				wc++;
			}
			hc++;
		}
	},
	render: function() {
		if(this.el == null) {
			this.el = $("<div></div>").addClass("board");
			for (var t in this.tiles) {
				this.el.append(this.tiles[t].render());
			}
		}
		return this.el;
	},
	getTile: function(id) {
		for(var p in this.tiles) {
			if(this.tiles[p].id == id) {
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
		return this.getTile(nextId);
	},
	getTilesBetween: function(fromTile, toTile) {
		var fromRow = parseInt(fromTile.id.substr(1));
		var fromCol = parseInt(fromTile.id.charCodeAt(0) - 65);

		var toRow = parseInt(toTile.id.substr(1));
		var toCol = parseInt(toTile.id.charCodeAt(0) - 65);

		var interval = 1;
		var tilesBetween = [];

		if (fromCol == toCol) {
			if(fromRow > toRow) {
				interval *= -1;
			}
			var cursorTile = fromTile;
			while(cursorTile != toTile && cursorTile != null) {
				var tempTile = this.traverse(cursorTile, [0,interval]);
				if(tempTile != null && tempTile != toTile) {
					tilesBetween.push(tempTile);
				}
				cursorTile = tempTile;
			}
			// same column
		} else if (fromRow == toRow) {
			if(fromRow < toRow) {
				interval *= -1;
			}
			// same row
		} else {
			console.log("Tiles must be in same row or column");
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
		this.selectedTile = tile;
		if (!tile.isEmpty()) {
			for(var direction in this.game.rules.moves) {
				this.checkDirectionValidMoves(tile, this.game.rules.moves[direction], tile);
			}
		}
	},
	checkDirectionValidMoves: function(previousTile, vDirection, startTile, diverging, action) {
		var nextTile = this.traverse(previousTile, vDirection);
		var selectedUnit = this.selectedTile.getUnit();
		var canSwitch = ((!action || action == "canter") && this.game.rules.units[selectedUnit.type].chain);

		if(nextTile) {
			if(nextTile.isEmpty()) {
				if(previousTile != startTile && !previousTile.isEmpty()) {
					var trafficUnit = previousTile.getUnit();
					var isFriendly = trafficUnit.isFriendlyUnit(selectedUnit.player);
					if(action == "canter" && !isFriendly && !canSwitch) {
						return;
					} else if(action == "jump" && isFriendly) {
						return;
					}
					newAction = (isFriendly) ? "canter" : "jump";
					if(action && newAction != action && !canSwitch) {
						return false;
					} else {
						console.log(newAction);
						action = newAction;
					}
				}
				if(previousTile == startTile) {
					if (!diverging) {
						nextTile.showValidMove();
					}
					return;
				} else if(!previousTile.isEmpty()) {
					if(diverging) {
						nextTile.showDivergingMove();
					} else {
						nextTile.showValidMove();
					}
					this.checkDivergingMoves(nextTile, vDirection, action);
				} else {
					return;
				}
			} else if(previousTile != startTile && !previousTile.isEmpty()) {
				return;
			}
			this.checkDirectionValidMoves(nextTile, vDirection, startTile, diverging, action);
		}
		return;
	},
	checkDivergingMoves: function(tile, sourceDirectionVector, action) {
		var oppositeDirection = [sourceDirectionVector[0] * -1, sourceDirectionVector[1] * -1];
		for(var direction in this.game.rules.moves) {
			var vDirection = this.game.rules.moves[direction];
			if (!arrayEqualTo(vDirection, oppositeDirection) && !arrayEqualTo(vDirection, sourceDirectionVector)) {
				this.checkDirectionValidMoves(tile, vDirection, tile, true, action);
			}
		}
	}
};

function arrayEqualTo(source, array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (source.length != array.length)
        return false;

    for (var i = 0, l=source.length; i < l; i++) {
        // Check if we have nested arrays
        if (source[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayEqualtTo(source, array[i]))
                return false;
        }
        else if (source[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}