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
			if(this.player.id == 1) {
				this.el.addClass("unit-" + this.type + "-white");
			} else {
				this.el.addClass("unit-" + this.type + "-black");
			}
		}
		return this.el;
	},
	isEnemyUnit: function(player) {
		return (this.player.id != player.id);
	},
	isFriendlyUnit: function(player) {
		return (this.player.id == player.id);	
	},
	render: function(context, x, y, tileSize) {
		context.moveTo(x, y);
		this.setFillStyle(context);
		context.lineWidth = 2;

		var tilePadding = 25;
		var shapeSize = tileSize - tilePadding;

		var nw = {x: x +  (tilePadding / 2), y: y + (tilePadding / 2)};
		if (!this.isKnight()) {
			//Pawn are squares
			context.fillRect(nw.x, nw.y, shapeSize, shapeSize);	
			context.strokeRect(nw.x, nw.y, shapeSize, shapeSize);	
		} else {
			//Knights are triangles
			context.moveTo(nw.x, nw.y + shapeSize);
			context.beginPath();
			context.lineTo(nw.x + shapeSize, nw.y + shapeSize);
			context.lineTo(nw.x + (shapeSize / 2), nw.y);
			context.lineTo(nw.x , nw.y + shapeSize);
			context.lineTo(nw.x + shapeSize + (context.lineWidth / 2), nw.y + shapeSize);
			context.fill();
			context.stroke();
		}
	},
	setFillStyle: function(context) {
		if (this.player.colour == "light") {
			context.fillStyle = "#95B376";
			context.strokeStyle = "#5B882D";
		} else {
			context.fillStyle = "#D48CD8";
			context.strokeStyle = "#AB0AB4";
		}
	},
	isKnight: function()
	{
		return this.type == "knight";
	},
	select: function()
	{
		
	}
};