/*
 * Battle of Hoth - the Phaser game: loading assets, building the scene, and the per-frame update.
 * Loaded last: every other js/ file must be loaded before this one.
 */

var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'hoth', null, true, false);
var BasicGame = function (game) { };
BasicGame.Boot = function (game) { };

// sound name -> file in assets/audio
var SOUND_FILES = {
	audioPieceShootArmy: 'shoot_army',
	audioPieceShootAtAt: 'shoot_atat',
	audioPieceShootAtSt: 'shoot_atst',
	audioPieceShootEmpireCannon: 'shoot_empire_cannon',
	audioPieceShootRebelCannon: 'shoot_rebel_cannon',
	audioPieceShootSpeeder: 'shoot_speeder',
	audioPieceShootTauntaun: 'shoot_tauntaun',
	audioPieceExplodeA: 'pieceExplodeA',
	audioPieceExplodeB: 'pieceExplodeB',
	audioPieceUp: 'pieceUp',
	audioPieceSlide: 'pieceSlide',
	audioWind: 'wind',
	audioRebelWin: 'rebelWin',
	audioEmpireWin: 'empireWin',
	audioViperDroid: 'viperdroid',     // the files are lower case (the web server is case-sensitive)
	audioEchoBaseAmbient: 'echoBaseAmbient',
	audioTaunTaun: 'tauntaun',
	audioRebelForceAttack: 'xWingFlyBy',
	audioEmpireForceAttack: 'tieFighterFlyBy',
	audioXwingSquad: 'xWingFlyBy',
	audioTieFighter: 'tieFighterFlyBy',
	audioBattleOfHoth: 'battleOfHoth',
	audioFactionFlipOne: 'factionFlipOne',
	audioFactionFlipTwo: 'factionFlipTwo'
};

BasicGame.Boot.prototype = {
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

		//=== sound effects
		Object.keys(SOUND_FILES).forEach(function (name) {
			game.load.audio(name, ['assets/audio/' + SOUND_FILES[name] + '.mp3']);
		});
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

		//=== background ice field
		game.add.tileSprite(0, 0, 1200, 800, 'background');
		game.add.bitmapText(10, 10, 'jediFontBlue', 'v2', 16);

		CreateSounds();

		//=== sprite groups, back to front
		isoGroupBackground = game.add.group();
		isoGroupIndicators = game.add.group();
		isoGroupPieces = game.add.group();
		isoGroupHotspots = game.add.group();

		InitTiles();
		ShowBattleOfHothText(0);
		InitMenu();
		InitBackgound();
		InitGameboard();

		cursorPos = new Phaser.Plugin.Isometric.Point3(); //=== 3D position of the pointer

		//=== whose turn: badges top right
		UI.rebelBadge_1 = game.add.sprite(game.world.width - 470, 20, 'hothSprites', 'rebel_badge');
		UI.rebelBadge_2 = game.add.sprite(game.world.width - 370, 100, 'hothSprites', 'rebel_badge');
		UI.empireBadge_1 = game.add.sprite(game.world.width - 220, 20, 'hothSprites', 'empire_badge');
		UI.empireBadge_2 = game.add.sprite(game.world.width - 120, 100, 'hothSprites', 'empire_badge');

		LoadRobotSettings();
		DrawRobotLabels();

		UI.fireAnimation = game.add.sprite(-300, -300, 'fireSprites');
		UI.fireAnimation.animations.add('flames');

		CreateSnow();

		FlipFactionTurn();
		InitGameboard();

		//=== remove the loading screen
		document.getElementById("loader").style.display = "none";
	},

	update: function () {
		IncrementAnimationAndAudioCounters();
		game.iso.unproject(game.input.activePointer.position, cursorPos);
	}
};

function CreateSounds() {
	var sound = function (name) { return game.add.audio(name); };

	Sounds.pieceUp = sound('audioPieceUp');
	Sounds.pieceSlide = sound('audioPieceSlide');
	Sounds.wind = sound('audioWind');
	Sounds.rebelWin = sound('audioRebelWin');
	Sounds.empireWin = sound('audioEmpireWin');
	Sounds.viperDroid = sound('audioViperDroid');
	Sounds.echoBaseAmbient = sound('audioEchoBaseAmbient');
	Sounds.taunTaun = sound('audioTaunTaun');
	Sounds.rebelForceAttack = sound('audioRebelForceAttack');
	Sounds.empireForceAttack = sound('audioEmpireForceAttack');
	Sounds.xwingSquad = sound('audioXwingSquad');
	Sounds.tieFighter = sound('audioTieFighter');
	Sounds.battleOfHoth = sound('audioBattleOfHoth');
	Sounds.factionFlipOne = sound('audioFactionFlipOne');
	Sounds.factionFlipTwo = sound('audioFactionFlipTwo');

	Sounds.explode = {
		audioPieceExplodeA: sound('audioPieceExplodeA'),
		audioPieceExplodeB: sound('audioPieceExplodeB')
	};

	Sounds.shoot = {
		audioPieceShootArmy: sound('audioPieceShootArmy'),
		audioPieceShootAtAt: sound('audioPieceShootAtAt'),
		audioPieceShootAtSt: sound('audioPieceShootAtSt'),
		audioPieceShootEmpireCannon: sound('audioPieceShootEmpireCannon'),
		audioPieceShootRebelCannon: sound('audioPieceShootRebelCannon'),
		audioPieceShootSpeeder: sound('audioPieceShootSpeeder'),
		audioPieceShootTauntaun: sound('audioPieceShootTauntaun')
	};
}

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
