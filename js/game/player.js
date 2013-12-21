function Player(opts) {
	this.id = opts.id;
	this.name = opts.col;
	this.colour = opts.row;
	if(opts.side) {
		this.side = opts.side;
	}
	this.stock();
}

Player.prototype = {
	id: 0,
	name: 0,
	colour: 0,
	army: {pawn: 10, knight: 4},
	units: [],
	graveyard: [],
	side: 0,
	stock: function() {
		this.units = [];
		this.graveyard = [];
		for(var i = 0; i < this.army.pawn; i++) {
			var unit = new Unit({
				type: "pawn",
				player: this
			});
			this.units.push(unit);
		}

		for(var i = 0; i < this.army.knight; i++) {
			var unit = new Unit({
				type: "knight",
				player: this
			});
			this.units.push(unit);
		}
	},
	addToGraveyard: function(unit) {
		this.graveyard.push(unit);
	},
	render: function() {

	}
};