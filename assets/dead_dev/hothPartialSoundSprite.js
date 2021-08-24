var moveIndicatorSprites;
var shootIndicatorSprites;
var selectedSprite;

var tiles;
var mapText; //stores the text 'level X of Y'
var nameText; // my name

//=== dynamic global sprites
var fireAnimation;

var rebelBadge;
var empireBadge;

var starfieldPiece;
var starfieldRange;
var starfieldWindow;
var starfieldHeart4;
var starfieldHeart3;
var starfieldHeart2;
var starfieldHeart1;

var audioSprite;

//var audioPieceUp;
//var audioPieceSlide;
var audioPieceShoot;
var audioWind;
var audioBattleOfHoth;
//var audioRebelWin;
//var audioEmpireWin;
var audioViperDroid;      
var audioTaunTaun;
var audioRebelForceAttack;
var audioEmpireForceAttack;
var audioXwingSquad;
var audioTieFighter;
//var audioFactionFlipRebel;
//var audioFactionFlipEmpire;

//var soundHolderExplode;
var soundHolderShoot;

var snowEmitter;
var snowToggle = false;

var menu;
var instructions;
var showInstructionScreen = false;

//=== animation & ambient sound loop counters (microsecs: 60 per sec)
var snowUpdateInterval = 60;
var snowUpdateCounter = 0;
var viperDroidUpdateInterval = 600;
var viperDroidUpdateCounter = 0;
var xwingSquadUpdateInterval = 40;
var xwingSquadUpdateCounter = 0;
var tieFighterUpdateInterval = 100;
var tieFighterUpdateCounter = 0;
var viperDroidUpdateCounter = 0;
var echoBaseAmbientUpdateInterval = 1200;
var echoBaseAmbientUpdateCounter = 0;
var taunTaunUpdateInterval = 1800;
var taunTaunUpdateCounter = 0;
		  
