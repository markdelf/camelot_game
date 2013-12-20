function Game(opts){}

Game.prototype = {
	board: null,
	p1: null,
	p2: null,
	init: function() {
		this.board = new Board();
		this.board.init();
		$("#game-container").append(this.board.render());
		this.p1 = new Player({id: 1, name: "Test", colour: "white", side: 1});
		this.p2 = new Player({id: 2, name: "Test", colour: "white", side: 0});
		this.loadGame();
	},
	loadGame: function(state) {
		this.loadPlayerState(this.p1, state);
		this.loadPlayerState(this.p2, state);
	},
	loadPlayerState: function(player, state) {
		if (state == null) {
			var knightStart = this.getKnightStartPositions(player.side);
			var pawnStart = this.getPawnStartPositions(player.side);
			for(var p in player.units) {
				if(player.units[p].type == "knight") {
					knightStart.pop().addUnit(player.units[p]);
				} else {
					pawnStart.pop().addUnit(player.units[p]);
				}
			}
		}
	},
	render: function() {
		board.render();

	},
	getKnightStartPositions: function(side) {
		if (side == 1) {
			return [
				this.board.getTile("C11"),
				this.board.getTile("J11"),
				this.board.getTile("D10"),
				this.board.getTile("I10"),
			];
		} else {
			return [
				this.board.getTile("C6"),
				this.board.getTile("J6"),
				this.board.getTile("D7"),
				this.board.getTile("I7")
			];
		}
	},
	getPawnStartPositions: function(side) {
		var startPositions = new Array();

		var topLeft = null;
		var topRight = null;
		var botLeft = null;
		var botRight = null;
		if(side == 1) {
			topLeft = this.board.getTile("D11");
			topRight = this.board.getTile("I11");
			botLeft = this.board.getTile("E10");
			botRight = this.board.getTile("H10");
		} else {
			topLeft = this.board.getTile("D6");
			topRight = this.board.getTile("I6");
			botLeft = this.board.getTile("E7");
			botRight = this.board.getTile("H7");
		}
		

		var searchTile = topLeft;
		startPositions.push(searchTile);
		while (searchTile && searchTile.id != topRight.id) {
			var nextTile = this.board.traverse(searchTile, [1,0]);
			startPositions.push(nextTile);
			searchTile = nextTile;
		}

		var searchTile = botLeft;
		startPositions.push(searchTile);
		while (searchTile && searchTile.id != botRight.id) {
			var nextTile = this.board.traverse(searchTile, [1,0]);
			startPositions.push(nextTile);
			searchTile = nextTile;
		}

		return startPositions;
	},
};