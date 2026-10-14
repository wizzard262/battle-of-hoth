/*
 * Battle of Hoth - effects
 * Shots, explosions, force attacks, fly-overs, the turn badges, the info window and big texts.
 */

//=========================== SHOTS =====================================

// The shot flies from the shooter to the target; a miss overshoots and fades
function ShowProjectile(sprite, shotOutcome, isShootsDiagonal) {
	var direction = sprite.direction;
	var shotDirection = direction;
	var overshoot = (shotOutcome == 0) ? 2 : 0; //=== a miss overshoots by twice the distance between pieces
	var shottime = 500;

	var xFrom = sprite.xOrigin + isoBaseSize;
	var yFrom = sprite.yOrigin + (0.5 * isoBaseSize);
	var xTo;
	var yTo;
	var baseX = sprite.x + isoBaseSize;
	var baseY = sprite.y + (0.5 * isoBaseSize);
	var dx = isoBaseSize * overshoot;
	var dy = 0.5 * isoBaseSize * overshoot;

	Sounds.shoot[tiles[sprite.xFrom][sprite.yFrom].piece.shootSound].play();

	switch (direction) {
		case "up":    xTo = baseX + dx; yTo = baseY - dy; break;
		case "right": xTo = baseX + dx; yTo = baseY + dy; break;
		case "down":  xTo = baseX - dx; yTo = baseY + dy; break;
		case "left":  xTo = baseX - dx; yTo = baseY - dy; break;
		default:      xFrom = undefined; yFrom = undefined; break;
	}

	//=== diagonal shooters (Tauntaun and AT-ST)
	if (isShootsDiagonal) {
		shotDirection += '_rider';
		switch (direction) {
			case "up":    xTo = baseX;      yTo = baseY - dy; break;
			case "right": xTo = baseX;      yTo = baseY + dy; break;
			case "down":  xTo = baseX - dx; yTo = baseY;      break;
			case "left":  xTo = baseX + dx; yTo = baseY;      break;
		}
	}
	AnimateProjectile(xFrom, yFrom, xTo, yTo, shottime, shotDirection, shotOutcome);
}

function AnimateProjectile(xFrom, yFrom, xTo, yTo, shottime, shotDirection, shotOutcome) {
	var shot = game.add.sprite(xFrom, yFrom, 'hothSprites', 'shoot_' + shotDirection);
	shot.scale.setTo(0.8, 0.8);
	var tweenShot = game.add.tween(shot);
	tweenShot.to({ x: xTo, y: yTo }, shottime, Phaser.Easing.Linear.None, false);

	if (shotOutcome > 0) {
		//=== a hit stops at the target
		game.time.events.add(Phaser.Timer.SECOND * (shottime * 0.001), function () {
			shot.destroy();
		});
	}
	else {
		//=== a miss fades out past the target
		tweenShot.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false, 0);
	}
	tweenShot.start();
}

// A destroyed piece: its wreck, with flames, fading away
function DrawWreck(sprite, tileName) {
	var destroyedVehicle = SetSprite(sprite.xTo, sprite.yTo, 'hothSprites', tileName, isoGroupIndicators);

	var fire = UI.fireAnimation;
	fire.alpha = 1;
	fire.x = sprite.x + (isoBaseSize * 0.5);
	fire.y = sprite.y - (isoBaseSize * 0.5);
	fire.scale.setTo(2, 2);
	fire.animations.play('flames', 6, true);

	var tweenFireAnimation = game.add.tween(fire);
	tweenFireAnimation.to({ alpha: 0 }, 6000, Phaser.Easing.Linear.None, false, 0, 1000, true);
	tweenFireAnimation.start();

	var tweenDestroyedVehicle = game.add.tween(destroyedVehicle);
	tweenDestroyedVehicle.to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None, false, 0, 1000, true);
	tweenDestroyedVehicle.start();
}

// An X-wing (rebel) or TIE fighter (empire) flies across the screen
function AnimateForceAttack(faction) {
	var attack = (faction == 'rebel') ?
		{ frame: 'rebel_force_attack', xFrom: 0, yFrom: -0.25, xTo: 1.25, yTo: 1.25, sound: Sounds.rebelForceAttack } :
		{ frame: 'empire_force_attack', xFrom: 0.2, yFrom: -0.25, xTo: -0.75, yTo: 1, sound: Sounds.empireForceAttack };
	attack.sound.play('', 0, 1);

	var forceAttack = game.add.sprite(attack.xFrom * game.world.width, attack.yFrom * game.world.height, 'hothSprites', attack.frame);
	forceAttack.scale.setTo(2, 2);

	var tweenForceAttack = game.add.tween(forceAttack);
	tweenForceAttack.to({ x: attack.xTo * game.world.width, y: attack.yTo * game.world.height }, 2000, Phaser.Easing.Linear.None, false);
	tweenForceAttack.start();
}

