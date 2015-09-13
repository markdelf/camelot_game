function Client(opts) {}

Client.prototype = {
    socket: null,
    serverUrl: "http://127.0.0.1:8080",
    connected: false,
    activeGame: null,
    ui: null,
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
        this.socket.on("connect", function() {
            that.onConnect();
        });
        this.socket.on("disconnect", function() {
            that.onDisconnect();
        });
        this.socket.on("joined_game", function(data) {
            that.onJoinGame(data);
        });
        this.socket.on("player_join", function(data) {
            that.onPlayerJoin(data);
        });
        this.socket.on("leave-game", function(data) {
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
    doJoinGame: function() {
        var data = {
            player: {
                name: this.getPlayerName()
            },
        };
        if (this.getGameCode()) {
            data.gameCode = this.getGameCode();
        }
        this.socket.emit("join-game", data);
    },
    onJoinGame: function(data) {
        var message = "Joined game: " + data.gameCode;
        if(data.opponent) {
            message += " with opponent " + data.opponent.name;
        }

        this.getStatusBar()
            .removeClass("offline")
            .html(message);
        /*this.activeGame = new Game();
        this.ui = new Ui(this.activeGame);
        var board = new Board(this.activeGame);
        var rules = new Rules();
        this.activeGame.init(board, rules);
        this.getStatusBar()
            .html("Joined game.");*/
    },
    onPlayerJoin: function(data) {
        var message = data.name + " has joined the game.";
        this.getStatusBar()
            .removeClass("offline")
            .html(message);
        /*this.activeGame = new Game();
        this.ui = new Ui(this.activeGame);
        var board = new Board(this.activeGame);
        var rules = new Rules();
        this.activeGame.init(board, rules);
        this.getStatusBar()
            .html("Joined game.");*/
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
    getGameCode: function() {
        return localStorage.getItem("game.code");
    },
    saveSettings: function() {
        var fields = $("#playerSettings input, #playerSettings select, #playerSettings textarea");
        fields.each(function() {
            localStorage.setItem($(this).attr("name"), $(this).val());
        });
        if (this.getPlayerName) {
            this.connect();
            $("#playerSettings").modal('hide');
        }
        this.doJoinGame();
        return false;
    }
};