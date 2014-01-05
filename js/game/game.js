function Game(opts){}

Game.prototype = {
	board: null,
	rules: null,
	el: null,
	players: {
		local: null,
		remote: null
	},
	turn: {
		counter: 0,
		player: null
	},
	init: function(board, rules) {
		var that = this;
		this.board = board;
		this.rules = rules;
		this.board.init();
		this.render();
		this.show();
		$(window).unbind('resize').bind('resize', function(){ 
			that.board.resize(); 
		});
		this.board.resize();
		this.players.local = new Player({id: 1, name: "Test", colour: "white", side: 1});
		this.players.remote = new Player({id: 2, name: "Test", colour: "white", side: 0});
		this.loadGame();
		this.changeTurn();
	},
	show: function() {
		this.el.show();
	},
	hide: function() {
		this.el.hide();
	},
	loadGame: function(state) {
		this.loadPlayerState(this.players.local, state);
		this.loadPlayerState(this.players.remote, state);
	},
	loadPlayerState: function(player, state) {
		if (state == null) {
			var knightStartTiles = this.getKnightStartPositions(player.side);
			var pawnStartTiles = this.getPawnStartPositions(player.side);
			for(var p in player.units) {
				if(player.units[p].type == "knight") {
					knightStartTiles.pop().addUnit(player.units[p]);
				} else {
					pawnStartTiles.pop().addUnit(player.units[p]);
				}
			}
		}
	},
	render: function() {
		if(!this.el) {
			this.el = $("#game-container");
			this.el.append(this.board.render());
		}
		return this.el;
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
	changeTurn: function() {
		this.turn.counter++;
		if(!this.turn.player){
			//TO DO add who starts game logic
			this.turn.player = this.players.local;
		} else if (this.turn.player.id == this.players.local.id) {
			this.turn.player = this.players.remote;
		} else {
			this.turn.player = this.players.local;
		}
		return this.turn;
	}
};