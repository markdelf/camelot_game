function Unit(opts){
	this.type = opts.type;
	this.player = opts.player;
	return this;
}

Unit.prototype = {
	type: null,
	player: null,
	alive: 1,
	selected: 0,
	el: null,
	getElement: function() {
		if (this.el == null) {
			this.el = $("<div></div>").addClass("unit unit-" + this.type);
		}
		return this.el;
	},
	isEnemyUnit: function(player) {
		return (this.player.id != player.id);
	},
	isFriendlyUnit: function(player) {
		return (this.player.id == player.id);	
	}
};