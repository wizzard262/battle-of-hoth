/*
 * Battle of Hoth - game data
 *   moveArray / shootArray  how pieces move and shoot
 *   pieces                  every piece, with its stats (see Piece below)
 *   tilesInit1..6           the six maps
 */

//=== each pair is a possible move from the current position: i.e. [0,1] is (x+0) and (y+1)
var moveArray = [[-1, 0], [1, 0], [0, -1], [0, 1]];

//=== each list is the squares a piece can shoot, one list per direction: i.e. [0,1] is (x+0) and (y+1)
var shootArray = {
	one_linear: [
		[[0, 1]],
		[[0, -1]],
		[[1, 0]],
		[[-1, 0]]
	],
	two_linear: [
		[[0, 1], [0, 2]],
		[[0, -1], [0, -2]],
		[[1, 0], [2, 0]],
		[[-1, 0], [-2, 0]]
	],
	three_linear: [
		[[0, 1], [0, 2], [0, 3]],
		[[0, -1], [0, -2], [0, -3]],
		[[1, 0], [2, 0], [3, 0]],
		[[-1, 0], [-2, 0], [-3, 0]]
	],
	two_diaganol: [
		[[-1, -1], [-2, -2]],
		[[1, 1], [2, 2]],
		[[1, -1], [2, -2]],
		[[-1, 1], [-2, 2]]
	]
};

/*
 * A game piece.
 *   faction        'rebel' or 'empire'
 *   unit           'hero_army', 'army', 'vehicle', 'rider' or 'cannon' (used in sprite names)
 *   health         current health (also in the sprite name, e.g. rebel_army_right_4)
 *   direction      'up', 'right', 'down' or 'left': which way it faces
 *   shootsDiagonal riders (Tauntaun, AT-ST) shoot diagonally
 *   shootArray     squares it can shoot (from shootArray above)
 *   canForceHit    heroes (Luke, Darth Vader) can land a force hit: instant kill
 *   scale          sprite scale
 *   shootSound / explodeSound  sound names
 *   minifig        the minifig thrown out when it is hit
 *   shotRangeImage the shot pattern image shown in the info window
 *   initialHealth  full health
 */
function Piece(faction, unit, health, direction, shootPattern, shootsDiagonal, canForceHit, scale, shootSound, explodeSound, minifig) {
	return {
		faction: faction,
		unit: unit,
		health: health,
		direction: direction,
		shootsDiagonal: shootsDiagonal,
		shootArray: shootArray[shootPattern],
		canForceHit: canForceHit,
		scale: scale,
		shootSound: shootSound,
		explodeSound: explodeSound,
		minifig: minifig,
		shotRangeImage: shootPattern,
		initialHealth: health
	};
}

