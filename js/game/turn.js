function Turn(opts) {}

Turn.prototype = {
    move: null,
    player: null,
    hasMoved: false,
    hasCantered: false,
    hasJumped: false,
    startTile: null,
    setPlayer: function(player) {
        this.player = player;
        if (player.colour == "light") {
            $(".light-player").removeClass("secondary-player").addClass("main-player");
            $(".dark-player").removeClass("main-player").addClass("secondary-player");
        } else {
            $(".light-player").removeClass("main-player").addClass("secondary-player");
            $(".dark-player").removeClass("secondary-player").addClass("main-player");
        }
        $(".player-name").html(player.name);
        return this;
    },
    getPlayer: function() {
        return this.player;
    },
    setStartTile: function(startTile) {
        if (!this.hasMoved) {
            this.startTile = startTile;
            this.move = this.startTile.id;
            return this;
        }
    },
    getStartTile: function() {
        return this.startTile;
    },
    hasVisited: function(tile) {
        return (this.move.indexOf(tile.id) >= 0);
    },
    addCanter: function(toTile) {
        if (this.hasVisited(toTile)) {
            this.illegalMove();
        }
        if (this.hasJumped) {
            this.illegalMove();
        }
        if (this.hasMoved && !this.hasCantered) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.hasCantered = true;
        this.move += '-' + toTile.id;
        return this;
    },
    addJump: function(toTile) {
        if (this.hasVisited(toTile)) {
            this.illegalMove();
        }
        if (this.hasMoved && !this.hasCantered && !this.hasJumped) {
            //to add logic if is knight
            this.illegalMove();
        }
        this.hasMoved = true;
        this.hasJumped = true;
        this.move += 'x' + toTile.id;
        return this;
    },
    addMove: function(toTile) {
        if (this.hasVisited(toTile)) {
            this.illegalMove();
        }
        if (this.hasMoved) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.move += '-' + toTile.id;
        return this;
    },
    illegalMove: function() {
        throw "Illegal move";
    },
    getMove: function() {
        return this.move;
    }
}