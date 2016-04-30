/**
 * Created by iswear on 04/27.
 */
/// <reference path="../lib/phaser.d.ts" />

class Logo{
    game: Phaser.Game;

    constructor(game: Phaser.Game){
        this.game = game;
    }
    preload() {
        this.game.load.image('logo', '/assets/logo.jpg');
    }
    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.8, 0.8);
        logo.alpha = 0.5;
        this.game.add.tween(logo.scale).to({x: 1, y:1}, 300, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(logo).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);

        this.game.time.events.add(Phaser.Timer.SECOND * 1, this.hideLogo, this);
    }
    hideLogo(){
        this.game.state.clearCurrentState();
        this.game.state.start('mainmenu');
    }
}