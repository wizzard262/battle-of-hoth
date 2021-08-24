//"use strict";

var moveIndicatorSprites;
var shootIndicatorSprites;
var selectedSprite;

var tiles;
var mapText; //stores the text 'level X of Y'

//=== dynamic global sprites
var fireAnimation;

var rebelBadge_1;
var rebelBadge_2;
var empireBadge_1;
var empireBadge_2;

var starfieldPiece;
var starfieldRange;
var starfieldWindow;
var starfieldHeart4;
var starfieldHeart3;
var starfieldHeart2;
var starfieldHeart1;

var audioPieceUp;
var audioPieceSlide;
var audioPieceShoot;
var audioWind;
var audioBattleOfHoth;
var audioRebelWin;
var audioEmpireWin;
var audioViperDroid;
var audioEchoBaseAmbient;
var audioTaunTaun;
var audioRebelForceAttack;
var audioEmpireForceAttack;
var audioXwingSquad;
var audioTieFighter;
var audioFactionFlipOne;
var audioFactionFlipTwo;

var soundHolderExplode;
var soundHolderShoot;

var snowEmitter;
var snowToggle = true;


var menu;
var instructions;
var showInstructionScreen = false;

//=== animation & ambient sound loop counters (microsecs: 60 per sec)
var snowUpdateInterval = 60;
var snowUpdateCounter = 0;
var windUpdateInterval = 60;
var windUpdateCounter = 0;
var viperDroidUpdateInterval = 1000;
var viperDroidUpdateCounter = 0;
var xwingSquadUpdateInterval = 100;
var xwingSquadUpdateCounter = 0;
var tieFighterUpdateInterval = 200;
var tieFighterUpdateCounter = 0;
var echoBaseAmbientUpdateInterval = 1500;
var echoBaseAmbientUpdateCounter = 0;
var taunTaunUpdateInterval = 1000;
var taunTaunUpdateCounter = 0;

var isoGroupBackground;   // for the background pieces (game board, goes at the back)
var isoGroupIndicators;   // move and attack indicators (to go under pieces)
var isoGroupPieces;       // actual game pieces (contains the red shoot indicator too
var isoGroupHotspots;
var cursorPos;
var cursor;
var isoBaseSize = 128;
var z = 0;
//var alphaTransparency = 0.4;
var turnStatus;



//==================== data =====================
//=== each pair shows possible move a piece can make from its current position: i.e. [0,1] is (x+0) and (y+1)
var moveArray = [[-1, 0], [1, 0], [0, -1], [0, 1]];

//=== each pair shows possible shot a piece can make from its current position: i.e. [0,1] is (x+0) and (y+1)
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

