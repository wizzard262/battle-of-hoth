/*
 * Battle of Hoth - the menu (control panel, top left) and the instructions
 */

function InitMenu() {
	var controlPanelSprite = game.add.sprite(5, 5, 'hothSprites', 'control_panel');
	controlPanelSprite.scale.setTo(0.4, 0.4);
	controlPanelSprite.inputEnabled = true;
	controlPanelSprite.input.useHandCursor = true;

	// bounce now and then to get noticed
	var controlPanelScaleTween = game.add.tween(controlPanelSprite.scale);
	controlPanelScaleTween.to({ x: 0.6, y: 0.6 }, 300, Phaser.Easing.Bounce.Out, false, 0, true, false);
	controlPanelScaleTween.repeat(5, 10000); //1000 = 1 sec
	controlPanelScaleTween.start();

	//=== EVENT (tap control panel): pause and show the menu
	controlPanelSprite.events.onInputDown.add(function () {
		game.paused = true;
		UI.menu = game.add.sprite(0, 0, 'hothSprites', 'menu');
		UI.menu.scale.setTo(2, 2);
		UI.menu.inputEnabled = true;
		UI.menu.input.useHandCursor = true;
		DrawRobotMenuRow();

		//=== taps while paused go to the menu
		game.input.onDown.add(MenuTapped, self);
	}, this);
}

// Menu rows (128px each): back, instructions, snow on/off, new game, the source code, robot players
function MenuTapped(event) {
	//=== only while the menu is up (not the instructions)
	if (!(Settings.showInstructionScreen == false && game.paused && (typeof UI.menu != "undefined" || UI.menu != null) && (typeof UI.instructions == "undefined" || UI.instructions == null)))
		return;

	//=== outside the menu: close it
	if (!(event.x > 0 && event.x < 512 && event.y > 0 && event.y < 768)) {
		CloseMenu();
		return;
	}

	var y = event.y;
	//=== back
	if (y > 0 && y <= 128) {
		CloseMenu();
	}
	//=== instructions
	if (y > 128 && y <= 256) {
		game.paused = false;
		DestroyMenu();
		Settings.showInstructionScreen = true;
		ShowInstructions();
	}
	//=== snow on/off
	if (y > 256 && y < 384) {
		Settings.snowToggle = !Settings.snowToggle;
		CloseMenu();
		if (Settings.snowToggle)
			StartSnow();
		else
			StopSnow();
	}
	//=== new game
	if (y > 384 && y < 512) {
		CloseMenu();
		ResetGame();
	}
	//=== the source code
	if (y > 512 && y < 640) {
		window.top.location = 'https://bitbucket.org/wizzard262/battleofhoth';
	}
	//=== robot players: tap a side to switch it between player and robot (the menu stays open)
	if (y >= 640 && y < 768) {
		var faction = (event.x < 256) ? 'rebel' : 'empire';
		SetRobot(faction, !IsRobot(faction));
		DrawRobotMenuRow();
	}
}

function CloseMenu() {
	DestroyMenu();
	game.paused = false;
}

function DestroyMenu() {
	UI.menu.destroy();
	if (UI.robotMenuRow)
		UI.robotMenuRow.destroy(true);
	UI.robotMenuRow = null;
}

// The last menu row, drawn to match the menu image: each side's badge, and 'player' or 'robot'
function DrawRobotMenuRow() {
	if (UI.robotMenuRow)
		UI.robotMenuRow.destroy(true);
	var row = UI.robotMenuRow = game.add.group();

	var background = game.add.graphics(0, 0, row);
	background.beginFill(0xC3C3C3);
	background.drawRect(0, 640, 512, 128);
	background.endFill();
	background.beginFill(0x1E1E1E);
	background.drawRect(0, 636, 512, 4);
	background.drawRect(254, 652, 4, 104);
	background.endFill();

	['rebel', 'empire'].forEach(function (faction, i) {
		var badge = game.add.sprite(16 + 256 * i, 664, 'hothSprites', faction + '_badge', row);
		badge.scale.setTo(0.25, 0.25);
		game.add.bitmapText(108 + 256 * i, 688, IsRobot(faction) ? 'jediFontYellow' : 'jediFontBlue', IsRobot(faction) ? 'robot' : 'player', 30, row);
	});
}

function ShowInstructions() {
	UI.instructions = game.add.sprite(0, 0, 'hothSprites', 'instructions');
	UI.instructions.inputEnabled = true;
	UI.instructions.input.useHandCursor = true;
	UI.instructions.bringToTop();

	//=== tap to close
	UI.instructions.events.onInputDown.add(function () {
		game.paused = false;
		UI.instructions.destroy();
		UI.instructions = null;
		Settings.showInstructionScreen = false;
	}, game);
}