var isoGroupBackground;   // for the background pieces (game board, goes at the back)
var isoGroupIndicators;   // move and attack indicators (to go under pieces)
var isoGroupPieces;       // actual game pieces (contains the red shoot indicator too
var isoGroupHotspots; 
var cursorPos;
var cursor;
var isoBaseSize = 128;
var z = 0;
var alphaTransparency = 0.4;
var turnStatus;

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
		game.load.audio('audioSprite', 'assets/audio/sprite128.mp3');
	
		
		game.load.audio('audioPieceShootArmy', ['assets/audio/shoot_army.mp3']);
		game.load.audio('audioPieceShootAtAt', ['assets/audio/shoot_atat.mp3']);
		game.load.audio('audioPieceShootAtSt', ['assets/audio/shoot_atst.mp3']);
		game.load.audio('audioPieceShootEmpireCannon', ['assets/audio/shoot_empire_cannon.mp3']);
		game.load.audio('audioPieceShootRebelCannon', ['assets/audio/shoot_rebel_cannon.mp3']);
		game.load.audio('audioPieceShootSpeeder', ['assets/audio/shoot_speeder.mp3']);
		game.load.audio('audioPieceShootTauntaun', ['assets/audio/shoot_tauntaun.mp3']);
		//game.load.audio('audioPieceExplodeA', ['assets/audio/pieceExplodeA.mp3']);
		//game.load.audio('audioPieceExplodeB', ['assets/audio/pieceExplodeB.mp3']);	
		//game.load.audio('audioPieceUp', ['assets/audio/pieceUp.mp3']);
		//game.load.audio('audioPieceSlide', ['assets/audio/pieceSlide.mp3']);
		game.load.audio('audioWind', ['assets/audio/wind.mp3']);
		//game.load.audio('audioRebelWin', ['assets/audio/rebelWin.mp3']);
		//game.load.audio('audioEmpireWin', ['assets/audio/empireWin.mp3']);
		game.load.audio('audioViperDroid', ['assets/audio/viperDroid.mp3']);
		game.load.audio('audioTaunTaun', ['assets/audio/taunTaun.mp3']);
		game.load.audio('audioRebelForceAttack', ['assets/audio/xWingFlyBy.mp3']);
		game.load.audio('audioEmpireForceAttack', ['assets/audio/tieFighterFlyBy.mp3']);
		game.load.audio('audioXwingSquad', ['assets/audio/xWingFlyBy.mp3']);
		game.load.audio('audioTieFighter', ['assets/audio/tieFighterFlyBy.mp3']);
		game.load.audio('audioBattleOfHoth', ['assets/audio/battleOfHoth.mp3']);
		//game.load.audio('audioFactionFlipRebel', ['assets/audio/factionFlipRebel.mp3']);
		//game.load.audio('audioFactionFlipEmpire', ['assets/audio/factionFlipEmpire.mp3']);
	},
	
	create: function () {

		
audioSprite = game.add.audio('audioSprite');
audioSprite.allowMultiple = true;

 audioSprite.addMarker('audioEchoBaseAmbient', 2.6, 16.7);
 audioSprite.addMarker('audioEmpireWin', 19.3, 6.6);
 audioSprite.addMarker('audioFactionFlipEmpire', 25.9, 0.5);
 audioSprite.addMarker('audioFactionFlipRebel', 26.5, 0.5);
 audioSprite.addMarker('audioPieceExplodeA', 27.1, 6.3);
 audioSprite.addMarker('audioPieceExplodeB', 33.4, 2.5);
 audioSprite.addMarker('audioPieceSlide', 35.9, 0.3);
 audioSprite.addMarker('audioPieceUp', 36.3, 0.18);
 audioSprite.addMarker('audioRebelWin', 36.6, 6.6);
	
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth =480;
		this.scale.minHeight = 320;
		this.scale.maxWidth = 1152;
		this.scale.maxHeight =768;
		this.scale.refresh();

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		//=== show background icefield / snow
		game.add.tileSprite(0, 0, 1200, 800, 'background');
		
		game.add.bitmapText(10, 10, 'jediFontBlue', 'v1', 16);
		
		//=== sounds
		//audioPieceUp = game.add.audio('audioPieceUp');
		//audioPieceSlide = game.add.audio('audioPieceSlide');		
		audioWind = game.add.audio('audioWind');
		//audioRebelWin = game.add.audio('audioRebelWin');
		//audioEmpireWin = game.add.audio('audioEmpireWin');
		audioViperDroid = game.add.audio('audioViperDroid');		
		audioTaunTaun = game.add.audio('audioTaunTaun');
		audioRebelForceAttack = game.add.audio('audioRebelForceAttack');
		audioEmpireForceAttack = game.add.audio('audioEmpireForceAttack');
		audioXwingSquad = game.add.audio('audioXwingSquad');
		audioTieFighter = game.add.audio('audioTieFighter');
		audioBattleOfHoth = game.add.audio('audioBattleOfHoth');
		//audioFactionFlipRebel = game.add.audio('audioFactionFlipRebel');
		//audioFactionFlipEmpire = game.add.audio('audioFactionFlipEmpire');
		
	//	soundHolderExplode = {
	//		audioPieceExplodeA: game.add.audio('audioPieceExplodeA'),
	//		audioPieceExplodeB: game.add.audio('audioPieceExplodeB'),
	//	};
		
		soundHolderShoot = {
			audioPieceShootArmy: game.add.audio('audioPieceShootArmy'),
			audioPieceShootAtAt: game.add.audio('audioPieceShootAtAt'),
			audioPieceShootAtSt: game.add.audio('audioPieceShootAtSt'),
			audioPieceShootEmpireCannon: game.add.audio('audioPieceShootEmpireCannon'),
			audioPieceShootRebelCannon: game.add.audio('audioPieceShootRebelCannon'),
			audioPieceShootSpeeder: game.add.audio('audioPieceShootSpeeder'),
			audioPieceShootTauntaun: game.add.audio('audioPieceShootTauntaun'),
		};
		
		//=== sprite groups
		isoGroupBackground = game.add.group(); 		//=== gameboard
		isoGroupIndicators = game.add.group(); 		//=== movement indicators and inactive shot pattern indicators
		isoGroupPieces = game.add.group();     		//=== game pieces
		isoGroupHotspots = game.add.group();     		//=== hotspots 
		InitTiles();
		ShowBattleOfHothText(0);
		InitMenu();
		InitBackgound();
		InitGameboard();	
	
		cursorPos = new Phaser.Plugin.Isometric.Point3();		// Provide a 3D position for the cursor

		rebelBadge = game.add.sprite(game.world.width-370, 20, 'hothSprites','rebel_badge');
		empireBadge = game.add.sprite(game.world.width-220, 20, 'hothSprites','empire_badge');   
      
		fireAnimation = game.add.sprite(-300, -300, 'fireSprites');
		fireAnimation.animations.add('flames');

		//=== snow
		snowEmitter = game.add.emitter(game.world.centerX, -32, 600);
		snowEmitter.makeParticles('snowflakeSprites', [0, 1, 2, 3, 4, 5]);
		snowEmitter.maxParticleScale = 0.6;
		snowEmitter.minParticleScale = 0.2;
		snowEmitter.setYSpeed(10, 100);
		snowEmitter.gravity = 0;
		snowEmitter.width = game.world.width * 1.5;
		snowEmitter.minRotation = 0;
		snowEmitter.maxRotation = 40;
				
		//=== play wind on loop)
		audioWind.play('', 0 , 0.015,true);		
		
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
	},
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
//=================== tile functions =======================

function InitBackgound() {

	//=== clear the board of old ground pieces
	isoGroupBackground.destroy(true,true);

	for (var x = 0; x < tiles.length; x += 1) {
		for (var y = 0; y < tiles[0].length; y += 1) {

			//=== draw the gameboard (spaces)
			var tileName = tiles[x][y][2];
			var tile = SetSprite(x, y, 'hothSprites', tileName, isoGroupBackground);
		}
	}
}

