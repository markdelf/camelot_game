function Tile(opts) {
	this.board = opts.board,
	this.alternate = opts.alternate;

	this.id = String.fromCharCode(65 + (parseInt(opts.col) - 1)) 
		+ (this.board.size.h - parseInt(opts.row) + 1);
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
			if(this.alternate) {
				this.el.addClass("alternate");
			}
			if (!this.active) {
				this.el.addClass("outlier");
			}
			if(this.first) {
				this.el.addClass("first");
			}
			this.el.data("tile", this);
			this.el.click(function() {
				if(tile.board.selectedTile && 
					tile.board.selectedTile.getUnit() && 
					tile.isValidMove()) {
					var unit = tile.board.selectedTile.removeUnit();
					tile.addUnit(unit);
					tile.board.clearSelected();
					tile.select();
				} else {
					if(tile.board.selectedTile != tile) {
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
	addUnit: function(unit) {
		if(this.unit == null) {
			this.unit = unit;
			this.el.append(this.unit.getElement());
		}
	},
	removeUnit: function() {
		if(this.unit != null) {
			var unit = this.unit;
			unit.el.remove();
			this.unit = null;
			return unit;
		}
	},
	isEmpty: function(){
		return (this.unit == null);
	},
	getUnit: function() {
		return this.unit;
	},
	select: function() {
		this.el.addClass('selected');
		this.board.onTileSelect(this);
	},
	unselect: function() {
		this.el.removeClass('selected');
	},
	showValidMove: function() {
		this.el.addClass('valid-move');
	},
	isValidMove: function() {
		return this.el.hasClass("valid-move");
	},
	hideValidMove: function() {
		this.el.removeClass('valid-move');	
	}
};