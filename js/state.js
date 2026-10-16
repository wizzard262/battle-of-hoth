/*
 * Battle of Hoth - game state
 */

/*
 * The board: tiles[x][y] (see CreateTiles in board.js)
 *   tileName     board tile: bridges north, east, south, west as '1010' etc.; '0000' = no square
 *   piece        the piece on it (see Piece in data.js), or null
 *   baseFaction  'rebel' / 'empire' if this square is part of that side's base
 */
var tiles;

// Whose turn it is. Each side gets two goes (moveCounter 1 then 0) before the turn passes.
//   currentTurnFaction 'rebel', 'empire', or 'none' once someone has won
//   factionFlipBounce  the new side's pieces are bouncing to show it's their turn
var turnStatus;

var isoBaseSize = 128;      // size of a board square
var cursorPos;              // 3D position of the pointer on the board

//=== sprite groups, back to front
var isoGroupBackground;     // the board squares
var isoGroupIndicators;     // move and shot-pattern indicators (under the pieces)
var isoGroupPieces;         // the pieces (and the red target markers)
var isoGroupHotspots;       // invisible tap areas on shootable pieces

var moveIndicatorSprites;
var shootIndicatorSprites;
var mapText;                // 'level X of Y' (not currently shown)

// Sounds, created in create()
var Sounds = {
	pieceUp: null,
	pieceSlide: null,
	wind: null,
	battleOfHoth: null,
	rebelWin: null,
	empireWin: null,
	viperDroid: null,
	echoBaseAmbient: null,
	taunTaun: null,
	rebelForceAttack: null,
	empireForceAttack: null,
	xwingSquad: null,
	tieFighter: null,
	factionFlipOne: null,
	factionFlipTwo: null,
	explode: {},            // by piece explodeSound name
	shoot: {}               // by piece shootSound name
};

// Background volumes (0-1), set so each lands at about the loudness noted, measured on the loudest
// 0.4s of the file. Shots and explosions play at 1 (-5 to -12 dB) and are the loudest thing.
var VOLUME = {
	xwingSquad: 0.7,        // -18 dB  fly-overs: clearly heard, under the shots
	tieFighter: 0.55,       // -19 dB
	viperDroid: 1,          // -20 dB
	taunTaun: 0.5,          // -18 dB
	echoBase: 0.5,          // -24 dB  ice base hum, a bed under everything
	wind: 0.5               // -22 dB
};

// Display objects
var UI = {
	fireAnimation: null,
	rebelBadge_1: null,     // the badges top right show whose turn it is
	rebelBadge_2: null,
	empireBadge_1: null,
	empireBadge_2: null,

	// the info window (bottom left) for the selected piece
	starfieldWindow: undefined,
	starfieldPiece: undefined,
	starfieldRange: undefined,
	starfieldHeart4: undefined,
	starfieldHeart3: undefined,
	starfieldHeart2: undefined,
	starfieldHeart1: undefined,

	snowEmitter: null,
	robotLabels: {},        // 'robot' under the badges of a side the computer plays
	menu: undefined,
	robotMenuRow: null,     // the menu's robot players row (see menu.js)
	instructions: undefined
};

var Settings = {
	snowToggle: true,
	showInstructionScreen: false,
	robot: { rebel: false, empire: false }  // which sides the computer plays (see bot.js)
};
