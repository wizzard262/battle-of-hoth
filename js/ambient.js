/*
 * Battle of Hoth - ambience
 * Random fly-overs, background sounds and gusts of wind in the snow, run from update() every frame.
 */

// Each runs its action every 'interval' frames (60 per second), then picks a new random interval.
// They are checked in this order each frame.
var AMBIENT_EVENTS = [
	{ name: 'snow',            interval: 60,   counter: 0, action: function () { changeWindDirection(); },             next: function () { return Math.floor(Math.random() * 20) * 60; } },
	{ name: 'viperDroid',      interval: 1000, counter: 0, action: function () { AnimateViperDroid(); },               next: function () { return (Math.floor(Math.random() * 60) + 20) * 60; } },
	{ name: 'xwingSquad',      interval: 100,  counter: 0, action: function () { AnimateXwingSquad(); },               next: function () { return (Math.floor(Math.random() * 60) + 20) * 40; } },
	{ name: 'tieFighter',      interval: 200,  counter: 0, action: function () { AnimateTieFighter(); },               next: function () { return (Math.floor(Math.random() * 60) + 20) * 40; } },
	{ name: 'echoBaseAmbient', interval: 1500, counter: 0, action: function () { Sounds.echoBaseAmbient.play('', 0, 0.2); }, next: function () { return (Math.floor(Math.random() * 80) + 20) * 100; } },
	{ name: 'wind',            interval: 60,   counter: 0, action: function () { Sounds.wind.play('', 0, 0.2); },      next: function () { return (Math.floor(Math.random() * 80) + 20) * 100; } },
	{ name: 'taunTaun',        interval: 1000, counter: 0, action: function () { Sounds.taunTaun.play('', 0, 0.5); },  next: function () { return (Math.floor(Math.random() * 60) + 20) * 60; } }
];

function IncrementAnimationAndAudioCounters() {
	AMBIENT_EVENTS.forEach(function (event) {
		event.counter++;
		if (event.counter === event.interval) {
			event.action();
			event.interval = event.next();
			event.counter = 0;
		}
	});
}

//=========================== SNOW ======================================

function CreateSnow() {
	var snow = UI.snowEmitter = game.add.emitter(game.world.centerX, -32, 600);
	snow.makeParticles('snowflakeSprites', [0, 1, 2, 3, 4, 5]);
	snow.maxParticleScale = 0.9;
	snow.minParticleScale = 0.2;
	snow.setYSpeed(10, 50);
	snow.gravity = 0;
	snow.width = game.world.width * 1.5;
	snow.minRotation = 0;
	snow.maxRotation = 40;
	StartSnow();
}

function StartSnow() {
	UI.snowEmitter.revive();
	UI.snowEmitter.start(false, 14000, 20);
}

function StopSnow() {
	UI.snowEmitter.removeAll(true, true);
	UI.snowEmitter.kill();
}

// A gust: change the sideways speed of the snow
function changeWindDirection() {
	var max = 60;
	var multi = Math.floor((max + 30) / 4);
	var frag = (Math.floor(Math.random() * 30) - multi);

	max = max + frag;

	if (max > 60) max = 60;
	if (max < -60) max = -60;

	setXSpeed(UI.snowEmitter, max);
}

function setXSpeed(emitter, max) {
	game.debug.text("wind");
	emitter.setXSpeed(max - 20, max);
	emitter.forEachAlive(setParticleXSpeed, this, max);
}

function setParticleXSpeed(particle, max) {
	particle.body.velocity.x = max - Math.floor(Math.random() * 200);
}