//=== [faction, unit, health, direction(initial, then changes), shootsDiagonal, shootArray, canForceHit, scale, shootSound, explodeSound, minifigToEjectWhenHit, shotRangeImage, initialHealth]
var pieces = {
	E_darth_army1: ['empire', 'hero_army', 3, 'left', false, shootArray.one_linear, true, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeA', 'empire_army_down_1', 'one_linear', 3],
	E_darth_army2: ['empire', 'hero_army', 3, 'left', false, shootArray.one_linear, true, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeA', 'empire_army_down_1', 'one_linear', 3],
	E_army1: ['empire', 'army', 4, 'left', false, shootArray.one_linear, false, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeA', 'empire_army_right_1', 'one_linear', 4],
	E_army2: ['empire', 'army', 4, 'left', false, shootArray.one_linear, false, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeA', 'empire_army_right_1', 'one_linear', 4],
	E_atat1: ['empire', 'vehicle', 3, 'left', false, shootArray.three_linear, false, 1, 'audioPieceShootAtAt', 'audioPieceExplodeA', 'empire_army_down_1', 'three_linear', 3],
	E_atat2: ['empire', 'vehicle', 3, 'left', false, shootArray.three_linear, false, 1, 'audioPieceShootAtAt', 'audioPieceExplodeA', 'empire_army_down_1', 'three_linear', 3],
	E_atst1: ['empire', 'rider', 2, 'left', true, shootArray.two_diaganol, false, 1, 'audioPieceShootAtSt', 'audioPieceExplodeA', 'empire_rider_minifig', 'two_diaganol', 2],
	E_atst2: ['empire', 'rider', 2, 'left', true, shootArray.two_diaganol, false, 1, 'audioPieceShootAtSt', 'audioPieceExplodeA', 'empire_rider_minifig', 'two_diaganol', 2],
	E_cannon1: ['empire', 'cannon', 3, 'left', false, shootArray.two_linear, false, 1, 'audioPieceShootEmpireCannon', 'audioPieceExplodeA', 'empire_army_right_1', 'two_linear', 3],
	E_cannon2: ['empire', 'cannon', 3, 'left', false, shootArray.two_linear, false, 1, 'audioPieceShootEmpireCannon', 'audioPieceExplodeA', 'empire_army_right_1', 'two_linear', 3],
	R_luke_army1: ['rebel', 'hero_army', 3, 'right', false, shootArray.one_linear, true, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeB', 'rebel_army_right_1', 'one_linear', 3],
	R_luke_army2: ['rebel', 'hero_army', 3, 'right', false, shootArray.one_linear, true, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeB', 'rebel_army_right_1', 'one_linear', 3],
	R_army1: ['rebel', 'army', 4, 'right', false, shootArray.one_linear, false, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeB', 'rebel_army_down_1', 'one_linear', 4],
	R_army2: ['rebel', 'army', 4, 'right', false, shootArray.one_linear, false, 0.7, 'audioPieceShootArmy', 'audioPieceExplodeB', 'rebel_army_down_1', 'one_linear', 4],
	R_speeder1: ['rebel', 'vehicle', 3, 'right', false, shootArray.three_linear, false, 1, 'audioPieceShootSpeeder', 'audioPieceExplodeB', 'empire_army_left_1', 'three_linear', 3],   //we can use back of stormtrooper for speeder pilot
	R_speeder2: ['rebel', 'vehicle', 3, 'right', false, shootArray.three_linear, false, 1, 'audioPieceShootSpeeder', 'audioPieceExplodeB', 'empire_army_left_1', 'three_linear', 3],   //we can use back of stormtrooper for speeder pilot
	R_tauntaun1: ['rebel', 'rider', 2, 'right', true, shootArray.two_diaganol, false, 1, 'audioPieceShootTauntaun', 'audioPieceExplodeB', 'rebel_rider_minifig', 'two_diaganol', 2],
	R_tauntaun2: ['rebel', 'rider', 2, 'right', true, shootArray.two_diaganol, false, 1, 'audioPieceShootTauntaun', 'audioPieceExplodeB', 'rebel_rider_minifig', 'two_diaganol', 2],
	R_cannon1: ['rebel', 'cannon', 3, 'right', false, shootArray.two_linear, false, 1, 'audioPieceShootRebelCannon', 'audioPieceExplodeB', 'rebel_army_left_1', 'two_linear', 3],
	R_cannon2: ['rebel', 'cannon', 3, 'right', false, shootArray.two_linear, false, 1, 'audioPieceShootRebelCannon', 'audioPieceExplodeB', 'rebel_army_left_1', 'two_linear', 3]
};
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

var shootOutcomes = [
	['missed'],
	['hit'],
	['force hit!']
];

var turnStatusInit = { currentTurnFaction: 'rebel', moveCounter: 1, victory: false, factionFlipBounce : false };

//==================================

var spriteAreas = {
	"frames": [
        //=== gameboard tiles (filename:north-east-south-west)
		{
			"filename": '0000',
			"frame": { "x": 0, "y": 128, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
	    //1000		
		{
			"filename": '0100',
			"frame": { "x": 512, "y": 1792, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '1100',
			"frame": { "x": 256, "y": 128, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
	    //0010
		{
			"filename": '1010',
			"frame": { "x": 256, "y": 896, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '0110',
			"frame": { "x": 0, "y": 256, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '1110',
			"frame": { "x": 256, "y": 640, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '0001',
			"frame": { "x": 512, "y": 1664, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '1001',
			"frame": { "x": 0, "y": 384, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '0101',
			"frame": { "x": 256, "y": 1024, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '1101',
			"frame": { "x": 256, "y": 384, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '0011',
			"frame": { "x": 256, "y": 256, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

		{
			"filename": '1011',
			"frame": { "x": 256, "y": 768, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '0111',
			"frame": { "x": 256, "y": 512, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": '1111',
			"frame": { "x": 512, "y": 1920, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
//==================================== lukes army
		{
			"filename": "rebel_hero_army_down_3",
			"frame": { "x": 384, "y": 1154, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_down_2",
			"frame": { "x": 384, "y": 1282, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_down_1",
			"frame": { "x": 384, "y": 1410, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_down_0",
			"frame": { "x": 384, "y": 1794, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_left_3",
			"frame": { "x": 384, "y": 1538, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_left_2",
			"frame": { "x": 384, "y": 1666, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_left_1",
			"frame": { "x": 384, "y": 1794, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_left_0",
			"frame": { "x": 384, "y": 1410, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_right_3",
			"frame": { "x": 384, "y": 1922, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_right_2",
			"frame": { "x": 384, "y": 2050, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_right_1",
			"frame": { "x": 384, "y": 2178, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_right_0",
			"frame": { "x": 384, "y": 2562, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_up_3",
			"frame": { "x": 384, "y": 2306, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_up_2",
			"frame": { "x": 384, "y": 2434, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_up_1",
			"frame": { "x": 384, "y": 2562, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_hero_army_up_0",
			"frame": { "x": 384, "y": 2178, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== rebel army
		{
			"filename": "rebel_army_down_4",
			"frame": { "x": 256, "y": 1152, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_down_3",
			"frame": { "x": 256, "y": 1280, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_down_2",
			"frame": { "x": 256, "y": 1408, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_down_1",
			"frame": { "x": 256, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_down_0",
			"frame": { "x": 256, "y": 2048, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_up_4",
			"frame": { "x": 256, "y": 1664, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_up_3",
			"frame": { "x": 256, "y": 1792, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_up_2",
			"frame": { "x": 256, "y": 1920, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_up_1",
			"frame": { "x": 256, "y": 2048, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_up_0",
			"frame": { "x": 256, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_right_4",
			"frame": { "x": 256, "y": 2176, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_right_3",
			"frame": { "x": 256, "y": 2304, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_right_2",
			"frame": { "x": 256, "y": 2432, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_right_1",
			"frame": { "x": 256, "y": 2560, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_right_0",
			"frame": { "x": 256, "y": 3072, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_left_4",
			"frame": { "x": 256, "y": 2688, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_left_3",
			"frame": { "x": 256, "y": 2816, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_left_2",
			"frame": { "x": 256, "y": 2944, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_left_1",
			"frame": { "x": 256, "y": 3072, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_army_left_0",
			"frame": { "x": 256, "y": 2560, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//====================================  darth vaders army
		{
			"filename": "empire_hero_army_down_3",
			"frame": { "x": 128, "y": 1154, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_down_2",
			"frame": { "x": 128, "y": 1282, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_down_1",
			"frame": { "x": 128, "y": 1410, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_down_0",
			"frame": { "x": 128, "y": 1794, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_left_3",
			"frame": { "x": 128, "y": 1538, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_left_2",
			"frame": { "x": 128, "y": 1666, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_left_1",
			"frame": { "x": 128, "y": 1794, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_left_0",
			"frame": { "x": 128, "y": 1410, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_right_3",
			"frame": { "x": 128, "y": 1922, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_right_2",
			"frame": { "x": 128, "y": 2050, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_right_1",
			"frame": { "x": 128, "y": 2178, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_right_0",
			"frame": { "x": 128, "y": 2562, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_up_3",
			"frame": { "x": 128, "y": 2306, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_up_2",
			"frame": { "x": 128, "y": 2434, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_up_1",
			"frame": { "x": 128, "y": 2562, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_hero_army_up_0",
			"frame": { "x": 128, "y": 2178, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== empire army
		{
			"filename": "empire_army_down_4",
			"frame": { "x": 0, "y": 1152, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_down_3",
			"frame": { "x": 0, "y": 1280, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_down_2",
			"frame": { "x": 0, "y": 1408, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_down_1",
			"frame": { "x": 0, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_down_0",
			"frame": { "x": 0, "y": 2048, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_up_4",
			"frame": { "x": 0, "y": 1664, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_up_3",
			"frame": { "x": 0, "y": 1792, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_up_2",
			"frame": { "x": 0, "y": 1920, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_up_1",
			"frame": { "x": 0, "y": 2048, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_up_0",
			"frame": { "x": 0, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_right_4",
			"frame": { "x": 0, "y": 2176, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_right_3",
			"frame": { "x": 0, "y": 2304, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_right_2",
			"frame": { "x": 0, "y": 2432, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_right_1",
			"frame": { "x": 0, "y": 2560, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_right_0",
			"frame": { "x": 0, "y": 3072, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_left_4",
			"frame": { "x": 0, "y": 2688, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_left_3",
			"frame": { "x": 0, "y": 2816, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_left_2",
			"frame": { "x": 0, "y": 2944, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_left_1",
			"frame": { "x": 0, "y": 3072, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_army_left_0",
			"frame": { "x": 0, "y": 2560, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== snowspeeder
		{
			"filename": "rebel_vehicle_right_3",
			"frame": { "x": 512, "y": 768, "w": 256, "h": 128 },
			"rotated": true,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_right_2",
			"frame": { "x": 512, "y": 896, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_right_1",
			"frame": { "x": 512, "y": 1024, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -15, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_right_0",
			"frame": { "x": 512, "y": 1536, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_left_3",
			"frame": { "x": 512, "y": 1152, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_left_2",
			"frame": { "x": 512, "y": 1280, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -20, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_left_1",
			"frame": { "x": 512, "y": 1408, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 10, "y": -15, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_left_0",
			"frame": { "x": 512, "y": 1536, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_down_3",
			"frame": { "x": 512, "y": 0, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_down_2",
			"frame": { "x": 512, "y": 128, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_down_1",
			"frame": { "x": 512, "y": 256, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -15, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_down_0",
			"frame": { "x": 512, "y": 1536, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_up_3",
			"frame": { "x": 512, "y": 384, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_up_2",
			"frame": { "x": 512, "y": 512, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -20, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_up_1",
			"frame": { "x": 512, "y": 640, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": -10, "y": -15, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_vehicle_up_0",
			"frame": { "x": 512, "y": 1536, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -30, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== rebel cannon
		{
			"filename": "rebel_cannon_right_3",
			"frame": { "x": 1344, "y": 768, "w": 128, "h": 128 },
			"rotated": true,
			"trimmed": true,
			"spriteSourceSize": { "x": 90, "y": -20, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_right_2",
			"frame": { "x": 1344, "y": 896, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 90, "y": -20, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_right_1",
			"frame": { "x": 1344, "y": 1024, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 90, "y": -20, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_right_0",
			"frame": { "x": 1344, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_left_3",
			"frame": { "x": 1344, "y": 1152, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_left_2",
			"frame": { "x": 1344, "y": 1280, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_left_1",
			"frame": { "x": 1344, "y": 1408, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_left_0",
			"frame": { "x": 1344, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_down_3",
			"frame": { "x": 1344, "y": 0, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 40, "y": -20, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_down_2",
			"frame": { "x": 1344, "y": 128, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 40, "y": -20, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_down_1",
			"frame": { "x": 1344, "y": 256, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 40, "y": -20, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_down_0",
			"frame": { "x": 1344, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_up_3",
			"frame": { "x": 1344, "y": 384, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_up_2",
			"frame": { "x": 1344, "y": 512, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_up_1",
			"frame": { "x": 1344, "y": 640, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_cannon_up_0",
			"frame": { "x": 1344, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== empire cannon
		{
			"filename": "empire_cannon_right_3",
			"frame": { "x": 1216, "y": 768, "w": 128, "h": 128 },
			"rotated": true,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_right_2",
			"frame": { "x": 1216, "y": 896, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_right_1",
			"frame": { "x": 1216, "y": 1024, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -20, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_right_0",
			"frame": { "x": 1216, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_left_3",
			"frame": { "x": 1216, "y": 1152, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_left_2",
			"frame": { "x": 1216, "y": 1280, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_left_1",
			"frame": { "x": 1216, "y": 1408, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -40, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_left_0",
			"frame": { "x": 1216, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_down_3",
			"frame": { "x": 1216, "y": 0, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_down_2",
			"frame": { "x": 1216, "y": 128, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_down_1",
			"frame": { "x": 1216, "y": 256, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_down_0",
			"frame": { "x": 1216, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_up_3",
			"frame": { "x": 1216, "y": 384, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -50, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_up_2",
			"frame": { "x": 1216, "y": 512, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -50, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_up_1",
			"frame": { "x": 1216, "y": 640, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 70, "y": -50, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_cannon_up_0",
			"frame": { "x": 1216, "y": 1536, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 60, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== at-at
		{
			"filename": "empire_vehicle_down_3",
			"frame": { "x": 1024, "y": 0, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_down_2",
			"frame": { "x": 1024, "y": 192, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_down_1",
			"frame": { "x": 1024, "y": 384, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_down_0",
			"frame": { "x": 1024, "y": 2304, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -50, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_up_3",
			"frame": { "x": 1024, "y": 576, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_up_2",
			"frame": { "x": 1024, "y": 768, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_up_1",
			"frame": { "x": 1024, "y": 960, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_up_0",
			"frame": { "x": 1024, "y": 2304, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -50, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_right_3",
			"frame": { "x": 1024, "y": 1152, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_right_2",
			"frame": { "x": 1024, "y": 1344, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 40, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_right_1",
			"frame": { "x": 1024, "y": 1536, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_right_0",
			"frame": { "x": 1024, "y": 2304, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -50, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_left_3",
			"frame": { "x": 1024, "y": 1728, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_left_2",
			"frame": { "x": 1024, "y": 1920, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_left_1",
			"frame": { "x": 1024, "y": 2112, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": -80, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_vehicle_left_0",
			"frame": { "x": 1024, "y": 2304, "w": 192, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 30, "y": -50, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== tauntaun
		{
			"filename": "rebel_rider_down_2",
			"frame": { "x": 768, "y": 0, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_down_1",
			"frame": { "x": 768, "y": 128, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_down_0",
			"frame": { "x": 768, "y": 1024, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -25, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_up_2",
			"frame": { "x": 768, "y": 256, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_up_1",
			"frame": { "x": 768, "y": 384, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_up_0",
			"frame": { "x": 768, "y": 1024, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -25, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_left_2",
			"frame": { "x": 768, "y": 512, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_left_1",
			"frame": { "x": 768, "y": 640, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_left_0",
			"frame": { "x": 768, "y": 1024, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -25, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_right_2",
			"frame": { "x": 768, "y": 768, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_right_1",
			"frame": { "x": 768, "y": 896, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -55, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_right_0",
			"frame": { "x": 768, "y": 1024, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 55, "y": -25, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},

//==================================== at-st		
		{
			"filename": "empire_rider_down_2",
			"frame": { "x": 896, "y": 0, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_down_1",
			"frame": { "x": 896, "y": 192, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_down_0",
			"frame": { "x": 896, "y": 1536, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": 0, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_up_2",
			"frame": { "x": 896, "y": 384, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_up_1",
			"frame": { "x": 896, "y": 576, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_up_0",
			"frame": { "x": 896, "y": 1536, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": 0, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_left_2",
			"frame": { "x": 896, "y": 768, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_left_1",
			"frame": { "x": 896, "y": 960, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_left_0",
			"frame": { "x": 896, "y": 1536, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": 0, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_right_2",
			"frame": { "x": 896, "y": 1152, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_right_1",
			"frame": { "x": 896, "y": 1344, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": -100, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_rider_right_0",
			"frame": { "x": 896, "y": 1536, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 50, "y": 0, "w": 256, "h": 256 },
			"sourceSize": { "w": 256, "h": 256 }
		},
//=========== extra minifigs ============================================================			
		{
			"filename": "empire_rider_minifig",
			"frame": { "x": 896, "y": 1728, "w": 128, "h": 192 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_rider_minifig",
			"frame": { "x": 768, "y": 1152, "w": 128, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 64, "y": -30, "w": 128, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
//=========================================================================================		
		{
			"filename": "blankTile",
			"frame": { "x": 0, "y": 128, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "rebel_shooter",
			"frame": { "x": 0, "y": 3200, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "empire_shooter",
			"frame": { "x": 256, "y": 3200, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "shootable_on",
			"frame": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "shootable_on_over",
			"frame": { "x": 0, "y": 128, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "shootable_off",
			"frame": { "x": 256, "y": 0, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		{
			"filename": "moveable_right",
			"frame": { "x": 0, "y": 512, "w": 256, "h": 128 },
			"rotated": false,
			"trimmed": true,
			"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
			"sourceSize": { "w": 256, "h": 256 }
		},
		 {
		 	"filename": "moveable_left",
		 	"frame": { "x": 0, "y": 640, "w": 256, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
		 	"sourceSize": { "w": 256, "h": 256 }
		 },
		  {
		  	"filename": "moveable_up",
		  	"frame": { "x": 0, "y": 768, "w": 256, "h": 128 },
		  	"rotated": false,
		  	"trimmed": true,
		  	"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
		  	"sourceSize": { "w": 256, "h": 256 }
		  },
		 {
		 	"filename": "moveable_down",
		 	"frame": { "x": 0, "y": 896, "w": 256, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 128 },
		 	"sourceSize": { "w": 256, "h": 256 }
		 },
		 {
		 	"filename": "shoot_left",
		 	"frame": { "x": 0, "y": 1024, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_up",
		 	"frame": { "x": 64, "y": 1024, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_down",
		 	"frame": { "x": 128, "y": 1024, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_right",
		 	"frame": { "x": 192, "y": 1024, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_left_rider",
		 	"frame": { "x": 128, "y": 1088, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_up_rider",
		 	"frame": { "x": 0, "y": 1088, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_down_rider",
		 	"frame": { "x": 192, "y": 1088, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "shoot_right_rider",
		 	"frame": { "x": 64, "y": 1088, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },

//============================= instruction manual images =====================================================		 
		 {
		 	"filename": "empire_vehicle",
		 	"frame": { "x": 512, "y": 2048, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "empire_cannon",
		 	"frame": { "x": 512, "y": 2240, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "empire_army",
		 	"frame": { "x": 512, "y": 2432, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "empire_hero_army",
		 	"frame": { "x": 512, "y": 2624, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "empire_rider",
		 	"frame": { "x": 512, "y": 2816, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "rebel_vehicle",
		 	"frame": { "x": 704, "y": 2048, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "rebel_cannon",
		 	"frame": { "x": 704, "y": 2240, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "rebel_army",
		 	"frame": { "x": 704, "y": 2432, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "rebel_hero_army",
		 	"frame": { "x": 704, "y": 2624, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "rebel_rider",
		 	"frame": { "x": 704, "y": 2816, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
//============================= target ranges =====================================================		 		 
		 {
		 	"filename": "three_linear",
		 	"frame": { "x": 768, "y": 1280, "w": 128, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 128, "h": 128 },
		 	"sourceSize": { "w": 128, "h": 128 }
		 },
		 {
		 	"filename": "two_linear",
		 	"frame": { "x": 768, "y": 1408, "w": 128, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 128, "h": 128 },
		 	"sourceSize": { "w": 128, "h": 128 }
		 },
		 {
		 	"filename": "one_linear",
		 	"frame": { "x": 768, "y": 1536, "w": 128, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 128, "h": 128 },
		 	"sourceSize": { "w": 128, "h": 128 }
		 },
		 {
		 	"filename": "two_diaganol",
		 	"frame": { "x": 768, "y": 1664, "w": 128, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 128, "h": 128 },
		 	"sourceSize": { "w": 128, "h": 128 }
		 },
		 {
		 	"filename": "health_heart",
		 	"frame": { "x": 768, "y": 1792, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "empty_health_heart",
		 	"frame": { "x": 768, "y": 1856, "w": 64, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 64, "h": 64 },
		 	"sourceSize": { "w": 64, "h": 64 }
		 },
		 {
		 	"filename": "control_panel",
		 	"frame": { "x": 896, "y": 1920, "w": 128, "h": 128 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 128, "h": 128 },
		 	"sourceSize": { "w": 128, "h": 128 }
		 },
		 {
		 	"filename": "starfield",
		 	"frame": { "x": 512, "y": 3200, "w": 448, "h": 256 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 448, "h": 256 },
		 	"sourceSize": { "w": 448, "h": 256 }
		 },
		 {
		 	"filename": "empire_badge",
		 	"frame": { "x": 960, "y": 3008, "w": 320, "h": 320 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 320, "h": 320 },
		 	"sourceSize": { "w": 320, "h": 320 }
		 },
		 {
		 	"filename": "rebel_badge",
		 	"frame": { "x": 1280, "y": 3008, "w": 320, "h": 320 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 320, "h": 320 },
		 	"sourceSize": { "w": 320, "h": 320 }
		 },
		 {
		 	"filename": "tie_fighter",
		 	"frame": { "x": 1024, "y": 2752, "w": 192, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 192 },
		 	"sourceSize": { "w": 192, "h": 192 }
		 },
		 {
		 	"filename": "xwing_squad",
		 	"frame": { "x": 512, "y": 3008, "w": 448, "h": 192 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 448, "h": 192 },
		 	"sourceSize": { "w": 448, "h": 192 }
		 },
		 {
		 	"filename": "viper_droid",
		 	"frame": { "x": 1024, "y": 2496, "w": 192, "h": 256 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 192, "h": 256 },
		 	"sourceSize": { "w": 192, "h": 256 }
		 },
		 {
		 	"filename": "menu",
		 	"frame": { "x": 1216, "y": 1664, "w": 256, "h": 320 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 256, "h": 320 },
		 	"sourceSize": { "w": 256, "h": 320 }
		 },
		 {
		 	"filename": "rebel_force_attack",
		 	"frame": { "x": 1216, "y": 1984, "w": 448, "h": 384 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 448, "h": 384 },
		 	"sourceSize": { "w": 448, "h": 384 }
		 },
		 {
		 	"filename": "empire_force_attack",
		 	"frame": { "x": 1216, "y": 2368, "w": 512, "h": 448 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 512, "h": 448 },
		 	"sourceSize": { "w": 512, "h": 448 }
		 },
		 {
		 	"filename": "instructions",
		 	"frame": { "x": 0, "y": 3456, "w": 1200, "h": 800 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 1200, "h": 800 },
		 	"sourceSize": { "w": 1200, "h": 800 }
		 },
		 {
		 	"filename": "fire_animation",
		 	"frame": { "x": 960, "y": 3328, "w": 384, "h": 64 },
		 	"rotated": false,
		 	"trimmed": true,
		 	"spriteSourceSize": { "x": 0, "y": 0, "w": 384, "h": 64 },
		 	"sourceSize": { "w": 384, "h": 64 }
		 }
	]
};

//var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'hoth', null, true, false);
var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'hoth', null, true, false);
var BasicGame = function (game) { };
BasicGame.Boot = function (game) { };
//=====================================================================================================================
BasicGame.Boot.prototype =
{
	init: function () {
	},

	preload: function () {

		game.time.advancedTiming = true;
		game.plugins.add(new Phaser.Plugin.Isometric(game));
		game.iso.anchor.setTo(0.35, 0); //indent the isometric grid

		//=== sprites
		game.load.image('background', 'assets/images/snow.jpg');
		game.load.atlas('hothSprites', 'assets/images/hoth.png', null, spriteAreas);
		game.load.spritesheet('snowflakeSprites', 'assets/images/snowflakes.png', 17, 17);
		game.load.spritesheet('fireSprites', 'assets/images/fire.png', 64, 64, 6);

		//=== fonts
		game.load.bitmapFont('jediFontYellow', 'assets/font/fontYellow.png', 'assets/font/font.xml');
		game.load.bitmapFont('jediFontBlue', 'assets/font/fontBlue.png', 'assets/font/font.xml');

		//===== sound effects
		game.load.audio('audioPieceShootArmy', ['assets/audio/shoot_army.mp3']);
		game.load.audio('audioPieceShootAtAt', ['assets/audio/shoot_atat.mp3']);
		game.load.audio('audioPieceShootAtSt', ['assets/audio/shoot_atst.mp3']);
		game.load.audio('audioPieceShootEmpireCannon', ['assets/audio/shoot_empire_cannon.mp3']);
		game.load.audio('audioPieceShootRebelCannon', ['assets/audio/shoot_rebel_cannon.mp3']);
		game.load.audio('audioPieceShootSpeeder', ['assets/audio/shoot_speeder.mp3']);
		game.load.audio('audioPieceShootTauntaun', ['assets/audio/shoot_tauntaun.mp3']);
		game.load.audio('audioPieceExplodeA', ['assets/audio/pieceExplodeA.mp3']);
		game.load.audio('audioPieceExplodeB', ['assets/audio/pieceExplodeB.mp3']);
		game.load.audio('audioPieceUp', ['assets/audio/pieceUp.mp3']);
		game.load.audio('audioPieceSlide', ['assets/audio/pieceSlide.mp3']);
		game.load.audio('audioWind', ['assets/audio/wind.mp3']);
		game.load.audio('audioRebelWin', ['assets/audio/rebelWin.mp3']);
		game.load.audio('audioEmpireWin', ['assets/audio/empireWin.mp3']);
		game.load.audio('audioViperDroid', ['assets/audio/viperDroid.mp3']);
		game.load.audio('audioEchoBaseAmbient', ['assets/audio/echoBaseAmbient.mp3']);
		game.load.audio('audioTaunTaun', ['assets/audio/taunTaun.mp3']);
		game.load.audio('audioRebelForceAttack', ['assets/audio/xWingFlyBy.mp3']);
		game.load.audio('audioEmpireForceAttack', ['assets/audio/tieFighterFlyBy.mp3']);
		game.load.audio('audioXwingSquad', ['assets/audio/xWingFlyBy.mp3']);
		game.load.audio('audioTieFighter', ['assets/audio/tieFighterFlyBy.mp3']);
		game.load.audio('audioBattleOfHoth', ['assets/audio/battleOfHoth.mp3']);
		game.load.audio('audioFactionFlipOne', ['assets/audio/factionFlipOne.mp3']);
		game.load.audio('audioFactionFlipTwo', ['assets/audio/factionFlipTwo.mp3']);
	},

	create: function () {

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 480;
		this.scale.minHeight = 320;
		this.scale.maxWidth = 1152;
		this.scale.maxHeight = 768;
		this.scale.refresh();
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		//=== show background icefield / snow
		game.add.tileSprite(0, 0, 1200, 800, 'background');

		game.add.bitmapText(10, 10, 'jediFontBlue', 'v2', 16);

		//=== sounds
		audioPieceUp = game.add.audio('audioPieceUp');
		audioPieceSlide = game.add.audio('audioPieceSlide');
		audioWind = game.add.audio('audioWind');
		audioRebelWin = game.add.audio('audioRebelWin');
		audioEmpireWin = game.add.audio('audioEmpireWin');
		audioViperDroid = game.add.audio('audioViperDroid');
		audioEchoBaseAmbient = game.add.audio('audioEchoBaseAmbient');
		audioTaunTaun = game.add.audio('audioTaunTaun');
		audioRebelForceAttack = game.add.audio('audioRebelForceAttack');
		audioEmpireForceAttack = game.add.audio('audioEmpireForceAttack');
		audioXwingSquad = game.add.audio('audioXwingSquad');
		audioTieFighter = game.add.audio('audioTieFighter');
		audioBattleOfHoth = game.add.audio('audioBattleOfHoth');
		audioFactionFlipOne = game.add.audio('audioFactionFlipOne');
		audioFactionFlipTwo = game.add.audio('audioFactionFlipTwo');

		soundHolderExplode = {
			audioPieceExplodeA: game.add.audio('audioPieceExplodeA'),
			audioPieceExplodeB: game.add.audio('audioPieceExplodeB')
		};

		soundHolderShoot = {
			audioPieceShootArmy: game.add.audio('audioPieceShootArmy'),
			audioPieceShootAtAt: game.add.audio('audioPieceShootAtAt'),
			audioPieceShootAtSt: game.add.audio('audioPieceShootAtSt'),
			audioPieceShootEmpireCannon: game.add.audio('audioPieceShootEmpireCannon'),
			audioPieceShootRebelCannon: game.add.audio('audioPieceShootRebelCannon'),
			audioPieceShootSpeeder: game.add.audio('audioPieceShootSpeeder'),
			audioPieceShootTauntaun: game.add.audio('audioPieceShootTauntaun')
		};

		//=== sprite groups
		isoGroupBackground = game.add.group(); 		//=== gameboard
		isoGroupIndicators = game.add.group(); 		//=== movement indicators and inactive shot pattern indicators
		isoGroupPieces = game.add.group();     		//=== game pieces
		isoGroupHotspots = game.add.group();     	//=== hotspots 
		InitTiles();
		ShowBattleOfHothText(0);
		InitMenu();
		InitBackgound();
		InitGameboard();

		cursorPos = new Phaser.Plugin.Isometric.Point3();		//=== Provide a 3D position for the cursor

		rebelBadge_1 = game.add.sprite(game.world.width - 470, 20, 'hothSprites', 'rebel_badge');
		rebelBadge_2 = game.add.sprite(game.world.width - 370, 100, 'hothSprites', 'rebel_badge');
		empireBadge_1 = game.add.sprite(game.world.width - 220, 20, 'hothSprites', 'empire_badge');
		empireBadge_2 = game.add.sprite(game.world.width - 120, 100, 'hothSprites', 'empire_badge');

		fireAnimation = game.add.sprite(-300, -300, 'fireSprites');
		fireAnimation.animations.add('flames');

		//=== snow
		snowEmitter = game.add.emitter(game.world.centerX, -32, 600);
		snowEmitter.makeParticles('snowflakeSprites', [0, 1, 2, 3, 4, 5]);
		snowEmitter.maxParticleScale = 0.9;
		snowEmitter.minParticleScale = 0.2;
		snowEmitter.setYSpeed(10, 50);
		snowEmitter.gravity = 0;
		snowEmitter.width = game.world.width * 1.5;
		snowEmitter.minRotation = 0;
		snowEmitter.maxRotation = 40;
		snowEmitter.revive();
		snowEmitter.start(false, 14000, 20);

		FlipFactionTurn();
		InitGameboard();

		//=== remove the loading screen DIV
		document.getElementById("loader").style.display = "none";

		//game.sound.pauseAll() //not working!

	},
	update: function () {

		IncrementAnimationAndAudioCounters();
		game.iso.unproject(game.input.activePointer.position, cursorPos);
	},
	render: function () {
		//	game.debug.text("game.debug.text", 2, 36, "#ffffff");
		//	game.debug.text("FPS:" + game.time.fps || '--', 2, 14, "#a7aebe");
	}
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');

//=================== tile functions =======================
function InitBackgound() {

	var x;
	var y;
	var tileName;
	var tile;

	//=== clear the board of old ground pieces
	isoGroupBackground.destroy(true, true);
	for (x = 0; x < tiles.length; x += 1) {
		for (y = 0; y < tiles[0].length; y += 1) {
			//=== draw the gameboard (spaces)
			tileName = tiles[x][y][2];
			tile = SetSprite(x, y, 'hothSprites', tileName, isoGroupBackground);
		}
	}
}
//==========================
function tweenTintRepeat(obj, startColor, endColor, tweenTime, repeatCount, repeatTime) {      
    var colorBlend = {step: 0};    
    var colorTween = game.add.tween(colorBlend);
    colorTween.to({ step: 100 }, tweenTime);

    game.time.events.add(Phaser.Timer.SECOND * 3, function () {
        colorTween.onUpdateCallback(function() {      
            obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
            });
    });
       
    obj.tint = startColor;
    colorTween.repeat(repeatCount);
    colorTween.repeatDelay(repeatTime);
    colorTween.start();
}
//==========================
function InitMenu() {
	//control_panel
	var controlPanelSprite = game.add.sprite(5, 5, 'hothSprites', 'control_panel');
	
	controlPanelSprite.scale.setTo(0.4, 0.4);
	controlPanelSprite.inputEnabled = true;  //  Enables all kind of input actions on this image (click, etc)
	controlPanelSprite.input.useHandCursor = true;
	
	var controlPanelScaleTween = game.add.tween(controlPanelSprite.scale);
	controlPanelScaleTween.to({ x: 0.6, y: 0.6 }, 300, Phaser.Easing.Bounce.Out, false, 0, true, false);
	controlPanelScaleTween.repeat(5, 10000); //1000 = 1 sec
	controlPanelScaleTween.start();

	//tweenTintRepeat(controlPanelSprite, 0xffffff, 0x010101, 300, 5, 10000);

	//============================ EVENT (click control panel) ============================
    controlPanelSprite.events.onInputDown.add(function (controlPanelSprite) {

		game.paused = true;
		menu = game.add.sprite(0, 0, 'hothSprites', 'menu');
		menu.scale.setTo(2, 2);
		menu.inputEnabled = true; //  Enables all kind of input actions on this image (click, etc)
		menu.input.useHandCursor = true;

		//=== Add a input listener that can help us return from being paused
		game.input.onDown.add(unpause, self);

		function unpause(event) {

			//=== Only act if paused and mapmenu is not up
			if (showInstructionScreen == false && game.paused && (typeof menu != "undefined" || menu != null) && (typeof instructions == "undefined" || instructions == null)) {

				//=== corners of the menu
				var x1 = 0;
				var x2 = 512;
				var y1 = 0;
				var y2 = 640;

				//=== Check if the click was inside the menu
				if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {

					//=== Get menu local coordinates for the click (only need y)
					var y = event.y;
					//=== back
					if (y > 0 && y <= 128) {
						// Remove the menu and the unpause
						menu.destroy();
						game.paused = false;
					}
					//=== instructions
					if (y > 128 && y <= 256) {
						game.paused = false;
						menu.destroy();
						showInstructionScreen = true;
						ShowInstructions();
					}
					//=== snow toggle
					if (y > 256 && y < 384) {
						snowToggle = (snowToggle) ? false : true;
						menu.destroy();
						game.paused = false;

						if (snowToggle) {
							snowEmitter.revive();
							snowEmitter.start(false, 14000, 20);
						} else {
							snowEmitter.removeAll(true, true); //ste:todo: let snow toggle back on
							snowEmitter.kill();
						}
					}
					//=== reset
					if (y > 384 && y < 512) {
						menu.destroy();
						game.paused = false;
						InitTiles();
						FlipFactionTurn();
						InitBackgound();
						InitGameboard();
						ShowBattleOfHothText(0);
					}
					//=== fork bitbucket
					if (y > 512 && y < 640) {
					   	
					    window.top.location = 'https://bitbucket.org/wizzard262/battleofhoth';

					}
				} else {
					// Remove the menu and unpause
					menu.destroy();
					game.paused = false;
				}
			}
		}
	}, this);
	//============================ END EVENT (click control panel) ===============
}
//==========================
function ShowInstructions() {

	instructions = game.add.sprite(0, 0, 'hothSprites', 'instructions');
	instructions.inputEnabled = true; //  Enables all kind of input actions on this image (click, etc)
	instructions.input.useHandCursor = true;
	instructions.bringToTop();

	//click removes instructions
	instructions.events.onInputDown.add(function () {
		game.paused = false;
		instructions.destroy();
		instructions = null;
		showInstructionScreen = false;
	}, game);
}
//==========================
function InitGameboard(xIn, yIn) {

	var returnSprite;
	var x;
	var y;
	var sprite;

	isoGroupIndicators.destroy(true, true);
	isoGroupPieces.destroy(true, true);
	isoGroupHotspots.destroy(true, true);

	for (x = 0; x < tiles.length; x += 1) {
		for (y = 0; y < tiles[0].length; y += 1) {

			//=== if this grid cell contains a piece, show it
			if (tiles[x][y][3] != null) {

				sprite = InitPiece(x, y);

				//==return the correct sprite
				if (xIn != null && yIn != null && x == xIn && y == yIn) {
					returnSprite = sprite;
				}
			}
		}
	}
	return returnSprite;
}
//==========================
function InitPiece(x, y) {

	var sprite = SetSprite(x, y, 'hothSprites', GetPieceTileName(x, y), isoGroupPieces);
	var scale = tiles[x][y][3][7];
	sprite.xx = x;
	sprite.yy = y;

	if (tiles[x][y][3][0] == turnStatus.currentTurnFaction) {

		sprite.inputEnabled = true;  //  Enables all kind of input actions on this image (click, etc)
		sprite.input.useHandCursor = true;

		//============================ EVENT (select piece) ===========================
		sprite.events.onInputDown.add(function (sprite) {

			game.iso.unproject(game.input.activePointer.position, cursorPos);

			if (sprite.isoBounds.containsXY(cursorPos.x, cursorPos.y)) {			    
				SelectPiece(sprite);
			}
				// its not this sprite! check which one it is  and fire its OnInput event!
			else {
				RedirectSpritesOnInputDownEvent(cursorPos.x, cursorPos.y, sprite.xx, sprite.yy);
			}
		}, this);
	    //============================ END EVENT (select piece) =======================

		if (turnStatus.moveCounter == 0 && turnStatus.factionFlipBounce) {
		    delay = (Math.floor(Math.random() * 12000) + 6000);

		    //to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
		    var tweenPiece = game.add.tween(sprite.scale);
		   tweenPiece.to({ x: 1.1, y: 1.1 }, 100, Phaser.Easing.Bounce.Out, false, delay, false, true);
           tweenPiece.repeat(2);
		    tweenPiece.repeatDelay(delay);
		    tweenPiece.yoyoDelay(100);
		    tweenPiece.start();
		   // tweenTintRepeat(sprite, 0xffffff, 0x010101, 200, 2, delay);
		}
	}

	return sprite;
}
//==========================
function SelectPiece(sprite) {
    turnStatus.factionFlipBounce = false;
	var newSprite = InitGameboard(sprite.xx, sprite.yy);

	moveIndicatorSprites = SetMoveIndicators(sprite, moveArray);
	shootIndicatorSprites = SetShootIndicators(sprite, tiles[sprite.xx][sprite.yy][3][5]);

	audioPieceUp.play();

	//=== lift selected piece
	var tweenPiece = game.add.tween(newSprite);
	tweenPiece.to({ isoZ: 20 }, 50, Phaser.Easing.Bounce.In, false);
	tweenPiece.to({ isoZ: 5 }, 200, Phaser.Easing.Bounce.Out, false);
	tweenPiece.start();
    DrawStarfield(sprite.xx, sprite.yy);
}
//==========================
function RedirectSpritesOnInputDownEvent(xCoord, yCoord, x, y) {

	isoGroupPieces.forEach(function (sprite) {
		if (sprite
		&& sprite.isoBounds.containsXY(xCoord, yCoord)
		&& sprite.yy != null
		&& sprite.xx != null
		&& tiles[sprite.xx][sprite.yy][3] != null
		&& tiles[sprite.xx][sprite.yy][3][0] == turnStatus.currentTurnFaction) {
			SelectPiece(sprite);
		}
	});

	isoGroupIndicators.forEach(function (sprite) {
		if (sprite
		&& sprite.isoBounds.containsXY(xCoord, yCoord)
		&& sprite.yFrom != null
		&& sprite.xFrom != null
		&& tiles[sprite.xFrom][sprite.yFrom][3] != null
		&& tiles[sprite.xFrom][sprite.yFrom][3][0] == turnStatus.currentTurnFaction) {
			MovePiece(sprite);
		}
	});

	/*
	isoGroupShootHotspots.forEach(function(sprite) {
		if(sprite 
		&& sprite.isoBounds.containsXY(xCoord, yCoord) 
		&& sprite.yFrom != null 
		&& sprite.xFrom != null 
		&& tiles[sprite.xFrom][sprite.yFrom][3] != null 
		&& tiles[sprite.xFrom][sprite.yFrom][3][0] != turnStatus.currentTurnFaction) {
			//ShootPiece(sprite);
		}
	});*/
}
//==========================
function ShootPiece(sprite) {

	var health;
	var shotOutcome;
	var isForceHit;
	var isShootsDiagonal;
	var spriteNew;
	var tileName;
	var destroyedVehicle;

	FlipFactionTurn();
	sprite.xDestination = sprite.x + isoBaseSize;
	sprite.yDestination = sprite.y + (0.5 * isoBaseSize) - (0.5 * isoBaseSize);

	//==reset the direction of the shooting piece and redraw it 
	tiles[sprite.xFrom][sprite.yFrom][3][3] = GetDirection(sprite.xFrom, sprite.yFrom, sprite.xTo, sprite.yTo);
	spriteNew = SetSprite(sprite.xFrom, sprite.yFrom, 'hothSprites', GetPieceTileName(sprite.xFrom, sprite.yFrom), isoGroupPieces);

	InitGameboard();
	turnStatus.factionFlipBounce = false;

	shotOutcome = Math.floor(Math.random() * shootOutcomes.length);
	isForceHit = tiles[sprite.xFrom][sprite.yFrom][3][6] && (shotOutcome == 2);
	isShootsDiagonal = tiles[sprite.xFrom][sprite.yFrom][3][4];

	ShowProjectile(sprite, shotOutcome, isShootsDiagonal);

	if (isForceHit) {
		AnimateForceAttack(tiles[sprite.xFrom][sprite.yFrom][3][0]); // force hit! instant kill!
		ForceAttackText();
	}
	else {
		if (shotOutcome == 0) {
			ShowResultText('jediFontBlue', 0.6, 'miss!', sprite.x, sprite.y); //HIT! or MISS!
		}
		else {
			ShowResultText('jediFontYellow', 0.6, 'hit!', sprite.x, sprite.y); //HIT! or MISS!
		}
	}

	//=== reduce health of the piece
	if (shotOutcome > 0) {

		if (isForceHit) {
			tiles[sprite.xTo][sprite.yTo][3][2] = 0;
			health = 0;
		} else {
			tiles[sprite.xTo][sprite.yTo][3][2] -= 1;
			health = tiles[sprite.xTo][sprite.yTo][3][2];
		}

		tileName = GetPieceTileName(sprite.xTo, sprite.yTo).replace("_4", "_0").replace("_3", "_0").replace("_2", "_0").replace("_1", "_0");

		//=== if piece was killed
		if (health <= 0) {

			soundHolderExplode[tiles[sprite.xFrom][sprite.yFrom][3][9]].play();

			//=== remove piece data from tiles grid
			tiles[sprite.xTo][sprite.yTo][3] = null;

			//== explosion sprite so appears after the board reset
			game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {

				destroyedVehicle = SetSprite(sprite.xTo, sprite.yTo, 'hothSprites', tileName, isoGroupIndicators);

				//=== show flames over the killed vehicle
				fireAnimation.alpha = 1;
				fireAnimation.x = sprite.x + (isoBaseSize * 0.5);
				fireAnimation.y = sprite.y - (isoBaseSize * 0.5);
				fireAnimation.scale.setTo(2, 2);
				fireAnimation.animations.play('flames', 6, true);

				//isoGroupPieces.add(fireAnimation);
				//=== prevent overlap of fire in incorrect order
				//isoGroupPieces.sort('y', Phaser.Group.SORT_ASCENDING)

				//=== fade the flames anim & destroyed vehicle
				var tweenFireAnimation = game.add.tween(fireAnimation);
				tweenFireAnimation.to({ alpha: 0 }, 6000, Phaser.Easing.Linear.None, false, 0, 1000, true);
				tweenFireAnimation.start();

				var tweenDestroyedVehicle = game.add.tween(destroyedVehicle);
				tweenDestroyedVehicle.to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None, false, 0, 1000, true);
				tweenDestroyedVehicle.start();
			}, this);


			//=== refresh to clear explosion. remove fire from view
			game.time.events.add(Phaser.Timer.SECOND * 4, function () {
				fireAnimation.animations.stop('flames');
				fireAnimation.x = -300;
				fireAnimation.y = -300;
				InitGameboard();
			}, this);
		}
		else {
			//==  eject minifig
			game.time.events.add(Phaser.Timer.SECOND * 0.4, function () {
				AnimateMicrofigEject(sprite);
			}, this);
		}
	}
}
//==========================
function MovePiece(sprite) {

	var newSprite;

	FlipFactionTurn();
	//=== reset the direction of the shooting piece and redraw it 
	tiles[sprite.xFrom][sprite.yFrom][3][3] = GetDirection(sprite.xFrom, sprite.yFrom, sprite.xTo, sprite.yTo);

	//=== move piece in tiles Grid
	tiles[sprite.xTo][sprite.yTo][3] = tiles[sprite.piece.xx][sprite.piece.yy][3];
	tiles[sprite.xFrom][sprite.yFrom][3] = null;

	newSprite = InitGameboard(sprite.xTo, sprite.yTo);
	turnStatus.factionFlipBounce = false;

	audioPieceSlide.play();

	//=== send it back to its old position so we can move it visibly, and put it on top of stack of tiles
	newSprite.isoX = isoBaseSize * sprite.xFrom;
	newSprite.isoY = isoBaseSize * sprite.yFrom;

	var tweenPiece = game.add.tween(newSprite);
	tweenPiece.to({ isoZ: 20, isoX: (isoBaseSize * sprite.xTo), isoY: (isoBaseSize * sprite.yTo) }, 200, Phaser.Easing.Quadratic.InOut, false);
	tweenPiece.to({ isoZ: 0 }, 200, Phaser.Easing.Bounce.Out, false);
	tweenPiece.start();

	CheckVictoryConditions(0);
}
//==========================
function SetSprite(x, y, tileAtlas, tileName, group) {
	return game.add.isoSprite(x * isoBaseSize, y * isoBaseSize, 0, tileAtlas, tileName, group);
}
//==========================
function GetGameboardTileName(x, y) {
	return tiles[x][y][2];
}
//==========================
function SetMoveIndicators(spritePiece, moves) {

	var sprite;
	var x = spritePiece.xx;
	var y = spritePiece.yy;
	var i;
	var faction = tiles[x][y][3][0];
	var sprites = [SetSprite(x, y, 'hothSprites', faction + '_shooter', isoGroupIndicators)];
	var xTo;
	var yTo;
	var direction;
	var tileName;

	for (i = 0; i < moves.length; i++) {

		xTo = x + moves[i][0];
		yTo = y + moves[i][1];

		direction = GetDirection(x, y, xTo, yTo);

		if (IsViableMove(x, y, xTo, yTo, tiles.length, tiles[0].length, direction)) {

			tileName = "moveable_" + direction;

			sprite = SetSprite(xTo, yTo, 'hothSprites', tileName, isoGroupIndicators);

			sprite.xTo = xTo;
			sprite.yTo = yTo;
			sprite.direction = direction;
			sprite.xFrom = x;
			sprite.yFrom = y;
			sprite.piece = spritePiece;

			sprite.inputEnabled = true; //=== Enables all kind of input actions on this image (click, etc)
			sprite.input.useHandCursor = true;
			//============================ EVENT (move piece) ============================
			sprite.events.onInputDown.add(function (sprite) {

				game.iso.unproject(game.input.activePointer.position, cursorPos);

				if (sprite.isoBounds.containsXY(cursorPos.x, cursorPos.y)) {

					MovePiece(sprite);
				}
				else {
					RedirectSpritesOnInputDownEvent(cursorPos.x, cursorPos.y, sprite.xx, sprite.yy);
				}
				CheckVictoryConditions(3);
			}, this);
			//============================ END EVENT (move piece) ========================

			sprite.tint = 0xCCCCCC;
			//	sprites.push(sprite);
		}
	}
	//return sprites;
}
//==========================
function SetShootIndicators(spritePiece, shootArray) {

	var sprites = [];
	var xFrom = spritePiece.xx;
	var yFrom = spritePiece.yy;
	var tileName = tiles[xFrom][yFrom][2];
	var i;
	var j;
	var xTo;
	var yTo;
	var direction;
	var shot;
	var spriteShootIndicator;
	var sprite;
	var spriteShootable;


	for (i = 0; i < shootArray.length; i++) { //=== 4 directions

		shotAvailable = true;

		//=== X shooting slots per direction
		for (j = 0; j < shootArray[i].length; j++) {

			xTo = xFrom + shootArray[i][j][0];
			yTo = yFrom + shootArray[i][j][1];
			direction = GetDirection(xFrom, yFrom, xTo, yTo);
			shot = IsViableShot(xFrom, yFrom, xTo, yTo, tiles.length, tiles[0].length);

			//== if move is not unviable (off the board)
			if (shot != 0) {
				if (shot == 1 && shotAvailable) {

					//=== show the target 
					spriteShootIndicator = SetSprite(xTo, yTo, 'hothSprites', "shootable_on", isoGroupPieces);

					//=== redraw the piece with events for shootable
					sprite = SetSprite(xTo, yTo, 'hothSprites', GetPieceTileName(xTo, yTo), isoGroupPieces);
					spriteShootable = SetSprite(xTo, yTo, 'hothSprites', 'blankTile', isoGroupHotspots);

					//=== prevent overlap of game board pieces in incorrect order
					isoGroupPieces.sort('y', Phaser.Group.SORT_ASCENDING);

					spriteShootable.xTo = xTo;
					spriteShootable.yTo = yTo;
					spriteShootable.direction = direction;
					spriteShootable.xFrom = xFrom;
					spriteShootable.yFrom = yFrom;
					spriteShootable.inputEnabled = true;  //  Enables all kind of input actions on this image (click, etc)
					spriteShootable.input.useHandCursor = true;
					spriteShootable.xOrigin = spritePiece.x;
					spriteShootable.yOrigin = spritePiece.y;

					//============================ EVENT (shoot) ============================
					spriteShootable.events.onInputDown.add(function (spriteShootable) {

						game.iso.unproject(game.input.activePointer.position, cursorPos);

						if (spriteShootable.isoBounds.containsXY(cursorPos.x, cursorPos.y)) {
							ShootPiece(spriteShootable);
						}
						else {
							RedirectSpritesOnInputDownEvent(cursorPos.x, cursorPos.y, spriteShootable.xx, spriteShootable.yy);
						}

						//=== immediately remove the targeting indicators and prevent any further shooting
						isoGroupIndicators.destroy(true, true);
						isoGroupHotspots.destroy(true, true);

						//===  delay game refresh until after projectile has landed (so piece is not shown as damaged before its hit!)
						game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {

							InitGameboard();

						}, this);

						CheckVictoryConditions(3);
					}, this);
					//============================ END EVENT ============================

					shotAvailable = false;
				}
				else {
					sprite = SetSprite(xTo, yTo, 'hothSprites', "shootable_off", isoGroupIndicators);
				}
				//=== end this line of firing possibility as current faction member blocks firing beyond this square
				if (tiles[xTo][yTo][3] != null) {
					shotAvailable = false;
				}
				sprites.push(sprite);
			}
		}
	}
	return sprites;
}
//==========================
function IsViableMove(xFrom, yFrom, xTo, yTo, xMax, yMax, direction) {

	//=== is a move from (xFrom, yFrom) to (xTo, yTo) allowed
	var bridgePresent;

	//=== destination grid cell is empty AND  destination grid cell is on the board area AND there is a BRIDGE between the 2 board pieces allowing this move
	if (yTo >= 0 && xTo >= 0 && yTo < yMax && xTo < xMax && tiles[xTo][yTo][3] == null) {
		switch (direction) {
			case "up":
				if (bridgePresent = tiles[xFrom][yFrom][2].substring(0, 1) == 1)
					return true;
				break;
			case "right":
				if (bridgePresent = tiles[xFrom][yFrom][2].substring(1, 2) == 1)
					return true;
				break;
			case "down":
				if (bridgePresent = tiles[xFrom][yFrom][2].substring(2, 3) == 1)
					return true;
				break;
			case "left":
				if (bridgePresent = tiles[xFrom][yFrom][2].substring(3, 4) == 1)
					return true;
				break;
		}
		return false;
	}
}
//==========================
function IsViableShot(xFrom, yFrom, xTo, yTo, xMax, yMax) {

	//== is a shot from (xFrom, yFrom) to (xTo, yTo) allowed

	//=== does destination grid cell exists on the board area and not a null cell
	if (yTo >= 0 && xTo >= 0 && yTo < yMax && xTo < xMax && tiles[xTo][yTo][2] != '0000') {

		if (tiles[xTo][yTo][3] != null	// destination grid cell is NOT empty (contains a gamepiece) 
			&& tiles[xTo][yTo][3][2] > 0	// and is not zero health
			&& tiles[xTo][yTo][3][0] != tiles[xFrom][yFrom][3][0]  // and not of the same faction (empire or rebel)	
			) {
			return 1; //=== good shot
		}
		return 2; //=== reachable but not a good shot (another vehicle blocks or no target in square)
	}
	return 0; //=== unviable (negative coords)
}
//==========================
function GetDirection(xFrom, yFrom, xTo, yTo) {
	if (xFrom >= xTo && yFrom == yTo)
		return "left";
	if (xFrom <= xTo && yFrom == yTo)
		return "right";
	if (xFrom == xTo && yFrom >= yTo)
		return "up";
	if (xFrom == xTo && yFrom <= yTo)
		return "down";

	//=== the riders (atst & tauntuan) as they shoot diagonally will not fit any 4 of the above SHOOT directions
	//=== special conditions to get them close
	if (yFrom > yTo && xFrom > xTo)
		return "up";
	if (yFrom < yTo && xFrom > xTo)
		return "down";
	if (yFrom > yTo && xFrom < xTo)
		return "left";
	if (yFrom < yTo && xFrom < xTo)
		return "right";
}
//==========================
function GetPieceTileName(x, y) {

	if (tiles[x][y][3] != null) {

		var piece = tiles[x][y][3];
		var factionName = piece[0];
		var pieceName = piece[1];
		var direction = piece[3];
		var health = piece[2];
		return factionName + "_" + pieceName + "_" + direction + "_" + health;
	}
	return;
}
//==========================
function ShowProjectile(sprite, shotOutcome, isShootsDiagonal) {

	var xFrom;
	var yFrom;
	var xTo;
	var yTo;
	var direction = sprite.direction;
	var shotDirection = direction;
	var shotOutcomeMutiplier = 0;
	var shottime = 500;

	//=== if missed make a longer shot that overshoots
	if (shotOutcome == 0)
		shotOutcomeMutiplier = 2; //=== overshoots by twice the distance between pieces

	//==get and play the correct shot sound
	soundHolderShoot[tiles[sprite.xFrom][sprite.yFrom][3][8]].play();

	switch (direction) {

		//=== ste:todo: tweak start and end points

		case "up":
			xFrom = sprite.xOrigin + isoBaseSize;
			yFrom = sprite.yOrigin + (0.5 * isoBaseSize);
			xTo = sprite.x + isoBaseSize + (isoBaseSize * shotOutcomeMutiplier);
			yTo = sprite.y + (0.5 * isoBaseSize) - (0.5 * isoBaseSize * shotOutcomeMutiplier);
			break;

		case "right":
			xFrom = sprite.xOrigin + isoBaseSize;
			yFrom = sprite.yOrigin + (0.5 * isoBaseSize);
			xTo = sprite.x + isoBaseSize + (isoBaseSize * shotOutcomeMutiplier);
			yTo = sprite.y + (0.5 * isoBaseSize) + (0.5 * isoBaseSize * shotOutcomeMutiplier);
			break;

		case "down":
			xFrom = sprite.xOrigin + isoBaseSize;
			yFrom = sprite.yOrigin + (0.5 * isoBaseSize);
			xTo = sprite.x + isoBaseSize - (isoBaseSize * shotOutcomeMutiplier);
			yTo = sprite.y + (0.5 * isoBaseSize) + (0.5 * isoBaseSize * shotOutcomeMutiplier);
			break;

		case "left":
			xFrom = sprite.xOrigin + isoBaseSize;
			yFrom = sprite.yOrigin + (0.5 * isoBaseSize);
			xTo = sprite.x + isoBaseSize - (isoBaseSize * shotOutcomeMutiplier);
			yTo = sprite.y + (0.5 * isoBaseSize) - (0.5 * isoBaseSize * shotOutcomeMutiplier);
			break;
	}

	//=== corrections for diagonal shooter (tauntaun and AT-ST)
	if (isShootsDiagonal) {
		shotDirection += '_rider';

		//=== ste:todo: tweak start and end points
		switch (direction) {
			case "up":
				xTo = sprite.x + isoBaseSize;
				yTo = sprite.y + (0.5 * isoBaseSize) - (0.5 * isoBaseSize * shotOutcomeMutiplier);
				break;
			case "right":
				xTo = sprite.x + isoBaseSize;
				yTo = sprite.y + (0.5 * isoBaseSize) + (0.5 * isoBaseSize * shotOutcomeMutiplier);
				break;
			case "down":
				xTo = sprite.x + isoBaseSize - (isoBaseSize * shotOutcomeMutiplier);
				yTo = sprite.y + (0.5 * isoBaseSize);
				break;
			case "left":
				xTo = sprite.x + isoBaseSize + (isoBaseSize * shotOutcomeMutiplier);
				yTo = sprite.y + (0.5 * isoBaseSize);
				break;
		}
	}
	AnimateProjectile(xFrom, yFrom, xTo, yTo, shottime, shotDirection, shotOutcome);
}
//==========================
function CheckVictoryConditions(delay) {

	var x;
	var y;

	//=== check need to prevent a 'double-victory' (due to overlapping isometric sprites)
	if (turnStatus.victory)
		return;

	rebelDead = true;
	empireDead = true;
	rebelBaseTaken = false;
	empireBaseTaken = false;

	for (x = 0; x < tiles.length; x += 1) {
		for (y = 0; y < tiles[0].length; y += 1) {

			if (tiles[x][y][3] != null && tiles[x][y][3][0] == 'empire') {
				empireDead = false;

				if (tiles[x][y][3][0] == 'empire' && tiles[x][y][4] == 'rebel')
					rebelBaseTaken = true;
			}

			if (tiles[x][y][3] != null && tiles[x][y][3][0] == 'rebel') {
				rebelDead = false;

				if (tiles[x][y][3][0] == 'rebel' && tiles[x][y][4] == 'empire')
					empireBaseTaken = true;
			}
		}
	}

	if (empireDead || empireBaseTaken) {
		ShowVictoryText('rebel', delay);
	}

	if (rebelDead || rebelBaseTaken) {
		ShowVictoryText('empire', delay);
	}
}
//==========================
function FlipFactionTurn() {

	if (turnStatus.moveCounter == 1) {
		turnStatus.moveCounter = 0;
	}
	else {
		turnStatus.moveCounter++;
	}
	AnimateFactionFlip(turnStatus.moveCounter);
}
//==========================
function InitTiles() {

	var mapCount = 6;
	var gameBoard = Math.floor(Math.random() * mapCount) + 1; //=== get a random gameboard (6 of)

	//=== reset the game board array (copy by val, so we can maintain the original dataset for later replication)
	switch (gameBoard) {
		case 1:
			tiles = CloneObject(tilesInit1);
			break;
		case 2:
			tiles = CloneObject(tilesInit2);
			break;
		case 3:
			tiles = CloneObject(tilesInit3);
			break;
		case 4:
			tiles = CloneObject(tilesInit4);
			break;
		case 5:
			tiles = CloneObject(tilesInit5);
			break;
		case 6:
			tiles = CloneObject(tilesInit6);
			break;
		default:
			tiles = CloneObject(tilesInit1);
			break;
	}

	//=== reset the empire to move first (copy by val, so we can maintain the original dataset for later replication)
	turnStatus = CloneObject(turnStatusInit);

	//=== print the map number
	if (typeof mapText !== "undefined")
		mapText.destroy(true, true);

	//mapText = game.add.bitmapText(950, 770, 'jediFontBlue', 'level ' + gameBoard + ' of ' + mapCount, 32);
}
//========================== text ================================================
function ShowVictoryText(victoriousFaction, delay) {

	var victoryText1;
	var victoryText2;

	turnStatus.victory = true;

	//=== set all remaining pieces off
	turnStatus.currentTurnFaction = 'none';
	InitGameboard();

	//=== show victory text, then fade out
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
		victoryText1 = game.add.bitmapText(0.2 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', victoriousFaction, 256);
		victoryText2 = game.add.bitmapText(0.2 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', 'victory!', 192);

		var tweenVictoryText1 = game.add.tween(victoryText1);
		tweenVictoryText1.to({ alpha: 0.6 }, 5000, Phaser.Easing.Linear.None, false, 0);
		tweenVictoryText1.start();

		var tweenVictoryText2 = game.add.tween(victoryText2);
		tweenVictoryText2.to({ alpha: 0.6 }, 5000, Phaser.Easing.Linear.None, false, 0);
		tweenVictoryText2.start();

		if (victoriousFaction == 'empire')
			audioEmpireWin.play('', 0, 1);

		if (victoriousFaction == 'rebel')
			audioRebelWin.play('', 0, 1);
	});

	//=== reset game
	game.time.events.add(Phaser.Timer.SECOND * (delay + 5), function () {
		victoryText1.destroy();
		victoryText2.destroy();
		InitTiles();
		FlipFactionTurn();
		InitBackgound();
		InitGameboard();
		ShowBattleOfHothText(0);
	});
}
//==========================
function ShowResultText(font, delay, text, x, y) {

	var hitText;
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
	    hitText = game.add.bitmapText(x, y - (isoBaseSize * 0.5), font, text, 128);

	    var tweenHitText = game.add.tween(hitText);
	    tweenHitText.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 0);
		tweenHitText.start();
	}, this);
}
//==========================
function ForceAttackText() {

	game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
		forceText1 = game.add.bitmapText(0.1 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', 'force', 256);
		forceText2 = game.add.bitmapText(0.1 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', ' hit!', 256);

		var tweenForceText1 = game.add.tween(forceText1);
		tweenForceText1.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 0);
		tweenForceText1.start();

		var tweenForceText2 = game.add.tween(forceText2);
		tweenForceText2.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 0);
		tweenForceText2.start();

	}, this);
}
//==========================
function ShowBattleOfHothText(delay) {

	var fadeTime = 2000;

	//audioBattleOfHoth.play(); //ste:todo: plays too late 1st time

	//=== show and fade text
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {

		battleOfHothText1 = game.add.bitmapText(0.1 * game.world.centerX, 0.3 * game.world.centerY, 'jediFontBlue', 'battle', 256);
		battleOfHothText2 = game.add.bitmapText(0.1 * game.world.centerX, 0.8 * game.world.centerY, 'jediFontBlue', '   of', 256);
		battleOfHothText3 = game.add.bitmapText(0.1 * game.world.centerX, 1.3 * game.world.centerY, 'jediFontBlue', ' hoth', 256);

		var tweenBattleOfHothText1 = game.add.tween(battleOfHothText1);
		tweenBattleOfHothText1.to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, false, 0);
		tweenBattleOfHothText1.start();

		var tweenBattleOfHothText2 = game.add.tween(battleOfHothText2);
		tweenBattleOfHothText2.to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, false, 0);
		tweenBattleOfHothText2.start();

		var tweenBattleOfHothText3 = game.add.tween(battleOfHothText3);
		tweenBattleOfHothText3.to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, false, 0);
		tweenBattleOfHothText3.start();

	});
	//=== destroy text
	game.time.events.add(Phaser.Timer.SECOND * (fadeTime), function () {
		battleOfHothText1.destroy();
		battleOfHothText2.destroy();
		battleOfHothText3.destroy();
	});
}
//========================== animations ================================================
function AnimateForceAttack(faction) {

	var xFrom;
	var yFrom;
	var xTo;
	var yTo;
	var forceAttack;
	var forceAttackFaction;

	if (faction == 'rebel') {
		forceAttackFaction = 'rebel_force_attack';
		xFrom = 0;
		yFrom = -0.25 * game.world.height;
		xTo = 1.25 * game.world.width;
		yTo = 1.25 * game.world.height;
		audioRebelForceAttack.play('', 0, 1);
	}
	else {
		forceAttackFaction = 'empire_force_attack';
		xFrom = 0.2 * game.world.width;
		yFrom = -0.25 * game.world.height;
		xTo = -0.75 * game.world.width;
		yTo = 1 * game.world.height;
		audioEmpireForceAttack.play('', 0, 1);
	}
	forceAttack = game.add.sprite(xFrom, yFrom, 'hothSprites', forceAttackFaction);
	forceAttack.scale.setTo(2, 2);

	var tweenForceAttack = game.add.tween(forceAttack);
	tweenForceAttack.to({ x: xTo, y: yTo }, 2000, Phaser.Easing.Linear.None, false);
	tweenForceAttack.start();
}
//==========================
function AnimateMicrofigEject(sprite) {

    var x = sprite.xDestination - isoBaseSize;
    var y = sprite.yDestination;
    var minifig = game.add.sprite(x, y, 'hothSprites', tiles[sprite.xTo][sprite.yTo][3][10]);
    var xA =  100;
    var xB =  250;
	if (Math.floor(Math.random() * 2) == 1) {
	    xA =  - 100;
	    xB =  - 250;
	}

	var tweenProjectile = game.add.tween(minifig);
	tweenProjectile.to({
        x: [x, x + xA, x + xB],
        y: [y, y - 300, y - 100]
    }, 3000, function (k) {
        return parabolicEasing(k);
    }, false);
	tweenProjectile.start();

    var tweenDisappear = game.add.tween(minifig);
    tweenDisappear.to({ alpha: 0 }, 2500, Phaser.Easing.Linear.None, false, 0);    
    tweenDisappear.start();
}

//==========================
function parabolicEasing(k) {

    var s;
    var a = 0.2;
    var p = 1.2;

    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) {
        a = 0.5; s = p / 4;
    }
    else {
       s = p * Math.asin(1 / a) / (2 * Math.PI);
    }
    return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
}
//==========================
function AnimateXwingSquad() {
	var xwingSquad = game.add.sprite((1.5 * game.world.width), (0.6 * game.world.height), 'hothSprites', 'xwing_squad');
	xwingSquad.scale.setTo(0.4, 0.4);
	audioXwingSquad.play('', 0, 0.2);

	var tweenXwingSquad = game.add.tween(xwingSquad);
	tweenXwingSquad.to({ x: 0.3 * game.world.width, y: (-0.5 * game.world.centerY) }, 2000, Phaser.Easing.Linear.None, false);
	tweenXwingSquad.start();
}
//==========================
function AnimateTieFighter() {
	var tieFighter = game.add.sprite((1.5 * game.world.width), 0, 'hothSprites', 'tie_fighter');
	tieFighter.scale.setTo(0.7, 0.7);
	audioTieFighter.play('', 0, 0.2);

	var tweenTieFighter = game.add.tween(tieFighter);
	tweenTieFighter.to({ x: 0.8 * game.world.centerX, y: game.world.height }, 2500, Phaser.Easing.Linear.None, false);
	tweenTieFighter.start();
}
//==========================
function AnimateViperDroid() {
	var viperDroid = game.add.sprite(-100, (0.6 * game.world.centerY), 'hothSprites', 'viper_droid');
	viperDroid.scale.setTo(0.4, 0.4);
	audioViperDroid.play('', 0, 0.2);

	var tweenViperDroid = game.add.tween(viperDroid);
	tweenViperDroid.to({ x: (1.5 * game.world.centerX), y: (1.25 * game.world.height) }, 12000, Phaser.Easing.Linear.None, false);
	tweenViperDroid.start();
}
//==========================
function AnimateFactionFlip(turnCount) {

	DestroyStarfield();

	//=== move 1 of 2
	if (turnCount == 1) {
		//=== shrink and fade current factions first badge
		if (turnStatus.currentTurnFaction == 'rebel') {
		    game.add.tween(rebelBadge_1.scale).to({ x: 0.2, y: 0.2 }, 200, Phaser.Easing.Back.Out, true, 300);
		    game.add.tween(rebelBadge_1).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
		    game.add.tween(rebelBadge_1).to({ x: (game.world.width - 360), y: 30 }, 200, Phaser.Easing.Back.Out, true, 300);
		}
		else if (turnStatus.currentTurnFaction == 'empire') {
		    game.add.tween(empireBadge_1.scale).to({ x: 0.2, y: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
		    game.add.tween(empireBadge_1).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
		    game.add.tween(empireBadge_1).to({ x: (game.world.width - 210), y: 30 }, 500, Phaser.Easing.Back.Out, true, 300);
		}

		//=== sound
		//game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
		//	audioFactionFlipOne.play('', 0, 1);
		//});
	}
	//=== move 2 of 2 
	if (turnCount == 0) {
		//=== grow and unfade new factions first and second
		//=== shrink and fade old factions second badge
		if (turnStatus.currentTurnFaction == 'rebel') {
			turnStatus.currentTurnFaction = 'empire';
			game.add.tween(empireBadge_1.scale).to({ x: 0.3, y: 0.3 }, 200, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_1).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_1).to({ x: (game.world.width - 220), y: 20 }, 200, Phaser.Easing.Back.Out, true, 300);

			game.add.tween(empireBadge_2.scale).to({ x: 0.3, y: 0.3 }, 200, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_2).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_2).to({ x: (game.world.width - 120), y: 20 }, 200, Phaser.Easing.Back.Out, true, 300);

			game.add.tween(rebelBadge_1.scale).to({ x: 0.2, y: 0.2 }, 200, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_1).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_1).to({ x: (game.world.width - 360), y: 30 }, 200, Phaser.Easing.Back.Out, true, 300);

			game.add.tween(rebelBadge_2.scale).to({ x: 0.2, y: 0.2 }, 200, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_2).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_2).to({ x: (game.world.width - 460), y: 30 }, 200, Phaser.Easing.Back.Out, true, 300);
		}
		else if (turnStatus.currentTurnFaction == 'empire') {
			turnStatus.currentTurnFaction = 'rebel';
			game.add.tween(rebelBadge_1.scale).to({ x: 0.3, y: 0.3 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_1).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_1).to({ x: (game.world.width - 370), y: 20 }, 500, Phaser.Easing.Back.Out, false, 300);

			game.add.tween(rebelBadge_2.scale).to({ x: 0.3, y: 0.3 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_2).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(rebelBadge_2).to({ x: (game.world.width - 470), y: 20 }, 500, Phaser.Easing.Back.Out, true, 300);

			game.add.tween(empireBadge_1.scale).to({ x: 0.2, y: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_1).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_1).to({ x: (game.world.width - 210), y: 30 }, 500, Phaser.Easing.Back.Out, true, 300);

			game.add.tween(empireBadge_2.scale).to({ x: 0.2, y: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_2).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
			game.add.tween(empireBadge_2).to({ x: (game.world.width - 110), y: 30 }, 500, Phaser.Easing.Back.Out, true, 300);
		}

		//=== sound
		game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
			audioFactionFlipTwo.play('', 0, 1);
		});

		turnStatus.factionFlipBounce = true;
	}
}
//==========================
function DestroyStarfield() {
	if (typeof starfieldWindow !== "undefined")
		starfieldWindow.destroy(true, true);

	if (typeof starfieldPiece !== "undefined")
		starfieldPiece.destroy(true, true);

	if (typeof starfieldRange !== "undefined")
		starfieldRange.destroy(true, true);

	if (typeof starfieldHeart4 !== "undefined")
		starfieldHeart4.destroy(true, true);

	if (typeof starfieldHeart3 !== "undefined")
		starfieldHeart3.destroy(true, true);

	if (typeof starfieldHeart2 !== "undefined")
		starfieldHeart2.destroy(true, true);

	if (typeof starfieldHeart1 !== "undefined")
		starfieldHeart1.destroy(true, true);
}
//==========================
function DrawStarfield(x, y) {

	DestroyStarfield();

	var heartScale = 0.5;
	var piece_current_health = tiles[x][y][3][2];
	var piece_initial_health = tiles[x][y][3][12];
	var heartSprite;

	starfieldWindow = game.add.sprite(15, 580, 'hothSprites', 'starfield');   //draw starfield background
	starfieldPiece = game.add.sprite(50, 600, 'hothSprites', tiles[x][y][3][0] + '_' + tiles[x][y][3][1]); //draw game piece icon
	starfieldRange = game.add.sprite(250, 620, 'hothSprites', tiles[x][y][3][11]);	//draw shoot pattern

	//=== draw health icons (red hearts & grey hearts)
	if (piece_initial_health >= 4) {
		heartSprite = (piece_current_health >= 4) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart4 = game.add.sprite(50, 650, 'hothSprites', heartSprite);
		starfieldHeart4.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >= 3) {
		heartSprite = (piece_current_health >= 3) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart3 = game.add.sprite(50, 675, 'hothSprites', heartSprite);
		starfieldHeart3.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >= 2) {
		heartSprite = (piece_current_health >= 2) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart2 = game.add.sprite(50, 700, 'hothSprites', heartSprite);
		starfieldHeart2.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >= 1) {
		heartSprite = (piece_current_health >= 1) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart1 = game.add.sprite(50, 725, 'hothSprites', heartSprite);
		starfieldHeart1.scale.setTo(heartScale, heartScale);
	}
}
//==========================
function AnimateProjectile(xFrom, yFrom, xTo, yTo, shottime, shotDirection, shotOutcome) {

	var shot = game.add.sprite(xFrom, yFrom, 'hothSprites', 'shoot_' + shotDirection);
	shot.scale.setTo(0.8, 0.8);
	var tweenShot = game.add.tween(shot);
	tweenShot.to({ x: xTo, y: yTo }, shottime, Phaser.Easing.Linear.None, false);
	

	if (shotOutcome > 0) {
		//=== destroy at the target
		game.time.events.add(Phaser.Timer.SECOND * (shottime * 0.001), function () {
			shot.destroy();
		});
	}
	else {
		//=== fades out passing the target				
	    tweenShot.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 0);
	}
	tweenShot.start();
}
//==========================	
function IncrementAnimationAndAudioCounters() {

	//==== snow particle field
	snowUpdateCounter++;
	if (snowUpdateCounter === snowUpdateInterval) {
		changeWindDirection();
		snowUpdateInterval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec
		snowUpdateCounter = 0;
	}

	//=== viper animation
	viperDroidUpdateCounter++;
	if (viperDroidUpdateCounter === viperDroidUpdateInterval) {
		AnimateViperDroid();
		viperDroidUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 60; // 0 - 20sec
		viperDroidUpdateCounter = 0;
	}

	//=== x wing squad animation
	xwingSquadUpdateCounter++;
	if (xwingSquadUpdateCounter === xwingSquadUpdateInterval) {
		AnimateXwingSquad();
		xwingSquadUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 40; // 0 - 20sec
		xwingSquadUpdateCounter = 0;
	}

	//=== tie fighter animation
	tieFighterUpdateCounter++;
	if (tieFighterUpdateCounter === tieFighterUpdateInterval) {
		AnimateTieFighter();
		tieFighterUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 40; // 0 - 20sec
		tieFighterUpdateCounter = 0;
	}

	//=== echobase sound
	echoBaseAmbientUpdateCounter++;
	if (echoBaseAmbientUpdateCounter === echoBaseAmbientUpdateInterval) {
		audioEchoBaseAmbient.play('', 0, 0.2);
		echoBaseAmbientUpdateInterval = (Math.floor(Math.random() * 80) + 20) * 100; // 0 - 20sec
		echoBaseAmbientUpdateCounter = 0;
	}

	//=== wind sound
	windUpdateCounter++;
	if (windUpdateCounter === windUpdateInterval) {
		audioWind.play('', 0, 0.2);
		windUpdateInterval = (Math.floor(Math.random() * 80) + 20) * 100; // 0 - 20sec
		windUpdateCounter = 0;
	}

	//=== taunTaun sound
	taunTaunUpdateCounter++;
	if (taunTaunUpdateCounter === taunTaunUpdateInterval) {
		audioTaunTaun.play('', 0, 0.5);
		taunTaunUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 60; // 0 - 20sec
		taunTaunUpdateCounter = 0;
	}
}

//========================== snow animation ================================================
function changeWindDirection() {

	var max = 60;
	var multi = Math.floor((max + 30) / 4);
	var frag = (Math.floor(Math.random() * 30) - multi);

	max = max + frag;

	if (max > 60) max = 60;
	if (max < -60) max = -60;

	setXSpeed(snowEmitter, max);
}

function setXSpeed(emitter, max) {
	game.debug.text("wind");
	emitter.setXSpeed(max - 20, max);
	emitter.forEachAlive(setParticleXSpeed, this, max);
}

function setParticleXSpeed(particle, max) {
	particle.body.velocity.x = max - Math.floor(Math.random() * 200);
}
//==========================================================================
function CloneObject(obj) {
	if (obj == null || typeof (obj) != 'object')
		return obj;

	var temp = new obj.constructor();
	for (var key in obj)
		temp[key] = CloneObject(obj[key]);

	return temp;
}