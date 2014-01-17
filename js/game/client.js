function Client(opts){}

Client.prototype = {
	socket: null,
	serverUrl: "http://127.0.0.1:8080",
	connected: false,
	activeGame: null,
	statusBar: null,
	init: function() {
		this.showSettings();
	},
	connect: function() {
		this.getStatusBar()
			.addClass("offline")
			.html("Establishing connection..");
		var that = this;
		this.socket = io.connect(this.serverUrl);
		this.socket.on("connect", function(){ 
			that.onConnect();
		});
		this.socket.on("disconnect", function(){ 
			that.onDisconnect();
		});
		this.socket.on("join-game", function(data){
			that.onJoinGame(data);
		});
		this.socket.on("leave-game", function(data){
			that.onLeaveGame(data);
		});
	},
	onConnect: function() {
		this.connected = true;
		this.getStatusBar()
			.removeClass("offline")
			.html("Connected to game server.");
	},
	onDisconnect: function() {
		this.connected = false;
		this.getStatusBar()
			.addClass("offline")
			.html("Attempting to reconnect to game server..");
	},
	getStatusBar: function() {
		if (!this.statusBar) {
			this.statusBar = $("#status-bar");
		}
		return this.statusBar;
	},
	newGame: function() {
		this.socket.emit("new-game", {player: {name: this.getPlayerName()}});
	},
	onJoinGame: function(data) {
		this.activeGame = new Game();
		var board = new Board(this.activeGame);
		var rules = new Rules();
		this.activeGame.init(board, rules);
		this.getStatusBar()
			.html("Joined game.");
	},
	onLeaveGame: function() {
		this.activeGame.hide();
		this.activeGame = null;
		this.getStatusBar()
			.html("Games lobby.");
	},
	showSettings: function() {
		$("#playerSettings").modal();
		if (this.getPlayerName()) {
			$("#playerSettings").find("input[name='player.name']").val(this.getPlayerName());
		}
	},
	getPlayerName: function() {
		return localStorage.getItem("player.name");
	},
	saveSettings: function() {
		var fields = $("#playerSettings input, #playerSettings select, #playerSettings textarea");
		fields.each(function(){
			localStorage.setItem($(this).attr("name"), $(this).val());
		});	
		if (this.getPlayerName) {
			this.connect();
			$("#playerSettings").modal('hide');
		}
		return false;
	}
};