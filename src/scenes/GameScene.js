const VOLI_KEY = 'voli';
const GROUND_KEY = 'ground';
const GROUNDBG_KEY = 'groundbg'; 
const SPRUCE_KEY = 'spruce'; 
const YARD1_KEY = 'yard1';
const FENCE_KEY = 'fence';
const LAMP_KEY = 'lamp';
const BIKER_KEY = 'spandex'
const HP_KEY = 'hp';
const HPUP_KEY = 'hpup';
const CAR_KEY = 'car';  
const UFO_KEY = 'ufo';
const UFOPROJECTILE_KEY = 'ufoProjectile';
const BOSSPROJECTILE_KEY = 'bossprojectile';
const CAT_KEY = 'cat';
const TREAT_KEY = 'treat';
const JETPACK_KEY = 'jetpack';
const BIGTREAT_KEY = 'bigtreat';
const CATBOSS_KEY = 'catboss';
const BOSSHP_KEY = 'bosshp'
const MAINMUSIC_KEY = 'mainmusic';
const BOSSMUSIC_KEY = 'bossmusic';
const PLAYERHITSOUND_KEY = 'playerhit';
const PLAYERDIESOUND_KEY = 'playerdiesound';
const PLUCKSOUND_KEY = 'plucksound';
const JETPACKSOUND_KEY = 'jetpacksound';
const POWERUPSOUND_KEY = 'powerupsound';
const DRAMATICSOUND_KEY = 'dramaticsound';
const BOSSATTACKSOUND_KEY = 'bossattacksound';
const VICTORYSOUND_KEY = 'victorysound';
const PICKUPSOUND_KEY = 'pickupsound';
const LASERSOUND_KEY = 'lasersound';



export default class PlayGame extends Phaser.Scene {
  
  constructor() {
    super("game-scene");

    this.player = undefined;
    this.cursors = undefined;

    this.gameOverTimer = undefined;
  }
  isGameOver;
  bikerTimer = undefined;
  platform;
  invincibleTimer = undefined;
  playerInvincible = false;

  enemySpawnWeights = [
    {
      enemy:'biker',
      weight: 0.15
    },
    {
      enemy: 'car',
      weight: 0.30
    },
    {
      enemy: 'ufo',
      weight: 0.20
    },
    {
      enemy: 'cat',
      weight: 0.35
    }
  ];
  
  enemySpawnWeightsCumulative = [];
  pickupSpawnWeights = [
    {
      pickup: 'hpup',
      weight: 0.18
    },
    {
      pickup: 'jetpack',
      weight: 0.015
    },
    {
      pickup: 'treat',
      weight: 0.655
    },
    {
      pickup: 'bigtreat',
      weight: 0.15
    },
  ]
  pickupSpawnWeightsCumulative = [];
  jetPackMeter;
  jetPackActive = false;
  spawnEnemyTimer;
  spawnPickupTimer;
  scorePopups = [];

  hpGroup = [];
  playerColliders = [];

  bgGroupFast = [];
  bgGroupMedium = [];
  bgGroupSlow = [];
  lamp;
  enemiesGroup = [];
  enemySpawnRate = 1.0;
  pickupSpawnRate = 1.0;

  // Cat boss variables

