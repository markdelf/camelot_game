function Player(opts) {
    this.id = opts.id;
    this.name = opts.name;
    this.isLocal = opts.isLocal;
    this.colour = opts.colour;
    if (opts.side) {
        this.side = opts.side;
    }
    this.stock();
}

Player.prototype = {
    id: 0,
    name: 0,
    colour: 0,
    isLocal: true,
    army: {
        pawn: 10,
        knight: 4
    },
    armySize: 100,
    units: [],
    graveyard: [],
    side: 0,
    stock: function() {
        this.units = [];
        this.graveyard = [];
        for (var i = 0; i < this.army.pawn; i++) {
            var unit = new Unit({
                type: "pawn",
                player: this
            });
            this.units.push(unit);
        }

        for (var i = 0; i < this.army.knight; i++) {
            var unit = new Unit({
                type: "knight",
                player: this
            });
            this.units.push(unit);
        }
    },
    addToGraveyard: function(unit) {
        if (unit.type == "knight") {
            this.armySize -= 10;
        } else {
            this.armySize -= 6;
        }
        $(".p" + this.id + "-army-size").html(this.armySize);
        this.graveyard.push(unit);
    },
    render: function() {

    }
};