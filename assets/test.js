
var spriteAreas = {
	'frames': [
		{
			'filename': 'redbox',
			'frame': { 'x': 256, 'y': 0, 'w': 256, 'h': 128 }
		}
	]
}

var game = new Phaser.Game(200, 200, Phaser.CANVAS, 'test', null, true, false);
var BasicGame = function (game) { };
BasicGame.Boot = function (game) { };
BasicGame.Boot.prototype =
{
	preload: function () {	
		
		game.load.atlas('hothSprites', 'assets/images/hoth.png', null, spriteAreas);
		game.canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
	},
	create: function () {
		game.add.sprite(0, 0, 'hothSprites', 'redbox');	
	
	}
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');