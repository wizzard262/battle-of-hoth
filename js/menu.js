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

		//=== taps while paused go to the menu
		game.input.onDown.add(MenuTapped, self);
	}, this);
}

// Menu rows (128px each): back, instructions, snow on/off, new game, the source code
function MenuTapped(event) {
	//=== only while the menu is up (not the instructions)
	if (!(Settings.showInstructionScreen == false && game.paused && (typeof UI.menu != "undefined" || UI.menu != null) && (typeof UI.instructions == "undefined" || UI.instructions == null)))
		return;

	//=== outside the menu: close it
	if (!(event.x > 0 && event.x < 512 && event.y > 0 && event.y < 640)) {
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
		UI.menu.destroy();
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
}

function CloseMenu() {
	UI.menu.destroy();
	game.paused = false;
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