function InitMenu() {
	//control_panel
	var controlPanel = game.add.sprite(5, 5, 'hothSprites', 'control_panel');
	controlPanel.scale.setTo(0.5, 0.5);
	controlPanel.inputEnabled = true;  //  Enables all kind of input actions on this image (click, etc)
	controlPanel.input.useHandCursor = true;

	//============================ EVENT (click control panel) ============================
	controlPanel.events.onInputDown.add(function(controlPanel) {

			game.paused = true;
			menu = game.add.sprite(0, 0, 'hothSprites', 'menu');
			menu.scale.setTo(2, 2);
			menu.inputEnabled = true; //  Enables all kind of input actions on this image (click, etc)
			menu.input.useHandCursor = true;

			// Add a input listener that can help us return from being paused
			game.input.onDown.add(unpause, self);

			function unpause(event) {

			// Only act if paused and mapmenu is not up
				if (showInstructionScreen==false && game.paused && (typeof menu != "undefined" || menu != null) && (typeof instructions == "undefined" || instructions == null)) {

				//corners of the menu
				var x1 = 0;
				var x2 = 512;
				var y1 = 0;
				var y2 = 640;

				// Check if the click was inside the menu
				if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {

					// Get menu local coordinates for the click (only need y)
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
						window.location.href = "https://bitbucket.org/wizzard262/battleofhoth";
					}

				} else {
					// Remove the menu and unpause
					menu.destroy();
					game.paused = false;
				}
			}
		};
		
	}, this);
	//============================ END EVENT ============================
}

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

function  InitGameboard(xIn, yIn) {

	var returnSprite;

	isoGroupIndicators.destroy(true, true);
	isoGroupPieces.destroy(true, true);
	isoGroupHotspots.destroy(true, true);

	for (var x = 0; x < tiles.length; x += 1) {
		for (var y = 0; y < tiles[0].length; y += 1) {

			//=== if this grid cell contains a piece, show it
			if (tiles[x][y][3] != null) {

				var sprite = InitPiece(x, y);

				//==return the correct sprite
				if (xIn != null && yIn != null && x == xIn && y == yIn) {
					returnSprite = sprite;
				}				
			}
		}
	}
	return returnSprite;
}

function InitPiece(x, y) {

	var sprite = SetSprite(x, y, 'hothSprites', GetPieceTileName(x, y), isoGroupPieces);
	var scale = tiles[x][y][3][7];
	sprite['xx'] = x;
	sprite['yy'] = y;

	if(tiles[x][y][3][0] == turnStatus.currentTurnFaction){
		
		sprite.inputEnabled = true;  //  Enables all kind of input actions on this image (click, etc)
		sprite.input.useHandCursor = true;
		
		//============================ EVENT (select piece) ============================
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
		//============================ END EVENT ============================
	}
	
	return sprite;
}

function SelectPiece(sprite)
{	
	var newSprite = InitGameboard(sprite.xx, sprite.yy);

	moveIndicatorSprites = SetMoveIndicators(sprite, moveArray);
	shootIndicatorSprites = SetShootIndicators(sprite, tiles[sprite.xx][sprite.yy][3][5]);

	audioSprite.play('audioPieceUp');
	
	//===lift selected piece
	game.add.tween(newSprite).to({ isoZ: 20 }, 50, Phaser.Easing.Bounce.In, true).to({ isoZ: 5 }, 200, Phaser.Easing.Bounce.Out, true);

	DrawStarfield(sprite.xx,sprite.yy);		
}

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

function ShootPiece(sprite) {
	
	FlipFactionTurn();	
	sprite.xDestination = sprite.x + isoBaseSize ;
	sprite.yDestination = sprite.y + (0.5 * isoBaseSize) - (0.5 * isoBaseSize);
	
	//==reset the direction of the shooting piece and redraw it 
	tiles[sprite.xFrom][sprite.yFrom][3][3] =  GetDirection(sprite.xFrom, sprite.yFrom, sprite.xTo, sprite.yTo);
	var spriteNew = SetSprite(sprite.xFrom, sprite.yFrom, 'hothSprites', GetPieceTileName(sprite.xFrom, sprite.yFrom), isoGroupPieces);
	
	InitGameboard();	
	
	var debugString = "";			
	var shotOutcome = GetShotOutcome();
	var isForceHit = tiles[sprite.xFrom][sprite.yFrom][3][6] && (shotOutcome == 2);
	var isShootsDiagonal = tiles[sprite.xFrom][sprite.yFrom][3][4];
	
	ShowProjectile(sprite, shotOutcome, isShootsDiagonal);
	
	if (isForceHit){
		AnimateForceAttack(tiles[sprite.xFrom][sprite.yFrom][3][0]); // force hit! instant kill!
		ForceAttackText();
	}
	else{
		if(shotOutcome == 0)
			ShowResultText('jediFontBlue', 0.6, 'miss!', sprite.x, sprite.y); //HIT! or MISS!
		else
			ShowResultText('jediFontYellow', 0.6, 'hit!', sprite.x, sprite.y); //HIT! or MISS!
	}

	//=== reduce health of the piece
	if (shotOutcome > 0) {

		var health = tiles[sprite.xTo][sprite.yTo][3][2] -= 1;

		if (isForceHit)
			tiles[sprite.xTo][sprite.yTo][3][2] = 0;

		health = tiles[sprite.xTo][sprite.yTo][3][2];

		var tileName = GetPieceTileName(sprite.xTo, sprite.yTo).replace("_4", "_0").replace("_3", "_0").replace("_2", "_0").replace("_1", "_0");
		
		//=== if piece was killed
		if (health <= 0) {

			audioSprite.play([tiles[sprite.xFrom][sprite.yFrom][3][9]]);

			//destroy piece data in titles grid
			tiles[sprite.xTo][sprite.yTo][3] = null;

			//== explosion sprite so appears after the board reset
			game.time.events.add(Phaser.Timer.SECOND * 0.6, function() {

				var destroyedVehicle = SetSprite(sprite.xTo, sprite.yTo, 'hothSprites', tileName, isoGroupIndicators);

				//== show flames over the killed vehicle
				fireAnimation.alpha = 1;
				fireAnimation.x = sprite.x + (isoBaseSize * 0.5);
				fireAnimation.y = sprite.y - (isoBaseSize * 0.5);
				fireAnimation.scale.setTo(2, 2);
				fireAnimation.animations.play('flames', 6, true);
				
				//isoGroupPieces.add(fireAnimation);
				//=== prevent overlap of fire in incorrect order
				//isoGroupPieces.sort('y', Phaser.Group.SORT_ASCENDING)
				
				//== fade the flames anim & destroyed vehicle
				game.add.tween(fireAnimation).to({ alpha: 0 }, 6000, Phaser.Easing.Linear.None, true, 0, 1000, true);
				game.add.tween(destroyedVehicle).to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None, true, 0, 1000, true);
			}, this);


			//==  refresh to clear explosion. remove fire from view
			game.time.events.add(Phaser.Timer.SECOND * 4, function() {
				fireAnimation.animations.stop('flames');
				fireAnimation.x = -300;
				fireAnimation.y = -300;
				InitGameboard();
			}, this);

		}
		else{
			//==  eject minifig
			game.time.events.add(Phaser.Timer.SECOND * 0.4, function() {
				AnimateMicrofigEject(sprite);
			}, this);			
		}
	}	
}