// A hit piece throws out a minifig, which arcs left or right and fades
function AnimateMicrofigEject(sprite) {
	// this runs 0.4s after the hit: by then the game may have been reset, leaving the square empty
	var piece = tiles[sprite.xTo] && tiles[sprite.xTo][sprite.yTo] && tiles[sprite.xTo][sprite.yTo].piece;
	if (!piece) return;

	var x = sprite.xDestination - isoBaseSize;
	var y = sprite.yDestination;
	var minifig = game.add.sprite(x, y, 'hothSprites', piece.minifig);
	var side = (Math.floor(Math.random() * 2) == 1) ? -1 : 1;

	var tweenProjectile = game.add.tween(minifig);
	tweenProjectile.to({
		x: [x, x + (100 * side), x + (250 * side)],
		y: [y, y - 300, y - 100]
	}, 3000, function (k) {
		return parabolicEasing(k);
	}, false);
	tweenProjectile.start();

	var tweenDisappear = game.add.tween(minifig);
	tweenDisappear.to({ alpha: 0 }, 2500, Phaser.Easing.Linear.None, false, 0);
	tweenDisappear.start();
}

function parabolicEasing(k) {
	var p = 1.2;
	var a = 0.5;
	var s = p / 4;

	if (k === 0) return 0;
	if (k === 1) return 1;
	return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
}

//=========================== FLY-OVERS =================================

function AnimateFlyover(frame, x, y, scale, sound, xTo, yTo, duration) {
	var sprite = game.add.sprite(x, y, 'hothSprites', frame);
	sprite.scale.setTo(scale, scale);
	sound.play('', 0, 0.2);

	var tween = game.add.tween(sprite);
	tween.to({ x: xTo, y: yTo }, duration, Phaser.Easing.Linear.None, false);
	tween.start();
}

function AnimateXwingSquad() {
	AnimateFlyover('xwing_squad', 1.5 * game.world.width, 0.6 * game.world.height, 0.4, Sounds.xwingSquad,
		0.3 * game.world.width, -0.5 * game.world.centerY, 2000);
}

function AnimateTieFighter() {
	AnimateFlyover('tie_fighter', 1.5 * game.world.width, 0, 0.7, Sounds.tieFighter,
		0.8 * game.world.centerX, game.world.height, 2500);
}

function AnimateViperDroid() {
	AnimateFlyover('viper_droid', -100, 0.6 * game.world.centerY, 0.4, Sounds.viperDroid,
		1.5 * game.world.centerX, 1.25 * game.world.height, 12000);
}

//=========================== TURN BADGES ===============================

// Scale, fade and move a badge (all after 300ms)
function TweenBadge(badge, scale, alpha, xFromRight, y, scaleTime, moveTime, startMove) {
	game.add.tween(badge.scale).to({ x: scale, y: scale }, scaleTime, Phaser.Easing.Back.Out, true, 300);
	game.add.tween(badge).to({ alpha: alpha }, 500, Phaser.Easing.Back.Out, true, 300);
	game.add.tween(badge).to({ x: (game.world.width - xFromRight), y: y }, moveTime, Phaser.Easing.Back.Out, startMove, 300);
}

// turnCount 1: the current side's first badge fades (one go used).
// turnCount 0: the turn passes: the new side's badges grow, the old side's fade.
function AnimateFactionFlip(turnCount) {
	DestroyStarfield();

	if (turnCount == 1) {
		if (turnStatus.currentTurnFaction == 'rebel') {
			TweenBadge(UI.rebelBadge_1, 0.2, 0.2, 360, 30, 200, 200, true);
		}
		else if (turnStatus.currentTurnFaction == 'empire') {
			TweenBadge(UI.empireBadge_1, 0.2, 0.2, 210, 30, 500, 500, true);
		}
	}

	if (turnCount == 0) {
		if (turnStatus.currentTurnFaction == 'rebel') {
			turnStatus.currentTurnFaction = 'empire';
			TweenBadge(UI.empireBadge_1, 0.3, 1, 220, 20, 200, 200, true);
			TweenBadge(UI.empireBadge_2, 0.3, 1, 120, 20, 200, 200, true);
			TweenBadge(UI.rebelBadge_1, 0.2, 0.2, 360, 30, 200, 200, true);
			TweenBadge(UI.rebelBadge_2, 0.2, 0.2, 460, 30, 200, 200, true);
		}
		else if (turnStatus.currentTurnFaction == 'empire') {
			turnStatus.currentTurnFaction = 'rebel';
			TweenBadge(UI.rebelBadge_1, 0.3, 1, 370, 20, 500, 500, false); // (this move tween is never started)
			TweenBadge(UI.rebelBadge_2, 0.3, 1, 470, 20, 500, 500, true);
			TweenBadge(UI.empireBadge_1, 0.2, 0.2, 210, 30, 500, 500, true);
			TweenBadge(UI.empireBadge_2, 0.2, 0.2, 110, 30, 500, 500, true);
		}

		game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
			Sounds.factionFlipTwo.play('', 0, 1);
		});

		turnStatus.factionFlipBounce = true;
	}
}

