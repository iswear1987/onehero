/**
 * Created by iswear on 04/25.
 */
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="logo.ts" />
/// <reference path="mainmenu.ts" />
/// <reference path="subtitle.ts" />
/// <reference path="play.ts" />
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 480, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    SimpleGame.prototype.preload = function () {
        this.game.state.add('logo', new Logo(this.game));
        this.game.state.add('mainmenu', new MainMenu(this.game));
        this.game.state.add('subtitle', new Subtitle(this.game));
        this.game.state.add('play', new Play(this.game));
    };
    SimpleGame.prototype.create = function () {
        this.game.state.start('play');
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map