function MovePiece(sprite){

	FlipFactionTurn();	
	//==reset the direction of the shooting piece and redraw it 
	tiles[sprite.xFrom][sprite.yFrom][3][3] =  GetDirection(sprite.xFrom, sprite.yFrom, sprite.xTo, sprite.yTo);	

	//== move piece in tiles Grid
	tiles[sprite.xTo][sprite.yTo][3] = tiles[sprite.piece.xx][sprite.piece.yy][3];
	tiles[sprite.xFrom][sprite.yFrom][3] = null;

	var newSprite = InitGameboard(sprite['xTo'], sprite['yTo']);

	audioSprite.play('audioPieceSlide');

	// send it back to its old position so we can move it visibly,and put it on top of stack of tiles
	newSprite.isoX = isoBaseSize * sprite['xFrom'];
	newSprite.isoY = isoBaseSize * sprite['yFrom'];

	game.add.tween(newSprite)
		.to({ isoZ: 20, isoX: (isoBaseSize * sprite['xTo']), isoY: (isoBaseSize * sprite['yTo']) }, 200, Phaser.Easing.Quadratic.InOut, true)
		.to({ isoZ: 0 }, 200, Phaser.Easing.Bounce.Out, true);
	
	CheckVictoryConditions(0);
}

function SetSprite(x, y, tileAtlas, tileName, group) {
	var tile = game.add.isoSprite(x * isoBaseSize, y * isoBaseSize, 0, tileAtlas, tileName, group);
	return tile;
}

function GetGameboardTileName(x, y) {
	return tiles[x][y][2];
}

function SetMoveIndicators(spritePiece, moves) {

	var sprite;
	var x = spritePiece.xx;
	var y = spritePiece.yy;
	var faction = tiles[x][y][3][0];
	var sprites = [SetSprite(x, y, 'hothSprites', faction + '_shooter', isoGroupIndicators)];

	for (var i = 0; i < moves.length; i++) {

		var xTo = x + moves[i][0];
		var yTo = y + moves[i][1];

		var direction = GetDirection(x, y, xTo, yTo) ;
		
		if (IsViableMove(x, y, xTo, yTo, tiles.length, tiles[0].length, direction)) {

			var tileName =  "moveable_" + direction;

			sprite = SetSprite(xTo, yTo, 'hothSprites', tileName, isoGroupIndicators);

			sprite['xTo'] = xTo;
			sprite['yTo'] = yTo;
			sprite['direction'] = direction;
			sprite['xFrom'] = x;
			sprite['yFrom'] = y;
			sprite['piece'] = spritePiece;

			sprite.inputEnabled = true; //  Enables all kind of input actions on this image (click, etc)
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
			//============================ END EVENT ============================

			sprite.tint = 0xCCCCCC;
		

			//	sprites.push(sprite);
		}
	}
	//return sprites;
}

