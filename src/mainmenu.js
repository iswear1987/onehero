/**
 * Created by iswear on 04/27.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/p2.d.ts" />
var MainMenu = (function () {
    function MainMenu(game) {
        this.game = game;
    }
    MainMenu.prototype.preload = function () {
        this.game.load.spritesheet("btn_start", "../assets/sprites/button-start.png", 401, 143);
        this.game.load.spritesheet('itm_snowman', '../assets/sprites/snowman.png', 103, 78);
        this.game.load.image('bg', '../assets/sprites/deepblue.png');
        this.game.load.image('bz-0', '../assets/sprites/bz-0.png');
        this.game.load.image('bz-1', '../assets/sprites/bz-1.png');
    };
    MainMenu.prototype.create = function () {
        //处理声音
        this.game.add.image(0, 0, 'bg');
        var bgm = this.game.add.audio('bgm');
        bgm.allowMultiple = false;
        bgm.loop = true;
        bgm.play();
        var sound = this.game.add.audio('sound');
        sound.addMarker('sound_1', 0, 1.3);
        sound.addMarker('sound_2', 2, 3.3);
        sound.addMarker('sound_3', 4, 5.3);
        sound.addMarker('sound_4', 6, 6.3);
        sound.addMarker('sound_5', 8, 8.3);
        sound.addMarker('success', 10, 12.3);
        sound.addMarker('failure', 13, 13.5);
        sound.allowMultiple = true;
        sound.autoplay = false;
        this.game['mssound'] = sound;
        //var btn_start: Phaser.Sprite = this.game.add.sprite(this.game.width / 2, this.game.height/ 2, 'btn_start');
        var btn_start = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 60, 'btn_start', this.actionOnClick, this, 0, 1, 2);
        //显示雪人
        this.showSnowman();
        //显示文字
        this.showText();
        btn_start.anchor.set(0.5, 0.5);
    };
    MainMenu.prototype.actionOnClick = function () {
        var downTween = this.game.add.tween(this.snowman).to({ y: this.game.world.height + 100 }, 800, Phaser.Easing.Cubic.In, true);
        var self = this;
        downTween.onComplete.addOnce(function () {
            self.endMainmenu();
        });
    };
    MainMenu.prototype.endMainmenu = function () {
        this.game.state.clearCurrentState();
        this.game.state.start('subtitle');
    };
    MainMenu.prototype.showSnowman = function () {
        this.snowman = this.game.add.sprite(-10, this.game.world.height, 'itm_snowman');
        this.snowman.position.setTo(-100, this.game.world.height);
        this.game.add.tween(this.snowman).to({ x: -10 }, 1500, Phaser.Easing.Bounce.Out, true);
        this.snowman.anchor.setTo(0, 1);
        this.snowman.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.snowman.animations.play('idle');
    };
    MainMenu.prototype.showText = function () {
        var bar = this.game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 100, 800, 100);
         var style = { font: "bold 32px Simhei", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        //  The Text is positioned at 0, 100
        var gameTitle = this.game.add.text(0, 0, "我的故事（精简版）", style);
        gameTitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
        gameTitle.setTextBounds(0, 100, 800, 100);
    };
    return MainMenu;
})();
//# sourceMappingURL=mainmenu.js.map