  bossFightOn = false;
  bossCurrentPhase;
  bossPhaseTimer;
  bossAttackTimer;
  bossHPGroup = [];
  catboss;
  preload() {
    this.score = 0;
    this.speedMultiplier = 1;
  
    // Loading images and spritsheets
    this.load.image(GROUND_KEY, '../assets/img/ground.png');
    this.load.image(GROUNDBG_KEY, '../assets/img//groundbg.png');
    this.load.image(SPRUCE_KEY, '../assets/img/spruce.png');
    this.load.image(YARD1_KEY, '../assets/img/yard1.png');
    this.load.image(FENCE_KEY, '../assets/img/fence.png');
    this.load.image(LAMP_KEY, '../assets/img/lamp.png');
    this.load.image(HP_KEY, '../assets/img/hp.png');
    this.load.image(TREAT_KEY, '../assets/img/treat.png');
    this.load.image(JETPACK_KEY, '../assets/img/jetpack.png');
    this.load.image(HPUP_KEY, '../assets/img/hpUp.png');
    this.load.image(BIGTREAT_KEY, '../assets/img/bigtreat.png');
    this.load.image(BOSSHP_KEY, '../assets/img/bosshp.png');


    this.load.spritesheet(VOLI_KEY,
      'assets/img/voli_sprite.png',
      { frameWidth: 42, frameHeight: 28});

    this.load.spritesheet(BIKER_KEY,
      'assets/img/spandex.png',
      { frameWidth: 48, frameHeight: 36});

      this.load.spritesheet(CAR_KEY,
        'assets/img/car.png',
        { frameWidth: 136/2, frameHeight: 31});
      
      this.load.spritesheet(UFO_KEY,
        'assets/img/ufo.png',
        { frameWidth: 120/4, frameHeight: 19});

      this.load.spritesheet(UFOPROJECTILE_KEY,
        'assets/img/ufoProjectile.png',
        { frameWidth: 6, frameHeight: 8});
        
        this.load.spritesheet(CAT_KEY,
          'assets/img/cat.png',
          { frameWidth: 25, frameHeight: 24});

        this.load.spritesheet(CATBOSS_KEY,
          '../assets/img/catboss.png',
          { frameWidth: 35, frameHeight:70});
    
        this.load.spritesheet(BOSSPROJECTILE_KEY,
          '../assets/img/bossprojectile.png',
          { frameWidth: 5, frameHeight:10});

    this.load.audio(MAINMUSIC_KEY, ['../assets/audio/main-music.mp3']);
    this.load.audio(BOSSMUSIC_KEY, ['../assets/audio/boss-music.mp3']);
    this.load.audio(PLUCKSOUND_KEY, ['../assets/audio/pluck.mp3']);
    this.load.audio(VICTORYSOUND_KEY, ['../assets/audio/victory.mp3']);
    this.load.audio(DRAMATICSOUND_KEY, ['../assets/audio/dramatic.mp3']);
    this.load.audio(PLAYERDIESOUND_KEY, ['../assets/audio/player-die.mp3']);
    this.load.audio(PLAYERHITSOUND_KEY, ['../assets/audio/player-hit.mp3']);
    this.load.audio(JETPACKSOUND_KEY, ['../assets/audio/jetpack.mp3']);
    this.load.audio(PICKUPSOUND_KEY, ['../assets/audio/pickup.mp3']);
    this.load.audio(POWERUPSOUND_KEY, ['../assets/audio/powerup.mp3']);
    this.load.audio(BOSSATTACKSOUND_KEY, ['../assets/audio/boss-attack-1.mp3']);
    this.load.audio(LASERSOUND_KEY, ['../assets/audio/ufo-shoot.mp3']);
  }

  create() {
    this.isGameOver = false;
    this.createBg();
    this.createPlatform();
    this.createPlayer();

    // Reset spawntimers
    this.spawnEnemyTimer = this.time.addEvent({
      delay: 1000, timeScale: 1.0
    });
    this.spawnPickupTimer = this.time.addEvent({
      delay: 2000, timeScale: 1.0
    });

    this.createEnemyAnims();
    this.createEnemySpawnWeights();
    this.createPickupSpawnWeights();
    this.createHP();
    this.score = this.add.text(40,0, 0).setDepth(2);
    this.enemiesGroup = [];

    this.createBossAnims();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAudio();

    this.mainmusic.play({loop: true});
    this.checkSkips();
    
  }

  createAudio() {
    this.mainmusic = this.sound.add(MAINMUSIC_KEY);
    this.pickupsound = this.sound.add(PICKUPSOUND_KEY);
    this.bossmusic = this.sound.add(BOSSMUSIC_KEY);
    this.dramaticsound = this.sound.add(DRAMATICSOUND_KEY);
    this.plucksound = this.sound.add(PLUCKSOUND_KEY);
    this.powerupsound = this.sound.add(POWERUPSOUND_KEY);
    this.jetpacksound = this.sound.add(JETPACKSOUND_KEY);
    this.bossattacksound = this.sound.add(BOSSATTACKSOUND_KEY); 
    this.playerhitsound = this.sound.add(PLAYERHITSOUND_KEY);
    this.playerdiesound = this.sound.add(PLAYERDIESOUND_KEY);
    this.lasersound = this.sound.add(LASERSOUND_KEY);
  }