function SetShootIndicators(spritePiece, shootArray) {

	var sprites = [];
	var xFrom = spritePiece.xx;
	var yFrom = spritePiece.yy;
	var tileName = tiles[xFrom][yFrom][2];

	for (var i = 0; i < shootArray.length; i++) {			//=== 4 directions

		shotAvailable = true;

		//=== X shooting slots per direction
		for (var j = 0; j < shootArray[i].length; j++) {

			var xTo = xFrom + shootArray[i][j][0];
			var yTo = yFrom + shootArray[i][j][1];
			var direction = GetDirection(xFrom, yFrom, xTo, yTo);
			var shot = IsViableShot(xFrom, yFrom, xTo, yTo, tiles.length, tiles[0].length);

			//== if not unviable (off the board)
			if (shot != 0) {

				if (shot == 1 && shotAvailable) {						
					
								
					//=== show the target 
					var spriteShootIndicator = SetSprite(xTo, yTo, 'hothSprites', "shootable_on", isoGroupPieces);	
						
					//=== redraw the piece with events for shootable
					var sprite = SetSprite(xTo, yTo, 'hothSprites', GetPieceTileName(xTo, yTo), isoGroupPieces);
					var spriteShootable = SetSprite(xTo, yTo, 'hothSprites', 'blankTile', isoGroupHotspots);

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
						game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
																																	
							InitGameboard();
								
						}, this);							  
							
						CheckVictoryConditions(3); 						
					}, this);
					//============================ END EVENT ============================

					shotAvailable = false;
				}
				else {																
					var sprite = SetSprite(xTo, yTo, 'hothSprites', "shootable_off", isoGroupIndicators);
				}
				//end this line of firing possibility as current faction member blocks firing beyond this square
				if(tiles[xTo][yTo][3]  != null)
				{
					shotAvailable = false;
				}

				sprites.push(sprite);
			}
		}
	}

	return sprites;
}

// is a move from (xFrom, yFrom) to (xTo, yTo) allowed
function IsViableMove(xFrom, yFrom, xTo, yTo, xMax, yMax, direction) {

	var bridgePresent;

	// destination grid cell is empty AND  destination grid cell is on the board area AND there is a BRIDGE between the 2 board pieces allowing this move
	if (yTo >= 0 && xTo >= 0 && yTo < yMax && xTo < xMax
		&& tiles[xTo][yTo][3] == null
		)
	{	
		switch(direction){

			case "up":
				if(bridgePresent = tiles[xFrom][yFrom][2].substring(0, 1) == 1)
					return true;
				break;
	
			case "right":
				if(bridgePresent = tiles[xFrom][yFrom][2].substring(1, 2) == 1)
					return true;
				break;
	
			case "down":
				if(bridgePresent = tiles[xFrom][yFrom][2].substring(2, 3) == 1)
					return true;	
				break;
	
			case "left":
				if(bridgePresent = tiles[xFrom][yFrom][2].substring(3, 4) == 1)
					return true;	
				break;
		}

		return false;
	}
}

// is a shot from (xFrom, yFrom) to (xTo, yTo) allowed
function IsViableShot(xFrom, yFrom, xTo, yTo, xMax, yMax) {

	// destination grid cell exists on the board area and not a null cell
	if (yTo >= 0 && xTo >= 0 && yTo < yMax && xTo < xMax && tiles[xTo][yTo][2] != '0000') {
		
		if (tiles[xTo][yTo][3] != null	// destination grid cell is NOT empty (contains a gamepiece) 
			&& tiles[xTo][yTo][3][2] > 0	// and is not zero health
			&& tiles[xTo][yTo][3][0] != tiles[xFrom][yFrom][3][0]  // and not of the same faction (empire or rebel)	
			) 
		{
			return 1; //good shot
		}
		return 2; // reachable but not a good shot (another vehicle blocks or no target in square)
	}
	return 0; // unviable (negative coords)
}

