/**
 * Created by iswear on 04/27.
 */
/// <reference path="../lib/phaser.d.ts" />
class Logo {
    constructor(game) {
        this.game = game;
    }
    preload() {
        this.game.load.image('logo', './dist/assets/logo.jpg');
        this.game.load.audio('bgm', './dist/assets/Time_travel.mp3');
        //this.game.load.audio('sound', '.././dist/assets/sound.ogg');
        this.game.load.audio('bee_1', './dist/assets/bee_1.mp3');
        this.game.load.audio('bee_2', './dist/assets/bee_2.mp3');
        this.game.load.audio('bee_3', './dist/assets/bee_3.mp3');
        this.game.load.audio('bee_4', './dist/assets/bee_4.mp3');
        this.game.load.audio('bee_5', './dist/assets/bee_5.mp3');
        this.game.load.audio('success', './dist/assets/success.mp3');
        this.game.load.audio('failure', './dist/assets/failure.mp3');
    }
    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.8, 0.8);
        logo.alpha = 0.5;
        this.game.add.tween(logo.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(logo).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        this.game.time.events.add(Phaser.Timer.SECOND * 1, this.hideLogo, this);
    }
    hideLogo() {
        this.game.state.clearCurrentState();
        this.game.state.start('mainmenu');
    }
}
//# sourceMappingURL=logo.js.map