//                     faction   unit         health dir     shots           diagonal force  scale shoot sound                    explode sound         minifig thrown out
var pieces = {
	E_darth_army1: Piece('empire', 'hero_army', 3, 'left',  'one_linear',   false, true,  0.7, 'audioPieceShootArmy',         'audioPieceExplodeA', 'empire_army_down_1'),
	E_darth_army2: Piece('empire', 'hero_army', 3, 'left',  'one_linear',   false, true,  0.7, 'audioPieceShootArmy',         'audioPieceExplodeA', 'empire_army_down_1'),
	E_army1:       Piece('empire', 'army',      4, 'left',  'one_linear',   false, false, 0.7, 'audioPieceShootArmy',         'audioPieceExplodeA', 'empire_army_right_1'),
	E_army2:       Piece('empire', 'army',      4, 'left',  'one_linear',   false, false, 0.7, 'audioPieceShootArmy',         'audioPieceExplodeA', 'empire_army_right_1'),
	E_atat1:       Piece('empire', 'vehicle',   3, 'left',  'three_linear', false, false, 1,   'audioPieceShootAtAt',         'audioPieceExplodeA', 'empire_army_down_1'),
	E_atat2:       Piece('empire', 'vehicle',   3, 'left',  'three_linear', false, false, 1,   'audioPieceShootAtAt',         'audioPieceExplodeA', 'empire_army_down_1'),
	E_atst1:       Piece('empire', 'rider',     2, 'left',  'two_diaganol', true,  false, 1,   'audioPieceShootAtSt',         'audioPieceExplodeA', 'empire_rider_minifig'),
	E_atst2:       Piece('empire', 'rider',     2, 'left',  'two_diaganol', true,  false, 1,   'audioPieceShootAtSt',         'audioPieceExplodeA', 'empire_rider_minifig'),
	E_cannon1:     Piece('empire', 'cannon',    3, 'left',  'two_linear',   false, false, 1,   'audioPieceShootEmpireCannon', 'audioPieceExplodeA', 'empire_army_right_1'),
	E_cannon2:     Piece('empire', 'cannon',    3, 'left',  'two_linear',   false, false, 1,   'audioPieceShootEmpireCannon', 'audioPieceExplodeA', 'empire_army_right_1'),
	R_luke_army1:  Piece('rebel',  'hero_army', 3, 'right', 'one_linear',   false, true,  0.7, 'audioPieceShootArmy',         'audioPieceExplodeB', 'rebel_army_right_1'),
	R_luke_army2:  Piece('rebel',  'hero_army', 3, 'right', 'one_linear',   false, true,  0.7, 'audioPieceShootArmy',         'audioPieceExplodeB', 'rebel_army_right_1'),
	R_army1:       Piece('rebel',  'army',      4, 'right', 'one_linear',   false, false, 0.7, 'audioPieceShootArmy',         'audioPieceExplodeB', 'rebel_army_down_1'),
	R_army2:       Piece('rebel',  'army',      4, 'right', 'one_linear',   false, false, 0.7, 'audioPieceShootArmy',         'audioPieceExplodeB', 'rebel_army_down_1'),
	R_speeder1:    Piece('rebel',  'vehicle',   3, 'right', 'three_linear', false, false, 1,   'audioPieceShootSpeeder',      'audioPieceExplodeB', 'empire_army_left_1'),  //back of a stormtrooper for the speeder pilot
	R_speeder2:    Piece('rebel',  'vehicle',   3, 'right', 'three_linear', false, false, 1,   'audioPieceShootSpeeder',      'audioPieceExplodeB', 'empire_army_left_1'),
	R_tauntaun1:   Piece('rebel',  'rider',     2, 'right', 'two_diaganol', true,  false, 1,   'audioPieceShootTauntaun',     'audioPieceExplodeB', 'rebel_rider_minifig'),
	R_tauntaun2:   Piece('rebel',  'rider',     2, 'right', 'two_diaganol', true,  false, 1,   'audioPieceShootTauntaun',     'audioPieceExplodeB', 'rebel_rider_minifig'),
	R_cannon1:     Piece('rebel',  'cannon',    3, 'right', 'two_linear',   false, false, 1,   'audioPieceShootRebelCannon',  'audioPieceExplodeB', 'rebel_army_left_1'),
	R_cannon2:     Piece('rebel',  'cannon',    3, 'right', 'two_linear',   false, false, 1,   'audioPieceShootRebelCannon',  'audioPieceExplodeB', 'rebel_army_left_1')
};

/*
 * The maps. Each is a grid of tiles: tilesInitN[x][y] = [y, x, tileName, piece, baseFaction]
 *   tileName     board tile: 4 digits for bridges to the north, east, south, west (1 = bridge); '0000' = no square
 *   piece        the piece starting there, or null
 *   baseFaction  'rebel' / 'empire' if this square is part of that side's base, else null
 * (the first two numbers are not used by the game; CreateTiles in board.js turns these into tile objects)
 */