  checkSkips() { //check for boss or jetpack skip for testing
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('skiptoboss')) {
      this.startBossFight();
    }
    if (urlParams.has('spawnjetpack')) {
      this.spawnJetpack();
    }

  }

  createHP() { // Create and draw player's HP
    for (let i = 0; i < 3; i++) {
      this.hpGroup.push(this.add.image(10+this.hpGroup.length*4,10, HP_KEY).setDepth(2));
    }
  }

  
  createBg() { // Create the scrolling parallax backgrounds
    this.bgGroupSlow.push(this.add.tileSprite(125, 65,
      250,100, YARD1_KEY)); 

    this.bgGroupFast.push(this.add.tileSprite(125,130,
      250,30, GROUNDBG_KEY));

    this.bgGroupFast.push(this.add.tileSprite(125, 155,
      250, 30, GROUND_KEY));
    
    this.bgGroupMedium.push(this.add.tileSprite(125, 110,
      250,25, FENCE_KEY));
  }

  createPlatform() { // Create the ground platform and lamp platforms
    this.platform = this.physics.add.sprite(125,135).setImmovable().setCollideWorldBounds(true);
    this.platform.setPushable(false);
    this.platform.setSize(250,1);

    this.lamp = this.physics.add.sprite(270,100, LAMP_KEY).setSize(5,1, false);
    this.lamp.setVelocityX(-50);
    this.lamp.setPushable(false);
    this.lamp.body.checkCollision.down = false;
    this.lamp.body.checkCollision.left = false;
    this.lamp.body.checkCollision.right = false;
    this.lamp.body.setOffset(2,5);
  }

  createPlayer() { // Creates the player sprite, physics, and animations
    this.player = this.physics.add.sprite(30,100, VOLI_KEY);
    this.player.setBounce(0.2);
    this.player.setGravity(0,500);
    this.player.setPushable(false);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(37,20, true);

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(VOLI_KEY,
        {start:0, end:0}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(VOLI_KEY,
        {start:1, end:3}),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
      key: 'voliBite',
      frames: this.anims.generateFrameNumbers(VOLI_KEY,
        {start:4, end:4}),
        frameRate: 7,
        repeat: -1
    });
    
    this.anims.create({
      key: 'jetpack',
      frames: this.anims.generateFrameNumbers(VOLI_KEY,
        {start:5, end:6}),
        frameRate: 10,
        repeat: -1
    })

    this.anims.addMix('idle', 'right', 500);    
    this.anims.addMix('voliBite', 'right', 1000);

    this.player.anims.play('right', true);
    
    //Jet pack meter
    this.jetPackMeter = this.add.graphics();
    
    
    this.physics.add.existing(this.bgGroupMedium.at(-1));
    this.physics.add.collider(this.player, this.lamp);
    this.physics.add.collider(this.platform, this.player);
  }

  createEnemyAnims() {
    this.anims.create({
      key: 'bikerLeft',
      frames: this.anims.generateFrameNumbers(BIKER_KEY,
        {start: 0, end:1}),
        frameRate: 3,
        repeat: -1
    });
    this.anims.create({
      key: 'carLeft',
      frames: this.anims.generateFrameNumbers(CAR_KEY,
        {start:0, end:1}),
        frameRate: 5,
        repeat: -1
    })
    this.anims.create({
      key: 'ufoMove',
      frames: this.anims.generateFrameNumbers(UFO_KEY,
        {start:0, end:1}),
        frameRate: 5,
        repeat: -1
    });
      this.anims.create({
      key: 'ufoShoot',
      frames: this.anims.generateFrameNumbers(UFO_KEY,
        {start: 2, end: 3}),
        frameRate: 7,
        repeat: 0
    });
    this.anims.addMix('ufoShoot', 'ufoMove', 1000);
    this.anims.create({
      key: 'ufoProjectile',
      frames: this.anims.generateFrameNumbers(UFOPROJECTILE_KEY,
        {start: 0, end: 1}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
      key: 'cat',
      frames: this.anims.generateFrameNumbers(CAT_KEY,
        {start: 0, end: 1}),
        frameRate: 5,
        repeat: -1
    });
 
  }

  createBossAnims() {
    this.anims.create({
      key:'bossWalk',
      frames: this.anims.generateFrameNumbers(CATBOSS_KEY,
        {start:0, end:1}),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
      key:'bossCallUfo',
      frames: this.anims.generateFrameNumbers(CATBOSS_KEY,
        {start:2, end:2}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.addMix('bossCallUfo', 'bossWalk', 1000);

    this.anims.create({
      key: 'bossTailAttack',
      frames: this.anims. generateFrameNumbers(CATBOSS_KEY,
        {start:3, end: 4}),
        frameRate:3,
        repeat:-1
    });
    this.anims.addMix('bossTailAttack', 'bossWalk', 1500);

    this.anims.create({
      key: 'bossRest',
      frames: this.anims. generateFrameNumbers(CATBOSS_KEY,
        {start:5, end: 5}),
        frameRate:5,
        repeat:-1
    });
    this.anims.create({
      key: 'bossShockwave',
      frames: this.anims.generateFrameNumbers(BOSSPROJECTILE_KEY,
        {start:0, end:2}),
        frameRate: 5,
        repeat: -1
      });
  };

  createEnemySpawnWeights() { // Calculate cumulative weight table to randomize spawns
    let sum = 0;
    this.enemySpawnWeights.forEach((item) => {
      sum += item.weight;
      this.enemySpawnWeightsCumulative.push(sum)
    });
  }

  createPickupSpawnWeights() { // Calculate cumulative weight table to randomize spawns
    let sum = 0;
    this.pickupSpawnWeights.forEach((item) => {
      sum += item.weight;
      this.pickupSpawnWeightsCumulative.push(sum)
    });
  }

  update()
  {
    this.moveBackground();
    
    // Boss fight check, spawn enemies and pickups
    // only when bossfight is not on,
    // otherwise run boss fight logic
    if (this.bossFightOn) {
      this.checkBossPhase();
    } else {
      this.spawnEnemies();
      this.spawnPickups();
    }

    if (!this.isGameOver) {
      if (!this.bossFightOn) {
        this.updateScore(1)
      
      // Check if enough points for bossfight
      if (this.score._text > 20000 && this.score._text < 24999) {
        this.startBossFight();
      }};
      // Increase game speed and difficulty when points increase
      if ((3000 + this.speedMultiplier*20000) < this.score._text) {
        this.speedMultiplier += 0.1;
        this.enemySpawnRate += 0.05;
        this.pickupSpawnRate -= 0.05;
        this.newScorePopup(100,30, 'Difficulty up!!', {color: 0xff0000});
      };

      
      
      // Manage popups
      this.checkScorePopups();

      // player controls
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160)
      } else {
        this.player.setVelocityX(0);
      };
      if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
        this.player.setVelocityY(-250);
        this.plucksound.play();
        
        };

      // Update cycle when jetpack active
      if (this.jetPackActive) {
        if (this.invincibleTimer.getProgress() == 1) {
          this.jetpackEnd();
        }
        this.drawJetpackMeter();
      } else if (this.playerInvincible) {
        if (this.invincibleTimer.getProgress() == 1) {
          this.playerInvincible = false;
        }
      }
  } else {
    // If game is over and game over timer is done,
    // go to game over scene
    if (this.gameOverTimer.getProgress() == 1) {
      this.gameOverTimer = undefined;
      this.scene.stop('game-scene');
      this.scene.start('gameover-scene', {score:this.score._text});
    }
  }}

  moveBackground() {
    if (this.lamp.x < 0) {
      this.lamp.x = 250 + Math.random()*100;
    }
    if (this.speedMultiplier == 0) {
      this.lamp.setVelocityX(0);
    }
    this.bgGroupFast.forEach(bg => {
      bg.tilePositionX += 1.1 * this.speedMultiplier;
    });

    this.bgGroupMedium.forEach(bg => {
      bg.tilePositionX += 1 * this.speedMultiplier;
    });

    this.bgGroupSlow.forEach(bg => {
      bg.tilePositionX += 0.5 * this.speedMultiplier;
    });
  }
  
  newScorePopup(x,y,score) {
    this.scorePopups.push({
      score: this.add.text(x-20,y-20, score),
      timer: this.time.addEvent({
        delay: 1500, timeScale: 1.0
      })
    })
  }

  checkScorePopups() {
    if (this.scorePopups.length == 0) {

      return
    }

    if (this.scorePopups.at(0).timer.getProgress() == 1) {
      this.scorePopups.at(0).score.destroy();
      this.scorePopups.at(0).timer.destroy();
      this.scorePopups.shift();
    }
  }

  spawnEnemies() {

    if (this.spawnEnemyTimer.getProgress() == 1 && !this.bossFightOn){
      
      this.ufoShoot();
      let random = Math.random();
      let enemyIndex = this.enemySpawnWeightsCumulative.findIndex(weight => 
        weight>=random);
      let enemy = this.enemySpawnWeights[enemyIndex].enemy;
      switch(enemy) {

        case 'biker':
          this.spawnBiker();
          break;
          
        case 'car':
          this.spawnCar();
          break;

        case 'ufo':
          this.spawnUfo();
          break;

        case 'cat':
          this.spawnCat();
          break;

        default:
          console.log('unknown enemy');
      }
      this.spawnEnemyTimer.reset({
        delay: (Math.random()*2000+ 700),
        timeScale:this.enemySpawnRate
      });
    }
  }


  spawnBiker() {
    this.enemiesGroup.push(this.physics.add.sprite(270,120, BIKER_KEY)
      .setVelocityX(-40* this.speedMultiplier).anims.play('bikerLeft', true));
      this.enemiesGroup.at(-1).body.setSize(20,22, true);

      this.playerColliders.push(this.physics.add.collider(this.enemiesGroup.at(-1), this.player,
      (obj1, obj2) => {
        this.enemiesGroup.splice(this.enemiesGroup.findIndex((obj) => obj === obj1));
        this.destroyAnimation(obj1);
        this.loseHp();
      }))
  };

  spawnCar() {
      this.enemiesGroup.push(this.physics.add.sprite(290,145, CAR_KEY)
      .setVelocityX(-60* this.speedMultiplier).anims.play('carLeft', true).setSize(20,31, false).setOffset(35,0));

      this.playerColliders.push(this.physics.add.collider(
      this.enemiesGroup.at(-1), this.player,
      (obj1, obj2) => {
      this.enemiesGroup.splice(this.enemiesGroup.findIndex((obj) => obj === obj1));
      this.destroyAnimation(obj1);
      this.loseHp();
      }))
  }  

  spawnUfo() {
    this.enemiesGroup.push(this.physics.add.sprite(290, 20, UFO_KEY)
    .setVelocityX(-(Math.random()*10+20)* this.speedMultiplier).anims.play('ufoMove', true));

    this.playerColliders.push(this.physics.add.collider(
      this.enemiesGroup.at(-1), this.player,
      (obj1, obj2) => {
        this.enemiesGroup.splice(this.enemiesGroup.findIndex(obj => obj === obj1))
      this.destroyAnimation(obj1);
      this.loseHp();
      }))
  }

  spawnCat(offSetX=0, offSetY=0, offSetAngle=1) {
    let yrandom = 80 + Math.random()*50;
  
    const newCat =this.physics.add.sprite(320+offSetX,145+offSetY, CAT_KEY)
    .setVelocityX(-yrandom).setVelocityY(-yrandom * offSetAngle * this.speedMultiplier).anims.play('cat', true).setGravity(0, 60)
    .setRotation(-(Math.PI/4))
    .setSize(10,10, true);

    this.playerColliders.push(this.physics.add.collider(
    newCat, this.player,
    (obj1, obj2) => {
    this.enemiesGroup.splice(this.enemiesGroup.findIndex((obj) => obj === obj1));
    this.destroyAnimation(obj1);
    this.loseHp();
    }));
    this.enemiesGroup.push(newCat);
  }

  ufoShoot() {
    this.enemiesGroup.forEach(ufo => {
      if (ufo.texture.key == UFO_KEY) {
        ufo.anims.play('ufoShoot', true);
        ufo.anims.play('ufoMove', true);
        let ufoProjectile = this.physics.add.sprite(0,0, UFOPROJECTILE_KEY).copyPosition(ufo).setOffset(0,15);
        ufoProjectile.anims.play('ufoProjectile');
        ufoProjectile.setVelocityY(100* this.speedMultiplier);
        ufoProjectile.setSize(4, 6, true);
        this.physics.add.collider(this.player, ufoProjectile, (obj1, obj2) => {
          obj2.destroy();
          this.loseHp();
        });
        this.enemiesGroup.push(ufoProjectile)
      }
    })
;
  }

  spawnPickups() {

    if (this.spawnPickupTimer.getProgress() == 1 && !this.bossFightOn){
      let random = Math.random();
      let pickupIndex = this.pickupSpawnWeightsCumulative.findIndex(weight => 
        weight>=random);
      let pickup = this.pickupSpawnWeights[pickupIndex].pickup;
      let x = 300;
      let y = 20 + Math.random()*100;
      switch(pickup) {

        case 'treat':
          this.spawnTreat(x,y);
          break;
          
        case 'bigtreat':
          this.spawnBigTreat(x,y);
          break;

        case 'hpup':
          this.spawnHPUp(x,y);
          break;

        case 'jetpack':
          this.spawnJetpack(x,y);
          break;

        default:
          console.log('unknown pickup');
      }
      this.spawnPickupTimer.reset({
        delay: (Math.random()*4000+ 3000),
        timeScale:this.enemySpawnRate
      });
    }
  }

  spawnJetpack() {
    let newJetpack = this.physics.add.sprite(290,120, JETPACK_KEY)
    .setVelocityX(-60);

    this.playerColliders.push(this.physics.add.collider(
    newJetpack, this.player,
    (obj1, obj2) => {
      obj1.destroy();
      this.jetPack();
    }));
  }
  spawnTreat(x, y) {
    let newTreat = this.physics.add.sprite(x, y, TREAT_KEY)
    .setVelocityX(-60);

    this.playerColliders.push(this.physics.add.collider(
      newTreat, this.player,
      (obj1, obj2) => {
        obj1.destroy();
        this.newScorePopup(obj1.x, obj1.y, 300);
        this.updateScore(300);
        this.pickupsound.play();
      }
    ))
  } 

  spawnBigTreat(x, y) {
    let newBigTreat = this.physics.add.sprite(x, y, BIGTREAT_KEY)
    .setVelocityX(-60);

    this.playerColliders.push(this.physics.add.collider(
      newBigTreat, this.player,
      (obj1, obj2) => {
        obj1.destroy();
        this.newScorePopup(obj1.x, obj1.y, 1000);
        this.updateScore(1000);
        this.pickupsound.play();
      }
    ))
  }
  spawnHPUp(x, y) {
    let newHPUp = this.physics.add.sprite(x, y, HPUP_KEY)
    .setVelocityX(-60);

    this.playerColliders.push(this.physics.add.collider(
      newHPUp, this.player,
      (obj1, obj2) => {
        obj1.destroy();
        this.gainHp();
      }
    ))
  }

  updateScore(score) {
    let newScore = Number.parseInt(this.score._text) + score;
    this.score.setText(newScore);
    this.score.updateText();
  }


  destroyAnimation(object) {
    if (this.playerInvincible) {
      this.pickupsound.play();
      this.newScorePopup(this.player.x,this.player.y,200);
      this.updateScore(200);
    }

    let deathSprite = this.physics.add.sprite(0,0, object.texture.key).copyPosition(object);
    object.destroy();
    deathSprite.setGravity(0,100);
    deathSprite.setFlipY(true);
    deathSprite.setVelocityX((Math.random()-0.5)*100);
    deathSprite.setVelocityY(-80);
  };

  loseHp() {
    if (!this.playerInvincible) {
      
      this.playerhitsound.play();
      this.player.anims.play('idle', true);
      this.player.anims.play('right', true);
      this.hpGroup.at(-1).destroy();
      this.hpGroup.pop();
      if (this.hpGroup.length <= 0) {
        this.sound.stopAll();
        this.playerdiesound.play();
        this.gameOver();
    }
    }
  };

  gainHp() {
    if (this.hpGroup.length < 5) {
      this.powerupsound.play();
      this.newScorePopup(this.player.x, this.player.y, 'HP UP');
      this.hpGroup.push(this.add.image(10+this.hpGroup.length*4,10, HP_KEY).setDepth(2));
    }
  }

  jetPack() { // Initiate jetpack logic, increases speed and makes player invincible a time
    this.playerInvincible = true;
    this.jetPackActive = true;
    this.speedMultiplier += 4;
    this.enemySpawnRate += 4;
    this.lamp.setVelocityX(-150);
    this.player.setGravity(0,300);
    this.invincibleTimer = this.time.addEvent({
      delay: 8000, timeScale: 1.0
    });
    this.player.anims.play('jetpack', true);
    this.jetpacksound.play();
    this.powerupsound.play();
  }

  jetpackEnd() { // Ends jetpack, resets values to normal
    this.playerInvincible = false;
    this.jetPackActive = false;
    this.speedMultiplier -= 4;
    this.enemySpawnRate -= 4;
    this.player.setGravity(0,500);
    this.jetPackMeter.clear();
    
    this.lamp.setVelocityX(-50);
    this.player.anims.play('right', true);
  }

  drawJetpackMeter() {
    const meter = this.jetPackMeter;
    meter.clear();
    const angle = (360 * this.invincibleTimer.getProgress() - 90);
    meter.fillStyle(0xf00000, 1);
    meter.slice(0,0,7, Phaser.Math.DegToRad(360-angle), Phaser.Math.DegToRad(90), true)
    .setX(this.player.x - 10)
    .setY(this.player.y - 8);
    meter.fillPath().setDepth(1);
  }


  gameOver() { // Initiate game over sequence and set game over timer
    this.gameOverTimer = this.time.addEvent({
      delay: 3000, timeScale: 1.0
    });
    this.speedMultiplier = 0;
    this.destroyAnimation(this.player);
    this.isGameOver = true;
  }
  
  startBossFight() {
    this.sound.stopAll();
    this.scene.pause('game-scene');
    this.scene.run('bosscinematic-scene');
    this.createBossHp();
    this.bossFightOn = true;
    this.spawnBoss();
    this.bossCurrentPhase = 0;
    this.bossPhaseTimer = this.time.addEvent({delay:3000, timeScale:1.0});
    this.bossAttackTimer = this.time.addEvent({delay:500, timeScale:1.0});
    this.bossmusic.play({loop: true});
  }

  checkBossPhase() { // Responsible for running all boss logic when fight is on
    // Attack is attacktimer is done, changes boss phase
    // if boss phase timer is full.
    if(this.bossPhaseTimer.getProgress() == 1) {
      this.bossNextPhase();
    } else {
      switch (this.bossCurrentPhase) {

        case 0: // Attack pattern 2, call ufo
          if (this.bossAttackTimer.getProgress() == 1) {
            this.bossAttack2();
          }
          break;
        
        case 1: // Attack pattern 1, shoot cats
          if (this.bossAttackTimer.getProgress() == 1) {
            this.bossAttack1();
          }
        break;

        case 2: // Attack pattern 2, call ufo
          if (this.bossAttackTimer.getProgress() == 1) {
            this.bossAttack2();
          }
          break;
        
        case 3: // Attack pattern 1, shoot cats
          if (this.bossAttackTimer.getProgress() == 1) {
            this.bossAttack1();
          }
          break;
          
        case 4: // Attack pattern 3, tail whip
          if (this.bossAttackTimer.getProgress() == 1) {
            this.bossAttack3();
          }
          break;

        case 5: // Rest, boss vulnerable
          this.bossRest();
          break;
        default: 
          throw new Error('Unknown boss phase');
      }
    }
  }

  bossNextPhase() { // Go to next phase or return to phase 0 if on phase 5.
    this.bossCurrentPhase++;
      if (this.bossCurrentPhase > 5) {
        // Resetting boss hitbox when returning from rest mode
        this.catboss.body.checkCollision.right = true;
        this.catboss.body.checkCollision.left = true;
        this.catboss.body.checkCollision.down = true;
        this.catboss.body.setSize(35,70, true);
        this.bossCurrentPhase = 0;
      }
      // reset boss phase timer to 3 seconds
    this.bossPhaseTimer.reset({delay:3000, timeScale:1.0});
  }

  bossAttack1() { // Attack pattern 1, shoot cats from catnnon, shoot from ufo
    this.catboss.anims.play('bossWalk', true);
    this.spawnCat(-100, -45, 0.5);
    this.bossattacksound.play();
    this.ufoShoot();
    this.bossAttackTimer.reset({delay:550, timeScale:1.0});
  }

  bossAttack2() { // Attack pattern 2, calls ufo and shoots from ufo
    this.catboss.anims.play('bossCallUfo', true);
    this.catboss.anims.play('bossWalk', true);
    this.spawnUfo();
    this.ufoShoot();
    this.bossAttackTimer.reset({delay:3000, timeScale:1.0});
  }

  bossAttack3() { // Attack pattern 3, tail whip.
    this.lasersound.play();
    this.catboss.anims.play('bossTailAttack', true);
    this.catboss.anims.play('bossWalk', true);
    const newProjectile = this.physics.add.sprite(BOSSPROJECTILE_KEY,0,0)
    .setPosition(250, 120)
    .setVelocityX(-80)
    .setFlipX(true)
    .setDepth(3)
    .setSize(2,8)
    .anims.play('bossShockwave', true);
    this.enemiesGroup.push(newProjectile);
    this.physics.add.collider(this.player, newProjectile, (obj1, obj2) => {
      obj2.destroy();
      this.loseHp();
    });

    this.bossAttackTimer.reset({delay:1000, timeScale:1.0});
  
  }

  bossRest() { // Boss rest sequence, makes boss vulnerable to attack from above
    if (this.bossAttackTimer.getProgress() == 1) {
      this.newScorePopup(220, 80, 'ZZzzz...');
      this.bossAttackTimer.reset({delay:1500, timeScale:1.0});
    }
    this.catboss.body.checkCollision.right = false;
    this.catboss.body.checkCollision.left = false;
    this.catboss.body.checkCollision.down = false;
    this.catboss.body.setSize(10,20, true);
    this.catboss.anims.play('bossRest', true);
  }

 spawnBoss() { 
    this.catboss = this.physics.add.sprite(225,100, CATBOSS_KEY).setDepth(2);
   
    this.catboss.setPushable(false);
    this.catboss.anims.play('bossWalk', true);
    this.playerColliders.push(
      this.physics.add.collider(this.player, this.catboss, 
        (obj1, obj2) => 
          {if (this.bossCurrentPhase == 5) {
              this.bossNextPhase();
              this.bossLoseHP();
            } else (
              this.loseHp()
            )}
        )
      )
  }

  createBossHp() { // Draw and set boss hp
    for (let i = 0; i<5; i++) {
      this.bossHPGroup.push(this.add.image(230-this.bossHPGroup.length*5,10, BOSSHP_KEY).setDepth(2));
    }
  }

  bossLoseHP() { // Destroy one of boss's HP and check death

    // Give player 2 sec invincibility 
    this.playerInvincible = true;
    this.invincibleTimer = this.time.addEvent({
      delay: 2000, timeScale: 1.0
    })
    // Delete 1 hp from boss
    this.bossHPGroup.at(-1).destroy();
    this.bossHPGroup.pop();
    this.newScorePopup(this.player.x, this.player.y, 200);
    this.pickupsound.play();
    this.updateScore(200);
    // If last hp, destroy boss and stop boss fight
    if (this.bossHPGroup.length == 0) {
      this.sound.stopAll();
      this.mainmusic.play();
      this.bossFightOn = false;
      this.destroyAnimation(this.catboss);
      this.updateScore(4000);
      this.newScorePopup(140,100,4000);
    }
  }
}