//=========================== INFO WINDOW ===============================

var STARFIELD_SPRITES = ['starfieldWindow', 'starfieldPiece', 'starfieldRange', 'starfieldHeart4', 'starfieldHeart3', 'starfieldHeart2', 'starfieldHeart1'];

function DestroyStarfield() {
	STARFIELD_SPRITES.forEach(function (name) {
		if (typeof UI[name] !== "undefined")
			UI[name].destroy(true, true);
	});
}

// The selected piece's picture, shot pattern and health (red hearts, grey for lost health)
function DrawStarfield(x, y) {
	DestroyStarfield();

	var piece = tiles[x][y].piece;
	var heartScale = 0.5;

	UI.starfieldWindow = game.add.sprite(15, 580, 'hothSprites', 'starfield');
	UI.starfieldPiece = game.add.sprite(50, 600, 'hothSprites', piece.faction + '_' + piece.unit);
	UI.starfieldRange = game.add.sprite(250, 620, 'hothSprites', piece.shotRangeImage);

	[4, 3, 2, 1].forEach(function (heart) {
		if (piece.initialHealth >= heart) {
			var sprite = game.add.sprite(50, 750 - (25 * heart), 'hothSprites', (piece.health >= heart) ? 'health_heart' : 'empty_health_heart');
			sprite.scale.setTo(heartScale, heartScale);
			UI['starfieldHeart' + heart] = sprite;
		}
	});
}

//=========================== TEXTS =====================================

function ShowVictoryText(victoriousFaction, delay) {
	var victoryText1;
	var victoryText2;

	turnStatus.victory = true;

	//=== no more moves: nobody's turn
	turnStatus.currentTurnFaction = 'none';
	InitGameboard();

	//=== show victory text, then fade
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
		victoryText1 = game.add.bitmapText(0.2 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', victoriousFaction, 256);
		victoryText2 = game.add.bitmapText(0.2 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', 'victory!', 192);
		FadeText(victoryText1, 0.6, 5000);
		FadeText(victoryText2, 0.6, 5000);

		if (victoriousFaction == 'empire')
			Sounds.empireWin.play('', 0, 1);
		if (victoriousFaction == 'rebel')
			Sounds.rebelWin.play('', 0, 1);
	});

	//=== then start a new game
	game.time.events.add(Phaser.Timer.SECOND * (delay + 5), function () {
		victoryText1.destroy();
		victoryText2.destroy();
		ResetGame();
	});
}

function FadeText(text, alpha, duration) {
	var tween = game.add.tween(text);
	tween.to({ alpha: alpha }, duration, Phaser.Easing.Linear.None, false, 0);
	tween.start();
}

// 'hit!' / 'miss!' over the target
function ShowResultText(font, delay, text, x, y) {
	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
		var hitText = game.add.bitmapText(x, y - (isoBaseSize * 0.5), font, text, 128);
		FadeText(hitText, 0, 1000);
	}, this);
}

function ForceAttackText() {
	game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
		var forceText1 = game.add.bitmapText(0.1 * game.world.centerX, 0.6 * game.world.centerY, 'jediFontYellow', 'force', 256);
		var forceText2 = game.add.bitmapText(0.1 * game.world.centerX, 1.1 * game.world.centerY, 'jediFontYellow', ' hit!', 256);
		FadeText(forceText1, 0, 1000);
		FadeText(forceText2, 0, 1000);
	}, this);
}

// The 'battle of hoth' title at the start of a game
function ShowBattleOfHothText(delay) {
	var fadeTime = 2000;
	var texts;

	game.time.events.add(Phaser.Timer.SECOND * delay, function () {
		texts = [
			game.add.bitmapText(0.1 * game.world.centerX, 0.3 * game.world.centerY, 'jediFontBlue', 'battle', 256),
			game.add.bitmapText(0.1 * game.world.centerX, 0.8 * game.world.centerY, 'jediFontBlue', '   of', 256),
			game.add.bitmapText(0.1 * game.world.centerX, 1.3 * game.world.centerY, 'jediFontBlue', ' hoth', 256)
		];
		texts.forEach(function (text) {
			FadeText(text, 0, fadeTime);
		});
	});

	//=== destroy the texts (note: fadeTime is in ms, so this waits 2000 seconds)
	game.time.events.add(Phaser.Timer.SECOND * (fadeTime), function () {
		texts.forEach(function (text) {
			text.destroy();
		});
	});
}
