/**
 * Though seem unncessary as Phaser is at global scope,
 * this line is necessary for Webpack to play nice with TypeScript
 */
import Phaser = require('phaser');

var cursors, player, platforms, stars;
var score = 0;
var scoreText;
var combo = false;
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: function () {
        game.load.image('logo', './assets/phaser.png');
        game.load.image('sky', './assets/sky.png');
        game.load.image('ground', './assets/platform.png');
        game.load.image('star', './assets/star.png');
        game.load.spritesheet('dude', './assets/dude.png', 32, 48);
    },
    create: function () {
        // Display phaser logo
        //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);

        // Display a beautiful star
        //game.add.sprite(0, 0, 'star');

        // Complex code creating a platform
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // cursor for key events
        cursors = game.input.keyboard.createCursorKeys();

        stars = game.add.group();
        stars.enableBody = true;
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');
            //  Let gravity do its thing
            star.body.gravity.y = 6;
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    },
    update: function () {
        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }
        //  Allow the player to jump if they are touching the ground.
        if ( player.body.touching.down) {
            if (cursors.up.isDown) {
                player.body.velocity.y = -350;
            }
            combo = false; // no combo if player have to jump again
            scoreText.setStyle({fill: '#000'}, true);
        }

        game.physics.arcade.overlap(player, stars,
                                    function (player, star) {
                                        // Removes the star from the screen
                                        star.kill();
                                        player.body.velocity.y = -350; // air jump

                                        //  Add and update the score
                                        if (combo) {
                                            score += 20;
                                            scoreText.setStyle({fill: '#F00'}, false);
                                        } else {
                                            score += 10;
                                            scoreText.setStyle({fill: '#000'}, false);
                                        }
                                        combo = true;
                                        scoreText.text = 'Score: ' + score;
                                    },
                                    null, this);
    }
});
