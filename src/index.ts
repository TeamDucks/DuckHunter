/**
 * Though seem unncessary as Phaser is at global scope,
 * this line is necessary for Webpack to play nice with TypeScript
 */
import Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('star', 'assets/star.png');
}

function create() {
    game.add.sprite(0, 0, 'star');
}

function update() {
}
