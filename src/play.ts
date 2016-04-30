/**
 * Created by iswear on 04/28.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/pixi.d.ts" />
    /// <reference path="../lib/p2.d.ts" />

class Play{
    game: Phaser.Game;
    player: Phaser.Sprite;
    jumpTimer: number;
    facing: string = 'fall';
    state: {left: boolean, right: boolean, jump: boolean} = {left: false, right: false, jump: false};

    constructor(game: Phaser.Game){
        this.game = game;
    }
    preload(){
        this.game.load.image('clouds', 'assets/sprites/clouds.jpg');
        this.game.load.spritesheet('mario', 'assets/sprites/mariospritesheet-small.png', 50, 50);
    }
    create(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 250;  //realistic gravity
        //this.game.world.setBounds(0, 0, 2000, 600);//(x, y, width, height)
        //this.game.physics.p2.setBoundsToWorld(true, true, false, true, false); //(left, right, top, bottom, setCollisionGroup)
        //this.game.physics.p2.friction = 5;

        var bg = this.game.add.tileSprite(0, 0, 2048, 600, 'clouds');
        bg.fixedToCamera = true;
        this.player = this.game.add.sprite(10, this.game.world.centerY, 'mario',6);
        this.player.anchor.setTo(0.5, 1);
        this.player.animations.add('walk', [1, 2 , 3, 4, 3, 2], 10, true);  // (key, framesarray, fps,repeat)
        this.player.animations.add('idle', [0], 0, true);
        this.player.animations.add('duck', [11], 0, true);
        this.player.animations.add('fall', [6]);
        this.player.animations.add('duckwalk', [10,11,12], 3, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.body.bounce.y = 0.1;
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player); //always center player


    }

    update(){
        this.player.body.velocity.x = 0;
        var jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var rightKey: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        if(this.facing === 'fall' && this.player.body.onFloor()){
            this.player.animations.play('idle');
        }
        if(rightKey.isDown){
            this.player.body.velocity.x = 300;
            if(this.facing !== 'right'){
                this.player.scale.x = 1;
                this.player.animations.play('walk');
                this.facing = 'right';
            }
        }else if(leftKey.isDown){
            this.player.body.velocity.x = -300;
            if(this.facing !== 'left'){
                this.player.scale.x = -1;
                this.player.animations.play('walk');
                this.facing = 'left';
            }
        }else{
            if(this.facing === 'left'){
                this.player.scale.x = -1;
                this.player.animations.play('idle');
                this.facing = 'idle';
            }else if(this.facing === 'right'){
                this.player.scale.x = 1;
                this.player.animations.play('idle');
                this.facing = 'idle';
            }
        }

        if(jumpKey.isDown && this.player.body.onFloor()){
            this.player.body.velocity.y = -300;
            this.jumpTimer = this.game.time.now + 750;
        }

    }
}