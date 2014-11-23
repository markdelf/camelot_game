function Turn(opts) {}

Turn.prototype = {
    move: null,
    player: null,
    hasMoved: false,
    hasCantered: false,
    hasJumped: false,
    unit: null,
    startTile: null,
    setPlayer: function(player) {
        this.player = player;
        if (player.colour == "white") {
            $(".white-player").removeClass("secondary-player").addClass("main-player");
            $(".black-player").removeClass("main-player").addClass("secondary-player");
        } else {
            $(".white-player").removeClass("main-player").addClass("secondary-player");
            $(".black-player").removeClass("secondary-player").addClass("main-player");
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
        return (this.move && this.move.indexOf(tile.id) >= 0);
    },
    addCanter: function(toTile, unit) {
        if (!this.checkCanter(toTile, unit)) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.hasCantered = true;
        this.move += '-' + toTile.id;
        this.unit = unit;
        return this;
    },
    checkCanter: function(toTile, unit) {
        if (this.checkInvalidUnit(unit)) {
            return false;
        }
        if (this.hasVisited(toTile)) {
            return false;
        }
        if (this.hasJumped) {
            return false;
        }
        if (this.hasMoved && !this.hasCantered) {
            return false;
        }
        return true;
    },
    addJump: function(toTile, unit) {
        if (!this.checkJump(toTile, unit)) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.hasJumped = true;
        this.move += 'x' + toTile.id;
        this.unit = unit;
        return this;
    },
    checkJump: function(toTile, unit) {
        if (this.checkInvalidUnit(unit)) {
            return false;
        }
        if (this.hasVisited(toTile)) {
            return false;
        }
        if (this.hasMoved && !this.hasCantered && !this.hasJumped) {
            //to add logic if is knight
            return false;
        }
        return true;
    },
    addMove: function(toTile, unit) {
        if (!this.checkMove(toTile, unit)) {
            this.illegalMove();
        }
        this.hasMoved = true;
        this.move += '-' + toTile.id;
        this.unit = unit;
        return this;
    },
    checkMove: function(toTile, unit) {
        if (this.checkInvalidUnit(unit)) {
            return false;
        }
        if (this.hasVisited(toTile)) {
            return false;
        }
        if (this.hasMoved) {
            return false;
        }
        return true;
    },
    checkInvalidUnit: function(unit) {
        //probably should have some id to check as below does not seem to be working.
        return (this.unit != null && this.unit == unit);
    },
    illegalMove: function() {
        throw "Illegal move";
    },
    getMove: function() {
        return this.move;
    }
}