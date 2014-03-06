function Turn(opts){}

Turn.prototype = {
    move: null,
    player: null,
    hasMoved: false,
    hasCantered: false,
    hasJumped: false,
    startTile: null,
    setPlayer: function(player) {
        this.player = player;
        return this;
    },
    getPlayer: function() {
        return this.player;
    },
    setStartTile: function(startTile) {
        this.startTile = startTile;
        this.move = this.startTile.id;
        return this;
    },
    getStartTile: function() {
        return this.startTile;
    },
    addCanter: function(toTile) {
        if(this.hasJumped) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.hasCantered = true;
        this.move += '-' + toTile.id;
        return this;
    },
    addJump: function(toTile) {
        this.hasMoved = true;
        this.hasJumped = true;
        this.move += 'x' + toTile.id;
        return this;
    },
    addMove: function(toTile) {
        if(this.hasMoved) {
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