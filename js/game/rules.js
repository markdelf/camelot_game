function Rules(opts) {
}

Rules.prototype = {
	victoryConditions: ["kill-all", "capture-castle"],
	mustKill: true,
	castle: {
		canGetOutOfCastle: false,
		castleMove: true,
	},
	moves: {top: [0,1], bottom: [0,-1], left: [-1, 0], right: [1,0]},
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