function MoveControl(opts) {
    this.board = opts.board;
    this.turn = opts.turn;
    this.currentTile = opts.currentTile;
    this.currentUnit = opts.currentUnit;
    if (opts.highlight) {
        this.highlight = opts.highlight;
    }
}

MoveControl.prototype = {
    board: null,
    turn: null,
    currentTile: null,
    currentUnit: null,
    validMoveCount: 0,
    highlight: false,
    checkAction: function(action, toTile) {
        switch (action) {
            case "canter":
                return this.checkCanter(toTile);
                break;
            case "jump":
                return this.checkJump(toTile);
                break;
        }
        return this.checkMove(toTile);
    },
    checkCanter: function(toTile) {
        return this.turn.checkCanter(toTile, this.currentUnit);
    },
    checkJump: function(toTile) {
        return this.turn.checkJump(toTile, this.currentUnit);
    },
    checkMove: function(toTile) {
        return this.turn.checkMove(toTile, this.currentUnit);
    },
    checkAllDirections: function() {
        if (!this.currentTile.isEmpty()) {
            for (var direction in this.board.game.rules.moves) {
                this.checkDirectionValidMoves(
                    this.currentTile,
                    this.board.game.rules.moves[direction],
                    this.currentTile
                );
            }
        }
    },
    //checks all valid moves in this direction and triggers diverging checks
    checkDirectionValidMoves: function(previousTile, vDirection, startTile, diverging, action) {
        var nextTile = this.board.traverse(previousTile, vDirection);
        var canSwitch = ((!action || action == "canter") && this.board.game.rules.units[this.currentUnit.type].chain);

        if (nextTile) {
            if (nextTile.isEmpty()) {
                if (previousTile != startTile && !previousTile.isEmpty()) {
                    var trafficUnit = previousTile.getUnit();
                    var isFriendly = trafficUnit.isFriendlyUnit(this.currentUnit.player);
                    if (action == "canter" && !isFriendly && !canSwitch) {
                        return;
                    } else if (action == "jump" && isFriendly) {
                        return;
                    }
                    newAction = (isFriendly) ? "canter" : "jump";
                    if (action && newAction != action && !canSwitch) {
                        return false;
                    } else {
                        action = newAction;
                    }
                }
                if (previousTile == startTile) {
                    if (!diverging && this.checkAction(action, nextTile)) {
                        this.validMoveCount++;
                        if (this.highlight) {
                            nextTile.showValidMove();
                        }
                    }
                    return;
                } else if (!previousTile.isEmpty() && this.checkAction(action, nextTile)) {
                    if (diverging && this.highlight) {
                        nextTile.showDivergingMove();
                    } else if (this.highlight) {
                        nextTile.showValidMove();
                    }
                    this.validMoveCount++;
                    this.checkDivergingMoves(nextTile, vDirection, action);
                } else {
                    return;
                }
            } else if (previousTile != startTile && !previousTile.isEmpty()) {
                return;
            }
            this.checkDirectionValidMoves(nextTile, vDirection, startTile, diverging, action);
        }
        return;
    },
    checkDivergingMoves: function(tile, sourceDirectionVector, action) {
        var opposite = this.board.getOppositeDirection(sourceDirectionVector);
        for (var direction in this.board.game.rules.moves) {
            direction = this.board.game.rules.moves[direction];
            if (!arrayEqualTo(direction, opposite) && !arrayEqualTo(direction, sourceDirectionVector)) {
                this.checkDirectionValidMoves(tile, direction, tile, true, action);
            }
        }
    }
}