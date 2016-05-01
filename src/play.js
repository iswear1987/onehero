/**
 * Created by iswear on 04/28.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/p2.d.ts" />
var Play = (function () {
    function Play(game) {
        this.jumpTimer = 0;
        this.facing = 'fall';
        this.worldSize = { width: 2048, height: 600 };
        this.playState = { pos: 'none', direction: 1, isReady: false };
        this.game = game;
    }
    Play.prototype.preload = function () {
        this.game.load.image('clouds', 'assets/sprites/clouds.jpg');
        this.game.load.spritesheet('mario', 'assets/sprites/mariospritesheet-small.png', 50, 50);
    };
    Play.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 350; //realistic gravity
        this.game.world.setBounds(0, 0, this.worldSize.width, this.worldSize.height); //(x, y, width, height)
        var bg = this.game.add.tileSprite(0, 0, this.worldSize.width, this.worldSize.height, 'clouds');
        this.player = this.game.add.sprite(50, this.game.world.height - 200, 'mario', 6);
        this.player.anchor.setTo(0.5, 1);
        this.player.animations.add('walk', [1, 2, 3, 4, 3, 2], 10, true); // (key, framesarray, fps,repeat)
        this.player.animations.add('idle', [0], 0, true);
        this.player.animations.add('duck', [11], 0, true);
        this.player.animations.add('fall', [6]);
        this.player.animations.add('duckwalk', [10, 11, 12], 7, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.bounce.y = 0.1;
        this.player.body.collideWorldBounds = true;
        ;
        this.player.body.setSize(30, 50, 0, 0);
        this.game.camera.follow(this.player); //always center player
    };
    Play.prototype.update = function () {
        this.player.body.velocity.x = 0;
        var jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        var downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var isNoKeyPressed = true;
        var isOnFloor = this.player.body.onFloor();
        if (isOnFloor && !this.playState.isReady) {
            this.playState.isReady = true;
            this.player.animations.play('idle');
        }
        if (this.playState.isReady) {
            if (leftKey.isDown && downKey.isDown) {
                this.playState.direction = -1;
                this.player.body.velocity.x = -100;
                this.player.animations.play('duckwalk');
            }
            else if (rightKey.isDown && downKey.isDown) {
                this.playState.direction = 1;
                this.player.body.velocity.x = 100;
                this.player.animations.play('duckwalk');
            }
            else if (leftKey.isDown) {
                this.playState.direction = -1;
                this.player.body.velocity.x = -200;
                this.player.animations.play('walk');
                isNoKeyPressed = false;
            }
            else if (rightKey.isDown) {
                this.playState.direction = 1;
                this.player.body.velocity.x = 200;
                this.player.animations.play('walk');
                isNoKeyPressed = false;
            }
            else if (downKey.isDown) {
                this.player.animations.play('duck');
            }
            else {
                this.player.animations.play('idle');
            }
            this.player.scale.x = this.playState.direction;
        }
        if (jumpKey.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -300;
            this.jumpTimer = this.game.time.now + 750;
        }
    };
    return Play;
})();
//# sourceMappingURL=play.js.map