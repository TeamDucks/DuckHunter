/**
 * Though seem unncessary as Phaser is at global scope,
 * this line is necessary for Webpack to play nice with TypeScript
 */
import Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player: Phaser.Sprite;
var platforms: Phaser.Group;
var cursors: Phaser.CursorKeys;
var stars: Phaser.Group;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function createEnvironment() {
    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge1 = platforms.create(400, 400, 'ground');
    ledge1.body.immovable = true;

    var ledge2 = platforms.create(-150, 250, 'ground');
    ledge2.body.immovable = true;
}

function createDrops() {
    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
        console.log('add a star');
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 6;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function createPlayer() {
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.frame = 4;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    createEnvironment();
    createPlayer();
    createDrops();
    console.log('tarck collision of ', stars, platforms);
}


function update() {
    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }

    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
    star.kill();
}
