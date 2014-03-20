function Rules(opts) {}

Rules.prototype = {
    victoryConditions: ["kill-all", "capture-castle"],
    castle: {
        canGetOutOfCastle: false,
        castleMove: true,
    },
    moves: { //config
        top: [0, 1],
        bottom: [0, -1],
        left: [-1, 0],
        right: [1, 0]
    },
    units: {
        knight: {
            canter: true,
            jump: true,
            chain: true,
            points: 10,
        },
        pawn: {
            canter: true,
            jump: true,
            chain: false,
            points: 6
        }
    }
};