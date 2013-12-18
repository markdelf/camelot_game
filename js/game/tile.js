function Tile(opts) {
	this.col = opts.col;
	this.row = opts.row;
	this.board = opts.board,
	this.id = String.fromCharCode(65 + (this.col - 1)) + (opts.board.size.h - this.row + 1);
	this.alternate = opts.alternate;
}

Tile.prototype = {
	col: 0,
	row: 0,
	id: null,
	board: null,
	active: true,
	alternate: false,
	first: false,
	el: null,
	render: function() {
		var tile = this;
		if (this.el == null) {
			this.el = $("<div></div>").addClass("tile").attr("id", "tile_" + this.id);
			if(this.alternate) {
				this.el.addClass("alternate");
			}
			if (!this.active) {
				this.el.addClass("outlier");
			}
			if(this.first) {
				this.el.addClass("first");
			}
		}
		this.el.data("tile", this);
		this.el.click(function() {
			tile.board.clearSelected();
			tile.select();
		});
		return this.el;
	},
	select: function() {
		this.el.addClass('selected');
	},
	unselect: function() {
		this.el.removeClass('selected');
	}
};