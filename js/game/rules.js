function Rules(opts) {
}

Rules.prototype = {
	victoryConditions: ["kill-all", "capture-castle"],
	mustKill: true,
	castle: {
		canGetOutOfCastle: false,
		castleMove: true,
	},
	movementVectors: {left: [0,1], right: [0,-1], top: [-1, 0], bottom: [1,0]},
	units: {
		knight:
		{
			canter: true,
			jump: true,
			chain: true
		},
		pawn:
		{
			canter: true,
			jump: true,
			chain: false
		}
	}
};