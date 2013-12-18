function Game(opts){}

Game.prototype = {
	players: [],
	board: null,
	init: function() {
		this.board = new Board();
		this.board.init();
		$("#game-container").append(this.board.render());
	},
};