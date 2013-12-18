function Board(opts){}

Board.prototype = {
	size: {w: 12, h: 16},
	tiles: [],
	pieces: [],
	castleStructure: [2, 8, 10],
	el: null,
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
	clearSelected: function() {
		this.el.find(".selected").removeClass("selected");
	}
};