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
    worldSize: {width: number; height: number} = {width: 2800, height: 560};
    playState: {pos: string; direction: number; isReady: boolean; scale:{x: number; y: number}; mileStone:{now: boolean; last: boolean; lastMileInx: number}}
        = {pos: 'none', direction: 1, isReady: false, scale:{x: 1, y: 1}, mileStone: {now: false, last: false, lastMileInx: -1}, lastMileInx: -1};
    skill: {allIds: number[]; gotIds: number[]; skillGroup: Phaser.Group; skillSprites: Phaser.Sprite[]; skillIcoGroup: Phaser.Group} =
            {allIds:[] ,gotIds: [], skillGroup: null, skillSprites:[], skillIcoGroup: null};

    layer1: Phaser.TilemapLayer;
    layer2: Phaser.TilemapLayer;
    layer3: Phaser.TilemapLayer;
    info: {status: number; milestone: {ms2009: string; ms2010: string;ms2011: string; ms2012: string; ms2013: string; ms2014: string; ms2015: string; ms2016: string}; skillMap: number[][]};
    uiBox: {uiBg: Phaser.Sprite; uiBgTweens: Phaser.Tween[]; uiText: Phaser.Text; uiTextTween: Phaser.Tween; style: any} =
    {uiBg: null, uiBgTweens: [], uiText: null,uiTextTween: null, "style":{ "font": "bold 24px Simhei", fill: "#fff", boundsAlignH: "left", boundsAlignV: "top" }};
    map: Phaser.Tilemap;
    gamesound: {getSkill: Phaser.Sound[]; success: Phaser.Sound; failure: Phaser.Sound} = {getSkill: [], success: null, failure: null};

    constructor(game: Phaser.Game){
        this.game = game;
    }
    preload(){
        this.game.load.image('clouds', 'assets/sprites/clouds.jpg');
        this.game.load.spritesheet('mario', 'assets/sprites/mariospritesheet-small.png', 50, 50);

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

        //加载音效文件
        for(var i = 1; i <= 5; i++){
            var snd = this.game.add.audio('bee_' + i);
            snd.allowMultiple = true;
            snd.autoplay = false;
            this.gamesound.getSkill.push(snd);
        }
        this.gamesound.failure = this.game.add.audio('failure');
        this.gamesound.failure.autoplay = false;
        this.gamesound.success = this.game.add.audio('success');
        this.gamesound.success.autoplay = false;

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
        this.player.name = 'player';
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
        //this.map.createFromObjects('Object Layer 2', 300, 'skill', 0, true, false, this.skill.skillGroup);

        this.map.setTileLocationCallback(2, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2009');
            }
        }, this);
        this.map.setTileLocationCallback(9, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2010');
            }
        }, this);
        this.map.setTileLocationCallback(16, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2011');
            }
        }, this);
        this.map.setTileLocationCallback(23, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2012');
            }
        }, this);
        this.map.setTileLocationCallback(30, 5, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2013');
            }
        }, this);
        this.map.setTileLocationCallback(37, 6, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2014');
            }
        }, this);
        this.map.setTileLocationCallback(44, 5, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2015');
            }
        }, this);
        this.map.setTileLocationCallback(50, 4, 1, 1, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toMileStone(player, tipBox, 'ms2016');
            }
        }, this);
        this.map.setTileLocationCallback(53, 3, 2, 2, function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
            if(player.name === 'player'){
                this.toEnd(player, tipBox);
            }
        }, this);

        //创建图标组
        this.skill.skillIcoGroup = this.game.add.group();

        //初始化uiBox
        // create a new bitmap data object
        var bmd: Phaser.BitmapData = this.game.add.bitmapData(800, 140);
        // draw to the canvas context like normal

        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,800,140);
        bmd.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        bmd.ctx.fill();
        this.uiBox.uiBg = this.game.add.sprite(0, 120, bmd);
        this.uiBox.uiBg.alpha = 0;
        this.uiBox.uiBg.scale.y = 0;
        this.uiBox.uiBg.anchor.y = 0.25;
        this.uiBox.uiBg.fixedToCamera = true;

        this.uiBox.uiText = this.game.add.text(0, 0, "", this.uiBox.style);
        this.uiBox.uiText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        this.uiBox.uiText.setTextBounds(20, 110, 800, 100);
        this.uiBox.uiText.alpha = 0;
        this.uiBox.uiText.fixedToCamera = true;

        //初始生成技能
        var skillTitle = this.game.add.text(20, 30, '技能：', this.uiBox.style);
        skillTitle.fixedToCamera = true;
        this.genSkill(0, this.player.x - 20, 120);
        this.game.time.events.add(500, function(){
            this.genSkill(1, this.player.x, 300);
        }, this);



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
                this.player.body.velocity.x = -300;
                this.player.animations.play('walk');
                isNoKeyPressed = false;
            }else if(rightKey.isDown){
                this.playState.direction =  this.playState.scale.x;
                this.player.body.velocity.x = 300;
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

        //离开里程碑
        if(!this.playState.mileStone.now && this.playState.mileStone.last){
            this.leaveMileStone();
            this.playState.mileStone.now = false;
        }

    }
    toEnd: Function = function(player: Phaser.Sprite, tipBox: Phaser.Sprite){
        this.playState.mileStone.now = true;
        if(!this.playState.mileStone.last){
            if(this.skill.gotIds.length === 16){
                this.gamesound.success.play();
                this.showTips('集齐了所有技能\n可以走上人生巅峰了！\n-End-');
            }else{
                this.gamesound.failure.play();
                this.showTips('还没有集齐所有技能哦...\n' + this.skill.gotIds.length + '/16');
            }
        }
    }
    toMileStone: Function = function(player:Phaser.Sprite, tipBox:Phaser.Sprite, year){
        this.playState.lastMileInx = Number(year.match(/\d+/)[0]) - 2009;
        this.playState.mileStone.now = true;
        //进入里程碑

        if(!this.playState.mileStone.last){
            this.showTips(this.info.milestone[year]);
        }
    }

    leaveMileStone: Function = function(){
        this.hideTips();

        if(this.playState.lastMileInx !== -1){
            var ids = this.info.skillMap[this.playState.lastMileInx];

            for(var i = 0; i < ids.length; i++){
                if(this.skill.allIds.indexOf(ids[i]) === -1){
                    this.skill.allIds.push(ids[i]);
                    var self = this;
                    (function(inx){
                        self.game.time.events.add(150 * inx, function(){
                            var skillSprite = self.genSkill(ids[inx], self.player.x + 30 + 50 * inx);
                            skillSprite.sid = ids[inx];
                        })
                    })(i);

                }
            }
        }
        this.playState.lastMileInx = -1;

    }
    //生成技能图标
    genSkill: Function = function(id: number, x: number, y: number){
        if(typeof y === 'undefined' || y === null){
            y = this.player.y - 200;
        }
        var skillSprite: Phaser.Sprite = this.skill.skillGroup.create(x, y, 'skill', id);
        skillSprite.anchor.setTo(0.5, 0.5);
        skillSprite.width = 40;
        skillSprite.height = 40;
        skillSprite.scale.setTo(0, 0);
        var tween: Phaser.Tween = this.game.add.tween(skillSprite.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Linear.None, true, 0);
        tween.onComplete.add(function(){
            skillSprite.body.gravity.y = this.game.rnd.between(0, 3) * 100 + 200;
        }, this);

        this.game.physics.arcade.enable(skillSprite);
        skillSprite.body.bounce.y = 0.3;
        skillSprite['sid'] = id;

        return skillSprite;

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

    //拾取技能
    getSkill: Function = function(player: Phaser.Sprite, skillSprite: Phaser.Sprite){
        var snd = this.gamesound.getSkill[this.game.rnd.between(0, 4)];
        snd.play();


        var skillIco: Phaser.Sprite = this.game.add.sprite(skillSprite.x - this.game.camera.position.x, skillSprite.y - this.game.camera.position.y, 'skill', skillSprite['sid']);
        skillIco.anchor.setTo(0.5, 0.5);
        skillIco.fixedToCamera = true;

        this.skill.skillIcoGroup.add(skillIco);

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