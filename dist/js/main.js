/**
 * Created by iswear on 04/25.
 */
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="logo.ts" />
/// <reference path="mainmenu.ts" />
/// <reference path="subtitle.ts" />
/// <reference path="play.ts" />
class SimpleGame {
    constructor() {
        this.game = new Phaser.Game(800, 480, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    preload() {
        this.game.state.add('logo', new Logo(this.game));
        this.game.state.add('mainmenu', new MainMenu(this.game));
        this.game.state.add('subtitle', new Subtitle(this.game));
        this.game.state.add('play', new Play(this.game));
    }
    create() {
        this.game.state.start('logo');
    }
}
window.onload = () => {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map