//========= map 1 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject, baseFaction]
var tilesInit1 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', pieces.R_army1, 'rebel'],
		[2, 1, '1110', pieces.R_tauntaun1, 'rebel'],
		[3, 0, '1010', pieces.R_luke_army1, 'rebel'],
		[4, 0, '1100', pieces.R_speeder1, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0000', null, null],
		[2, 2, '0101', null, null],
		[3, 1, '0111', null, null],
		[4, 1, '1110', null, null],
		[5, 0, '1001', null, null],
		[6, 0, '0000', null, null]
	],
	[
		[2, 3, '0000', null, null],
		[3, 2, '0111', null, null],
		[4, 2, '1101', null, null],
		[5, 1, '0011', null, null],
		[6, 1, '1100', null, null],
		[7, 0, '0000', null, null]
	],
	[
		[3, 3, '0000', null, null],
		[4, 3, '0111', null, null],
		[5, 2, '1011', null, null],
		[6, 2, '1110', null, null],
		[7, 1, '1101', null, null],
		[8, 1, '0000', null, null]
	],
	[[4, 4, '0000', null, null],
		[5, 3, '0011', null, null],
		[6, 3, '1100', null, null],
		[7, 2, '0111', null, null],
		[8, 2, '1101', null, null],
		[9, 1, '0000', null, null]
	],
	[
		[5, 4, '0000', null, null],
		[6, 4, '0110', null, null],
		[7, 3, '1011', null, null],
		[8, 3, '1101', null, null],
		[9, 2, '0101', null, null],
		[10, 2, '0000', null, null]
	],
	[
		[6, 5, '0000', null, null],
		[7, 4, '0011', pieces.E_atat1, 'empire'],
		[8, 4, '1010', pieces.E_darth_army1, 'empire'],
		[9, 3, '1011', pieces.E_atst1, 'empire'],
		[10, 3, '1001', pieces.E_army1, 'empire'],
		[11, 2, '0000', null, null]
	]
];
//========= map 2 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject]
var tilesInit2 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', pieces.R_tauntaun1, 'rebel'],
		[2, 1, '1110', pieces.R_army1, 'rebel'],
		[3, 0, '1010', pieces.R_luke_army1, 'rebel'],
		[4, 0, '1100', pieces.R_speeder1, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0000', null, null],
		[2, 2, '0101', null, null],
		[3, 1, '0011', null, null],
		[4, 1, '1110', null, null],
		[5, 0, '1101', null, null],
		[6, 0, '0000', null, null]
	],
	[
		[2, 3, '0110', null, null],
		[3, 2, '1011', null, null],
		[4, 2, '1110', null, null],
		[5, 1, '1101', null, null],
		[6, 1, '0011', null, null],
		[7, 0, '1100', null, null]
	],
	[
		[3, 3, '0011', null, null],
		[4, 3, '1100', null, null],
		[5, 2, '0111', null, null],
		[6, 2, '1011', null, null],
		[7, 1, '1110', null, null],
		[8, 1, '1001', null, null]
	],

	[
		[4, 4, '0000', null, null],
		[5, 3, '0111', null, null],
		[6, 3, '1011', null, null],
		[7, 2, '1100', null, null],
		[8, 2, '0101', null, null],
		[9, 1, '0000', null, null]
	],
	[
		[5, 4, '0000', null, null],
		[6, 4, '0011', pieces.E_atat1, 'empire'],
		[7, 3, '1010', pieces.E_darth_army1, 'empire'],
		[8, 3, '1011', pieces.E_army1, 'empire'],
		[9, 2, '1001', pieces.E_atst1, 'empire'],
		[10, 2, '0000', null, null]
	]
];
//========= map 3 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject]
var tilesInit3 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', pieces.R_army1, 'rebel'],
		[2, 1, '1110', pieces.R_tauntaun1, 'rebel'],
		[3, 0, '1110', pieces.R_luke_army1, 'rebel'],
		[4, 0, '1100', pieces.R_cannon1, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0110', null, null],
		[2, 2, '1001', null, null],
		[3, 1, '0111', null, null],
		[4, 1, '1101', null, null],
		[5, 0, '0011', null, null],
		[6, 0, '1100', null, null]
	],
	[
		[2, 3, '0111', null, null],
		[3, 2, '1010', null, null],
		[4, 2, '1111', null, null],
		[5, 1, '1111', null, null],
		[6, 1, '1010', null, null],
		[7, 0, '1101', null, null]
	],
	[
		[3, 3, '0101', null, null],
		[4, 3, '0000', null, null],
		[5, 2, '0111', null, null],
		[6, 2, '1101', null, null],
		[7, 1, '0000', null, null],
		[8, 1, '0101', null, null]
	],
	[
		[4, 4, '0111', null, null],
		[5, 3, '1010', null, null],
		[6, 3, '1111', null, null],
		[7, 2, '1111', null, null],
		[8, 2, '1010', null, null],
		[9, 1, '1101', null, null]
	],
	[
		[5, 4, '0011', null, null],
		[6, 4, '1100', null, null],
		[7, 3, '0111', null, null],
		[8, 3, '1101', null, null],
		[9, 2, '0110', null, null],
		[10, 2, '1001', null, null]
	],
	[
		[6, 5, '0000', null, null],
		[7, 4, '0011', pieces.E_cannon1, 'empire'],
		[8, 4, '1011', pieces.E_darth_army1, 'empire'],
		[9, 3, '1011', pieces.E_atst1, 'empire'],
		[10, 3, '1001', pieces.E_army1, 'empire'],
		[11, 2, '0000', null, null]
	]
];
//========= map 4 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject]
var tilesInit4 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', null, 'rebel'],
		[2, 1, '1110', pieces.R_tauntaun1, 'rebel'],
		[3, 0, '1110', pieces.R_luke_army1, 'rebel'],
		[4, 0, '1100', null, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0110', pieces.R_army1, null],
		[2, 2, '1001', null, null],
		[3, 1, '0111', null, null],
		[4, 1, '1101', null, null],
		[5, 0, '0011', null, null],
		[6, 0, '1100', pieces.R_army2, null]
	],
	[
		[2, 3, '0111', null, null],
		[3, 2, '1010', null, null],
		[4, 2, '1111', null, null],
		[5, 1, '1111', null, null],
		[6, 1, '1010', null, null],
		[7, 0, '1101', null, null]
	],
	[
		[3, 3, '0111', null, null],
		[4, 3, '1010', null, null],
		[5, 2, '1101', null, null],
		[6, 2, '0111', null, null],
		[7, 1, '1010', null, null],
		[8, 1, '1101', null, null]
	],
	[
		[4, 4, '0111', null, null],
		[5, 3, '1010', null, null],
		[6, 3, '1111', null, null],
		[7, 2, '1111', null, null],
		[8, 2, '1010', null, null],
		[9, 1, '1101', null, null]
	],
	[
		[5, 4, '0011', pieces.E_army1, null],
		[6, 4, '1100', null, null],
		[7, 3, '0111', null, null],
		[8, 3, '1101', null, null],
		[9, 2, '0110', null, null],
		[10, 2, '1001', pieces.E_army2, null]
	],
	[
		[6, 5, '0000', null, null],
		[7, 4, '0011', null, 'empire'],
		[8, 4, '1011', pieces.E_darth_army1, 'empire'],
		[9, 3, '1011', pieces.E_atst1, 'empire'],
		[10, 3, '1001', null, 'empire'],
		[11, 2, '0000', null, null]
	]
];
//========= map 5 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject]
var tilesInit5 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', pieces.R_army1, 'rebel'],
		[2, 1, '1100', pieces.R_speeder1, 'rebel'],
		[3, 0, '0110', pieces.R_speeder2, 'rebel'],
		[4, 0, '1100', pieces.R_army2, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0100', null, null],
		[2, 2, '0111', null, null],
		[3, 1, '1101', null, null],
		[4, 1, '0111', null, null],
		[5, 0, '1111', null, null],
		[6, 0, '1100', null, null]
	],
	[
		[2, 3, '0101', null, null],
		[3, 2, '0111', null, null],
		[4, 2, '1101', null, null],
		[5, 1, '0111', null, null],
		[6, 1, '1101', null, null],
		[7, 0, '0101', null, null]
	],
	[
		[3, 3, '0101', pieces.R_cannon1, null],
		[4, 3, '0111', null, null],
		[5, 2, '1101', null, null],
		[6, 2, '0111', null, null],
		[7, 1, '1101', null, null],
		[8, 1, '0101', pieces.E_cannon1, null]
	],
	[
		[4, 4, '0101', null, null],
		[5, 3, '0111', null, null],
		[6, 3, '1101', null, null],
		[7, 2, '0111', null, null],
		[8, 2, '1101', null, null],
		[9, 1, '0101', null, null]
	],
	[
		[5, 4, '0011', null, null],
		[6, 4, '1111', null, null],
		[7, 3, '1101', null, null],
		[8, 3, '0111', null, null],
		[9, 2, '1101', null, null],
		[10, 2, '0001', null, null]
	],
	[
		[6, 5, '0000', null, null],
		[7, 4, '0011', pieces.E_army2, 'empire'],
		[8, 4, '1001', pieces.E_atat1, 'empire'],
		[9, 3, '0011', pieces.E_atat2, 'empire'],
		[10, 3, '1001', pieces.E_army1, 'empire'],
		[11, 2, '0000', null, null]
	]
];
//========= map 6 ===================
//=== [y, x, backgroundTileName(N,E,S,W), pieceObject]
var tilesInit6 =
[
	[
		[0, 2, '0000', null, null],
		[1, 1, '0110', pieces.R_luke_army1, 'rebel'],
		[2, 1, '1110', pieces.R_tauntaun1, 'rebel'],
		[3, 0, '1110', pieces.R_luke_army2, 'rebel'],
		[4, 0, '1100', pieces.R_tauntaun2, 'rebel'],
		[5, -1, '0000', null, null]
	],
	[
		[1, 2, '0110', null, null],
		[2, 2, '1111', null, null],
		[3, 1, '1111', null, null],
		[4, 1, '1111', null, null],
		[5, 0, '1111', null, null],
		[6, 0, '1100', null, null]
	],
	[
		[2, 3, '0111', null, null],
		[3, 2, '1111', null, null],
		[4, 2, '1111', null, null],
		[5, 1, '1111', null, null],
		[6, 1, '1111', null, null],
		[7, 0, '1101', null, null]
	],
	[
		[3, 3, '0111', null, null],
		[4, 3, '1111', null, null],
		[5, 2, '1111', null, null],
		[6, 2, '1111', null, null],
		[7, 1, '1111', null, null],
		[8, 1, '1101', null, null]
	],
	[
		[4, 4, '0111', null, null],
		[5, 3, '1111', null, null],
		[6, 3, '1111', null, null],
		[7, 2, '1111', null, null],
		[8, 2, '1111', null, null],
		[9, 1, '1101', null, null]
	],
	[
		[5, 4, '0011', null, null],
		[6, 4, '1111', null, null],
		[7, 3, '1111', null, null],
		[8, 3, '1111', null, null],
		[9, 2, '1101', null, null],
		[10, 2, '1001', null, null]
	],
	[
		[6, 5, '0000', null, null],
		[7, 4, '0011', pieces.E_atst1, 'empire'],
		[8, 4, '1011', pieces.E_darth_army1, 'empire'],
		[9, 3, '1011', pieces.E_atst2, 'empire'],
		[10, 3, '1001', pieces.E_darth_army2, 'empire'],
		[11, 2, '0000', null, null]
	]
];

var MAPS = [tilesInit1, tilesInit2, tilesInit3, tilesInit4, tilesInit5, tilesInit6];

var shootOutcomes = [
	['missed'],
	['hit'],
	['force hit!']
];

var turnStatusInit = { currentTurnFaction: 'rebel', moveCounter: 1, victory: false, factionFlipBounce: false };