function GetDirection(xFrom, yFrom, xTo, yTo) {
	if (xFrom >= xTo && yFrom == yTo)
		return "left";
	if (xFrom <= xTo && yFrom == yTo)
		return "right";
	if (xFrom == xTo && yFrom >= yTo)
		return "up";
	if (xFrom == xTo && yFrom <= yTo)
		return "down";
		
	//=== the riders (atst & tauntuan) as they shot diagonally will not fit any 4 of the above SHOOT directions
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
function GetShotOutcome() {
	return Math.floor(Math.random() * shootOutcomes.length);
}
function GetPieceTileName(x, y) {

	if (tiles[x][y][3] != null) {

		var piece = tiles[x][y][3];
		
		var factionName = piece[0];
		var pieceName = piece[1];
		var direction = piece[3];
		var health = piece[2];
		return factionName + "_" + pieceName + "_" + direction + "_"  + health;
	}
	return;
}

function ShowProjectile(sprite, shotOutcome , isShootsDiagonal) {

	var xFrom;
	var yFrom;
	var xTo;
	var yTo;
	var direction = sprite.direction;
	var shotDirection = direction;
	var shotOutcomeMutiplier = 0;
	var shottime = 500;
	
	//=== if missed make a longer shot that overshoots
	if(shotOutcome == 0)
		shotOutcomeMutiplier = 2; //=== overshoots by twice the distance between pieces
		
	//==get and play the correct shot sound
	soundHolderShoot[tiles[sprite.xFrom][sprite.yFrom][3][8]].play();

	switch(direction){

		//=== todo: tweak start and end points

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
	if(isShootsDiagonal){
		shotDirection += '_rider';
		
		switch(direction){

			//=== ste:todo: tweak start and end points
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

function CheckVictoryConditions(delay) {

	//===check need to prevent a 'double-victory' (due to overlapping isometric sprites)
	if(turnStatus.victory)
		return;
 
	rebelDead = true;
	empireDead = true;
	rebelBaseTaken = false;
	empireBaseTaken = false;

	for (var x = 0; x < tiles.length; x += 1) {
		for (var y = 0; y < tiles[0].length; y += 1) {



			if (tiles[x][y][3] != null && tiles[x][y][3][0] == 'empire') {
				empireDead = false;
				
				if (tiles[x][y][3][0] == 'empire' &&  tiles[x][y][4] == 'rebel')
					rebelBaseTaken = true;
			}
			
			if (tiles[x][y][3] != null && tiles[x][y][3][0] =='rebel') {
				rebelDead = false;
							
				if (tiles[x][y][3][0] == 'rebel' &&  tiles[x][y][4] == 'empire')
					empireBaseTaken = true;													
			}			
		}
	}

	if (empireDead || empireBaseTaken){ 
		ShowVictoryText('rebel', delay);
	}

	if (rebelDead || rebelBaseTaken) {
		ShowVictoryText('empire', delay);
	}
}

function FlipFactionTurn(){

	if (turnStatus.moveCounter == 1) {
		turnStatus.moveCounter = 0;

		AnimateFactionFlip();

	}
	else {
		turnStatus.moveCounter++;
	}
}

function InitTiles(){

	var mapCount =5;

	//=== get a random gameboard (5 of)
	var gameBoard = Math.floor(Math.random() * mapCount)+1;
	
	//reset the game board array (copy by val, so we can maintain the original dataset for later replication)
	switch(gameBoard)
	{
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
		default:
			tiles = CloneObject(tilesInit1);
			break;
	}
 
	//=== reset the empire to move first (copy by val, so we can maintain the original dataset for later replication)
	turnStatus = CloneObject(turnStatusInit);
	
	//=== print the map number
	if (typeof mapText !== "undefined") 
		mapText.destroy(true,true);
	
	//mapText = game.add.bitmapText(950, 770, 'jediFontBlue', 'level ' + gameBoard + ' of ' + mapCount, 32);
}  
//========================== text ================================================
function ShowVictoryText(victoriousFaction, delay){

	turnStatus.victory = true;

	var victoryText1;
	var victoryText2;
	
	//set all remaining pieces off
	turnStatus.currentTurnFaction = 'none';
	InitGameboard();
	
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
		victoryText1 = game.add.bitmapText(0.2 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', victoriousFaction, 256);
		victoryText2 = game.add.bitmapText(0.2 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', 'victory!', 192);			
		game.add.tween(victoryText1).to({ alpha: 0.6 }, 6000, Phaser.Easing.Linear.None, true, 0);
		game.add.tween(victoryText2).to({ alpha: 0.6 }, 6000, Phaser.Easing.Linear.None, true, 0);
		
		if(victoriousFaction == 'empire')
			audioSprite.play('audioEmpireWin');
		
		if(victoriousFaction == 'rebel')
			audioSprite.play('audioRebelWin');
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

function ShowResultText(font, delay, text, x, y){

	var hitText;

	game.time.events.add(Phaser.Timer.SECOND * delay, function() {
		hitText = game.add.bitmapText(x, y - (isoBaseSize * 0.5), font, text, 128);
		game.add.tween(hitText).to({ alpha: 0 }, 0, Phaser.Easing.Linear.None, true, 0);			
	}, this);
}

function ForceAttackText() {

	game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
		forceText1 = game.add.bitmapText(0.1 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', 'force', 256);
		forceText2 = game.add.bitmapText(0.1 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', ' hit!', 256);
		game.add.tween(forceText1).to({ alpha: 0 }, 0, Phaser.Easing.Linear.None, true, 0);
		game.add.tween(forceText2).to({ alpha: 0 }, 0, Phaser.Easing.Linear.None, true, 0);
	}, this);	
}

function ShowBattleOfHothText(delay){

	var fadeTime = 3000;

			
	//audioBattleOfHoth.play(); //todo: plays too late 1st time
	
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
	
		battleOfHothText1 = game.add.bitmapText(0.1 * game.world.centerX, 0.3 * game.world.centerY, 'jediFontBlue', 'battle', 256);
		battleOfHothText2 = game.add.bitmapText(0.1 * game.world.centerX, 0.8 * game.world.centerY, 'jediFontBlue', '   of', 256);
		battleOfHothText3 = game.add.bitmapText(0.1 * game.world.centerX, 1.3 * game.world.centerY, 'jediFontBlue', ' hoth', 256);
		
		game.add.tween(battleOfHothText1).to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 0);
		game.add.tween(battleOfHothText2).to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 0);
		game.add.tween(battleOfHothText3).to({ alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 0);

	});
	
	game.time.events.add(Phaser.Timer.SECOND * (fadeTime), function () {			
		battleOfHothText1.destroy();
		battleOfHothText2.destroy();
		battleOfHothText3.destroy();		
	});	
}

function AnimateForceAttack(faction) {

	var xFrom;
	var yFrom;
	var xTo;
	var yTo;
	var forceAttack;
	var forceAttackFaction;

	if (faction == 'rebel') {
		forceAttackFaction = 'rebel_force_attack';
		
		var xFrom = 0;
		var yFrom = -0.25 * game.world.height;
		var xTo = 1.25 * game.world.width;
		var yTo = 1.25 * game.world.height;
		audioRebelForceAttack.play();
	} 
	else {
		forceAttackFaction = 'empire_force_attack';
		var xFrom = 0.2 * game.world.width;
		var yFrom = -0.25 * game.world.height;
		var xTo = -0.75 * game.world.width;
		var yTo = 1 * game.world.height;
		audioEmpireForceAttack.play();
	}
	forceAttack = game.add.sprite(xFrom, yFrom, 'hothSprites', forceAttackFaction);	
	forceAttack.scale.setTo(2,2);
	game.add.tween(forceAttack).to({ x: xTo, y: yTo }, 2000, Phaser.Easing.Linear.None, true);		
}

//========================== animations ================================================
function AnimateMicrofigEject(sprite){
	
	var xA = 100;
	var xB = 250;

	if (Math.floor(Math.random() * 2) == 1){
		xA = -100
		xB = -250
	}

	var x = sprite.xDestination- isoBaseSize;
	var y = sprite.yDestination;
	var minifig = game.add.sprite(x, y, 'hothSprites', tiles[sprite.xTo][sprite.yTo][3][10]);
	
	game.add.tween(minifig).to({ alpha: 0 }, 0, Phaser.Easing.Linear.None, true, 500);
	
	game.add.tween(minifig)
	.to({
		x: [x, x + xA, x + xB],
		y: [y, y -400, y-100],
	}, 3000, 
	
	//==ste:todo: remove this embedded function
	function Out ( k ) {

		var s, a = 0.2, p = 1.2;
		if ( k === 0 ) return 0;
		if ( k === 1 ) return 1;
		if ( !a || a < 1 ) { a = 0.5; s = p / 4; }
		else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
		return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
	}
		
		, true).interpolation(function(v, k){
			return Phaser.Math.bezierInterpolation(v, k);
		});					
}

function AnimateXwingSquad() {
	var xwingSquad = game.add.sprite((1.5 * game.world.width), (0.6 * game.world.height), 'hothSprites', 'xwing_squad');
	xwingSquad.scale.setTo(0.4, 0.4);
	audioXwingSquad.play('', 0, 0.02);
	game.add.tween(xwingSquad).to({ x: 0.3 * game.world.width , y: (- 0.5 * game.world.centerY) }, 2000, Phaser.Easing.Linear.None, true);
}

function AnimateTieFighter() {

	var tieFighter = game.add.sprite((1.5 * game.world.width), 0, 'hothSprites', 'tie_fighter');
	tieFighter.scale.setTo(0.7, 0.7);
	audioTieFighter.play('', 0, 0.02);
	game.add.tween(tieFighter).to({ x: 0.8 * game.world.centerX, y: game.world.height }, 2500, Phaser.Easing.Linear.None, true);
}

function AnimateViperDroid() {

	var viperDroid = game.add.sprite(-100, (0.6 * game.world.centerY),  'hothSprites', 'viper_droid');
	viperDroid.scale.setTo(0.4, 0.4);
	audioViperDroid.play('', 0, 0.01);
	game.add.tween(viperDroid).to({ x: (1.5 * game.world.centerX), y: (1.25 * game.world.height) }, 12000, Phaser.Easing.Linear.None, true);
}

function AnimateFactionFlip() {

	DestroyStarfield();
		
	if (turnStatus.currentTurnFaction == 'rebel') {
		turnStatus.currentTurnFaction = 'empire';
		game.add.tween(empireBadge.scale).to({ x: 0.6, y: 0.6 }, 200, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(empireBadge).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(empireBadge).to({ x: (game.world.width-220), y: 20 }, 200, Phaser.Easing.Back.Out, true, 300);
		
		game.add.tween(rebelBadge.scale).to({ x: 0.4, y: 0.4 }, 200, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(rebelBadge).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(rebelBadge).to({ x: (game.world.width-370), y: 20 }, 200, Phaser.Easing.Back.Out, true, 300);
		
		game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
			audioSprite.play('audioFactionFlipRebel');		
		});
	} 
	else if (turnStatus.currentTurnFaction == 'empire'){
		turnStatus.currentTurnFaction = 'rebel';
		game.add.tween(rebelBadge.scale).to({ x: 0.6, y: 0.6 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(rebelBadge).to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(rebelBadge).to({ x: (game.world.width-220), y: 20 }, 500, Phaser.Easing.Back.Out, true, 300);
		
		game.add.tween(empireBadge.scale).to({ x: 0.4, y: 0.4 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(empireBadge).to({ alpha: 0.2 }, 500, Phaser.Easing.Back.Out, true, 300);
		game.add.tween(empireBadge).to({ x: (game.world.width-370), y: 20 }, 500, Phaser.Easing.Back.Out, true, 300);
		
		game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
			audioSprite.play('audioFactionFlipEmpire');
		});
	}		
}

function DestroyStarfield()
{
	if (typeof starfieldWindow !== "undefined") 
		starfieldWindow.destroy(true,true);
	
	if (typeof starfieldPiece !== "undefined") 
		starfieldPiece.destroy(true,true);
		
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

function DrawStarfield(x, y) {
	var heartScale = 0.5;
	DestroyStarfield();
	starfieldWindow = game.add.sprite(15, 580, 'hothSprites', 'starfield');   // A.K.A. health / shoot pattern / game piece icon window
	starfieldPiece = game.add.sprite(50, 600, 'hothSprites',tiles[x][y][3][0] + '_' + tiles[x][y][3][1]); //piece icon
	starfieldRange = game.add.sprite(250, 620, 'hothSprites', tiles[x][y][3][11]);	//shoot pattern

	var piece_current_health = tiles[x][y][3][2];
	var piece_initial_health = tiles[x][y][3][12];

	if (piece_initial_health >=4) {
		var heartSprite = (piece_current_health >= 4) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart4 = game.add.sprite(50, 650, 'hothSprites', heartSprite);
		starfieldHeart4.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >=3) {
		var heartSprite = (piece_current_health >= 3) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart3 = game.add.sprite(50, 675, 'hothSprites', heartSprite);
		starfieldHeart3.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >=2) {
		var heartSprite = (piece_current_health >= 2) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart2 = game.add.sprite(50, 700, 'hothSprites', heartSprite);
		starfieldHeart2.scale.setTo(heartScale, heartScale);
	}
	if (piece_initial_health >= 1) {
		var heartSprite = (piece_current_health >= 1) ? 'health_heart' : 'empty_health_heart';
		starfieldHeart1 = game.add.sprite(50, 725, 'hothSprites', heartSprite);
		starfieldHeart1.scale.setTo(heartScale, heartScale);
	} 

}	

function AnimateProjectile(xFrom, yFrom,xTo , yTo, shottime, shotDirection, shotOutcome){
	
	var shot = game.add.sprite(xFrom, yFrom, 'hothSprites', 'shoot_'+ shotDirection);
	shot.scale.setTo(0.8, 0.8);
	game.add.tween(shot).to({ x: xTo , y: yTo }, shottime, Phaser.Easing.Linear.None, true);

	if(shotOutcome > 0){
		//=== destroy at the target
		game.time.events.add(Phaser.Timer.SECOND * (shottime * 0.001), function() {
			shot.destroy();
		});
	}
	else{				
		game.add.tween(shot).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0);
	}
}
	
function IncrementAnimationAndAudioCounters(){
			
	//==== snow
	snowUpdateCounter++;
	if (snowUpdateCounter === snowUpdateInterval)
	{
		changeWindDirection();
		snowUpdateInterval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec
		snowUpdateCounter = 0;
	}

	//=== viper
	viperDroidUpdateCounter++;
	if (viperDroidUpdateCounter === viperDroidUpdateInterval) {
		AnimateViperDroid();
		viperDroidUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 60; // 0 - 20sec
		viperDroidUpdateCounter = 0;
	}

	//=== x wing squad
	xwingSquadUpdateCounter++;
	if (xwingSquadUpdateCounter === xwingSquadUpdateInterval) {
		AnimateXwingSquad();
		xwingSquadUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 60; // 0 - 20sec
		xwingSquadUpdateCounter = 0;
	}

	//=== tie fighter
	tieFighterUpdateCounter++;
	if (tieFighterUpdateCounter === tieFighterUpdateInterval) {
		AnimateTieFighter();
		tieFighterUpdateInterval = (Math.floor(Math.random() * 60) + 20) * 60; // 0 - 20sec
		tieFighterUpdateCounter = 0;
	}

	//=== echobase
	echoBaseAmbientUpdateCounter++;
	if (echoBaseAmbientUpdateCounter === echoBaseAmbientUpdateInterval) {
		audioSprite.play('audioEchoBaseAmbient');
		echoBaseAmbientUpdateInterval = (Math.floor(Math.random() * 80) +20) * 60; // 0 - 20sec
		echoBaseAmbientUpdateCounter = 0;
	}

	//=== taunTaun
	taunTaunUpdateCounter++;
	if (taunTaunUpdateCounter === taunTaunUpdateInterval) {
		audioTaunTaun.play('', 0, 0.01);
		taunTaunUpdateInterval = (Math.floor(Math.random() * 60) +20) * 60; // 0 - 20sec
		taunTaunUpdateCounter = 0;
	}
}	

//========================== snow animation ================================================

function changeWindDirection() {

	var max = 50;
	var multi = Math.floor((max + 200) / 4),
	frag = (Math.floor(Math.random() * 100) - multi);
	
	max = max + frag;

	if (max > 50) max = 50;
	if (max < -50) max = -50;

	setXSpeed(snowEmitter, max);
}

function setXSpeed(emitter, max) {
	game.debug.text("wind");
	emitter.setXSpeed(max - 20, max);
	emitter.forEachAlive(setParticleXSpeed, this, max);

}

function setParticleXSpeed(particle, max) {
	particle.body.velocity.x = max - Math.floor(Math.random() * 100);
}

//==========================================================================

function CloneObject(obj){
	if(obj == null || typeof(obj) != 'object')
		return obj;

	var temp = new obj.constructor(); 
	for(var key in obj)
		temp[key] = CloneObject(obj[key]);

	return temp;
}
