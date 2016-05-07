/**
 * Created by iswear on 04/28.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/pixi.d.ts" />
var Subtitle = (function () {
    function Subtitle(game) {
        this.content = [
            '你好,这是一封简历',
            '',
            '故事从2009年开始，那一年我...',
            '',
            '出...',
            '山...',
            '了...'
        ];
        this.lineIndex = 0;
        this.wordIndex = 0;
        this.game = game;
    }
    Subtitle.prototype.preload = function () {
    };
    Subtitle.prototype.create = function () {
        this.text = this.game.add.text(32, 32, '', { font: "30px Simhei", fill: "#FFFFFF" });
        this.showText();
    };
    Subtitle.prototype.showText = function () {
        this.text.setShadow(3, 3, 'rgba(255,255,255,0.5)', 2);
        this.nextLine();
    };
    Subtitle.prototype.nextLine = function () {
        var self = this;
        if (this.lineIndex === this.content.length) {
            //all Finished
            this.showOther(function () {
                self.game.time.events.add(1000, function () {
                    //all finish
                    self.game.state.clearCurrentState();
                    self.game.state.start("play");
                });
            });
            return;
        }
        this.line = this.content[this.lineIndex].split('');
        this.wordIndex = 0;
        this.game.time.events.repeat(120, this.line.length, this.nextWord, this);
        this.lineIndex += 1;
    };
    Subtitle.prototype.nextWord = function (text) {
        if (this.line.length !== 0) {
            this.text.text = this.text.text.concat(this.line[this.wordIndex]);
            this.wordIndex += 1;
        }
        if (this.wordIndex === this.line.length) {
            this.game.time.events.add(400, this.nextLine, this);
            this.text.text = this.text.text.concat('\n');
        }
    };
    Subtitle.prototype.showOther = function (showFinish) {
        var bz_0 = this.game.add.sprite(this.game.world.width, this.game.world.height, 'bz-0');
        var bz_1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bz-1');
        bz_0.anchor.setTo(1, 0);
        bz_1.anchor.setTo(0.5, 0.5);
        bz_1.alpha = 0;
        bz_1.scale.setTo(2, 2);
        //this.game.tweens.add().to({y: this.game.world.height - bz_0.height}, 1200, Phaser.Easing.Cubic.In, true);
        var otherTween1 = this.game.add.tween(bz_0).to({ y: this.game.world.height - bz_0.height - 1 }, 600, Phaser.Easing.Cubic.In, true, 1000);
        otherTween1.onComplete.add(showFinish);
        //var otherTween2: Phaser.Tween = this.game.add.tween(bz_1).to({scale:{x: 1, y: 1}, alpha: 1}, 600, Phaser.Easing.Bounce.In, true);
        var otherTween2 = this.game.add.tween(bz_1).to({ alpha: 1 }, 600, Phaser.Easing.Linear.None, true);
        this.game.add.tween(bz_1.scale).to({ x: 1, y: 1 }, 600, Phaser.Easing.Bounce.Out, true);
    };
    return Subtitle;
})();
//# sourceMappingURL=subtitle.js.map