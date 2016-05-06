/**
 * Created by iswear on 04/28.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../lib/pixi.d.ts" />
    /// <reference path="../lib/p2.d.ts" />
    /// <reference path="../lib/phaser.comments.d.ts" />
    /// <reference path="../lib/pixi.comments.d.ts" />

class Play{
    game: Phaser.Game;
    player: Phaser.Sprite;
    jumpTimer: number = 0;
    facing: string = 'fall';
    worldSize: {width: number, height: number} = {width: 2800, height: 560};
    playState: {pos: string; direction: number; isReady: boolean; scale:{x: number; y: number}; mileStone:{now: boolean; last: boolean; lastMileInx: number}}
        = {pos: 'none', direction: 1, isReady: false, scale:{x: 1, y: 1}, mileStone: {now: false, last: false}, lastMileInx: -1};
    skill: {allIds: Array<number>; gotIds: Array<number>; skillGroup: Phaser.Group; skillSprites: Array<Phaser.Sprite>; map: Array<number>} =
            {allIds:[] ,gotIds: [], skillGroup: null, skillSprites:[], map: [[2], [3,4,5]]};

    layer1: Phaser.TilemapLayer;
    layer2: Phaser.TilemapLayer;
    layer3: Phaser.TilemapLayer;
    info: {status: number; milestone: {ms2009: string; ms2010: string}};
    uiBox: {uiBg: Phaser.Sprite; uiBgTweens: Array<Phaser.Tween>; uiText: Phaser.Text; uiTextTween: Phaser.Tween; style: {font: string;fill: string;boundsAlignH: string; boundsAlignY: string}} =
    {"style":{ "font": "bold 24px Simhei", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top" }, uiBgTweens: []};
    infos: Phaser.Group;
    map: Phaser.Tilemap;

    constructor(game: Phaser.Game){
        this.game = game;
    }
    preload(){
        this.game.load.image('clouds', 'assets/sprites/clouds.jpg');
        this.game.load.spritesheet('mario', 'assets/sprites/mariospritesheet-small.png', 50, 50);
        this.game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);

        this.game.load.tilemap('map', 'assets/map.json?_t=' + Date.now(), null, Phaser.Tilemap.TILED_JSON);


        this.game.load.image('tile', 'assets/sprites/tiles2.png');
        this.game.load.spritesheet('skill', 'assets/sprites/skill.png', 40, 40);

        this.game.load.json('info', 'data/info.json?_t=' + Date.now());
    }
    render(){

        //this.game.debug.text('x:' + this.player.x + ' y:' + this.player.y + 'cameraOffset  x:' + this.game.camera.position.x + ', y: ' + this.game.camera.position.y, 20, 20);
    }
    create(){
        //加载游戏配置文件
        this.info = this.game.cache.getJSON('info');


        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.physics.arcade.gravity.y = 350;  //realistic gravity
        this.map = this.game.add.tilemap('map');
        this.game.world.setBounds(0, 0, this.map.width * 70, this.worldSize.height);//(x, y, width, height)

        //绘制天空背景
        var bg = this.game.add.tileSprite(0, 0, this.map.width * 70, this.worldSize.height, 'clouds');

        //绘制地形
        this.map.addTilesetImage('tile');
        this.layer2 = this.map.createLayer('Tile Layer 2');
        this.layer1 = this.map.createLayer('Tile Layer 1');
        this.map.setCollisionBetween(1, 300, false);
        this.map.setCollision([42, 43, 44, 49, 51, 54, 56, 61, 63, 66, 68, 75, 78, 81, 84, 86, 87, 89, 90, 93, 95, 96, 98, 99, 101, 102, 107, 108, 110, 111, 113, 114, 115, 117, 119, 120, 122, 125, 126, 127, 128, 129, 131, 132, 133, 134, 138, 139, 140, 141, 143, 144, 146, 150, 151, 152, 153, 155, 156, 157, 158, 159, 162, 163, 164, 165, 166, 167, 168, 169, 170, 172, 174, 175, 176, 177, 179, 180, 181, 182, 185, 186, 187, 192, 194], true);
        this.layer1.resizeWorld();
        this.layer2.resizeWorld();
        this.player = this.game.add.sprite(70 * 2 + 20, this.game.world.height - 300, 'mario', 6);
        this.layer3 = this.map.createLayer('Tile Layer 3');
        this.layer3.resizeWorld();

        //设置角色
        this.player.anchor.setTo(0.5, 1);
        this.player.animations.add('walk', [1, 2 , 3, 4, 3, 2], 10, true);  // (key, framesarray, fps,repeat)
        this.player.animations.add('idle', [0], 0, true);
        this.player.animations.add('duck', [11], 0, true);
        this.player.animations.add('fall', [6]);
        this.player.animations.add('duckwalk', [10,11,12], 7, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.gravity.y = 450;
        this.player.body.bounce.y = 0.1;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(30, 50, 0, 0);

        this.game.camera.follow(this.player); //always center player

        //创建提示方块
        this.skill.skillGroup = this.game.add.group();
        this.skill.skillGroup.enableBody = true;


        //载入技能图集
        this.map.createFromObjects('Object Layer 2', 300, 'skill', 0, true, false, this.skill.skillGroup);

        //this.infos.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        //this.infos.callAll('animations.play', 'animations', 'spin');
        //this.map.setTileIndexCallback(196, this.toMileStone, this, 'Tile Layer 3');
        this.map.setTileLocationCallback(2, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            this.toMileStone(player, tipBox, 'ms2009');
        }, this);
        this.map.setTileLocationCallback(9, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            this.toMileStone(player, tipBox, 'ms2010');
        }, this);

        //初始化uiBox
        // create a new bitmap data object
        var bmd: Phaser.BitmapData = this.game.add.bitmapData(800, 140);
        // draw to the canvas context like normal

        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,800,140);
        bmd.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        bmd.ctx.fill();

        var skillTitle = this.game.add.text(20, 30, '技能：', this.uiBox.style);
        skillTitle.fixedToCamera = true;

        this.uiBox.uiBg = this.game.add.sprite(0, 120, bmd);

        //this.uiBox.uiBg = this.game.add.graphics();
        //this.uiBox.uiBg.beginFill(0x000000, 0.2);
        //this.uiBox.uiBg.drawRect(0, 100, 800, 110);
        this.uiBox.uiBg.alpha = 0;
        this.uiBox.uiBg.scale.y = 0;
        this.uiBox.uiBg.anchor.y = 0.25;
        this.uiBox.uiBg.fixedToCamera = true;

        this.uiBox.uiText = this.game.add.text(0, 0, "", this.uiBox.style);
        this.uiBox.uiText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.uiBox.uiText.setTextBounds(20, 110, 800, 100);
        this.uiBox.uiText.alpha = 0;
        this.uiBox.uiText.fixedToCamera = true;

        var ps: Phaser.Sprite = this.skill.skillGroup.create(this.player.x, this.player.y - 150, 'skill', 1);
        ps.anchor.setTo(0.5, 0.5);
        ps['sid'] = 1;
        this.game.physics.arcade.enable(ps);
        ps.anchor.setTo(0.5, 0.5);
        ps.body.bounce.y = 0.3;
        ps.body.gravity.y = 450;
    }

    update(){
        //检测提示方块
        //this.game.physics.arcade.overlap(this.player, this.infos, this.toMileStone, null, this);
        //初始化标记
        this.playState.mileStone.last = this.playState.mileStone.now;
        this.playState.mileStone.now = false;

        this.player.body.velocity.x = 0;
        this.game.physics.arcade.collide(this.player, this.layer1);
        this.game.physics.arcade.collide(this.skill.skillGroup, this.layer1);

        this.game.physics.arcade.overlap(this.player, this.skill.skillGroup, this.getSkill, null, this);


        var jumpKey: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var leftKey: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        var rightKey: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        var downKey: Phaser.Key = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var isNoKeyPressed = true;

        var isOnFloor = this.player.body.onFloor();
        if(isOnFloor && !this.playState.isReady){
            this.playState.isReady = true;
            this.player.animations.play('idle');
        }

        if(this.playState.isReady){
            if(leftKey.isDown && downKey.isDown){
                this.playState.direction = -1 * this.playState.scale.x;
                this.player.body.velocity.x = -100;
                this.player.animations.play('duckwalk');
            }else if(rightKey.isDown && downKey.isDown){
                this.playState.direction =  this.playState.scale.x;
                this.player.body.velocity.x = 100;
                this.player.animations.play('duckwalk');
            }else if(leftKey.isDown){
                this.playState.direction = -1 * this.playState.scale.x;
                this.player.body.velocity.x = -500;
                this.player.animations.play('walk');
                isNoKeyPressed = false;
            }else if(rightKey.isDown){
                this.playState.direction =  this.playState.scale.x;
                this.player.body.velocity.x = 500;
                this.player.animations.play('walk');
                isNoKeyPressed = false;
            }else if(downKey.isDown){
                this.player.animations.play('duck');
            }else{
                this.player.animations.play('idle');
            }

            this.player.scale.x = this.playState.direction;
        }

        if(jumpKey.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer){
            this.player.body.velocity.y = -300;
            this.jumpTimer = this.game.time.now + 750;
        }

        //this.playState.toMileStone = false;

        //离开里程碑
        if(!this.playState.mileStone.now && this.playState.mileStone.last){
            this.leaveMileStone();
            this.playState.mileStone.now = false;
        }

    }
    toMileStone:Function = function(player:Phaser.Sprite, tipBox:Phaser.Sprite, year){

        this.playState.lastMileInx = Number(year.match(/\d+/)[0]) - 2009;
        this.playState.mileStone.now = true;
        //进入里程碑

        if(!this.playState.mileStone.last){
            this.showTips(this.info.milestone[year]);
        }
        /*
        if(!this.playState.mileStone.now){
            console.log('into 2009');
            this.playState.mileStone.now = true;
        }
        */
        //tipBox.kill();
    }


    leaveMileStone: Function = function(){
        this.hideTips();

        if(this.playState.lastMileInx !== -1){
            var ids = this.skill.map[this.playState.lastMileInx];
            for(var i = 0; i < ids.length; i++){
                if(this.skill.allIds.indexOf(ids[i]) === -1){
                    this.skill.allIds.push(ids[i]);
                    var skillSprite = this.genSkill(ids[i], this.player.x + 100 + 100 * i);
                    skillSprite.sid = ids[i];
                }
            }
        }
        this.playState.lastMileInx = -1;

    }

    genSkill: Function = function(id: number, x: number, y: number){

        var ps:Phaser.Sprite = this.skill.skillGroup.create(x, this.player.y - 200, 'skill', id);
        this.game.physics.arcade.enable(ps);
        ps.anchor.setTo(0.5, 0.5);
        ps.body.bounce.y = 0.3;
        ps.body.gravity.y = 200;
        return ps;

    }
    showTips: Function = function(tips: string){
        //绘制背景

        //this.uiBox.uiBg.alpha = 1;
        this.uiBox.uiBgTweens[1] = this.game.add.tween(this.uiBox.uiBg.scale).to({y: 1}, 150, Phaser.Easing.Linear.None, true);
        this.uiBox.uiBgTweens[0] = this.game.add.tween(this.uiBox.uiBg).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);

        this.uiBox.uiTextTween = this.game.add.tween(this.uiBox.uiText).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true, 150);

        this.uiBox.uiText.text = tips;
    }
    hideTips: Function = function(){
        for(var i = 0; i < this.uiBox.uiBgTweens.length; i++){
            if(this.uiBox.uiBgTweens[i]){
                this.uiBox.uiBgTweens[i].stop(true);
            }
        }

        if(this.uiBox.uiTextTween){
            this.uiBox.uiTextTween.stop(true);
        }

        this.uiBox.uiBg.alpha = 0;
        this.uiBox.uiBg.scale.y = 0;

        this.uiBox.uiText.alpha = 0;

        this.uiBox.uiText.text = '';
        //this.uiBox.uiText.kill();
    }
    getSkill: Function = function(player: Phaser.Sprite, skillSprite: Phaser.Sprite){

        //var skillIco: Phaser.Sprite = this.game.add.sprite(this.player.position.x - this.game.camera.position.x, this.player.y - 100, 'skill', skillSprite.sid);
        var skillIco: Phaser.Sprite = this.game.add.sprite(skillSprite.x - this.game.camera.position.x + 20, skillSprite.y - this.game.camera.position.y + 20, 'skill', skillSprite.sid);
        skillIco.fixedToCamera = true;
        skillIco.anchor.setTo(0.5, 0.5);

        var LINE = 8;
        var x,y;
        x = this.skill.gotIds.length % LINE;
        y = Math.floor(this.skill.gotIds.length / LINE);

        this.game.add.tween(skillIco.cameraOffset).to({x: 110 + 50 * x, y: 40 + 50 * y}, 600, Phaser.Easing.Cubic.In, true, 50);
        this.game.add.tween(skillIco).to({angle: 360}, 450, Phaser.Easing.Linear.None, true, 150);
        this.game.add.tween(skillIco.scale).to({x: 3, y: 3}, 500, Phaser.Easing.Linear.None, true, 150, 0,true);



        this.skill.gotIds.push(skillSprite['sid']);

        this.skill.skillSprites.push(skillSprite);
        this.skill.skillGroup.remove(skillSprite);
        //skillSprite.kill();
    }
}