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
const BITE_KEY = 'bite';
const CAT_KEY = 'cat';
const TREAT_KEY = 'treat';
const JETPACK_KEY = 'jetpack';
const BIGTREAT_KEY = 'bigtreat';


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
      weight: 0.2
    },
    {
      enemy: 'car',
      weight: 0.35
    },
    {
      enemy: 'ufo',
      weight: 0.20
    },
    {
      enemy: 'cat',
      weight: 0.25
    }
  ];
  enemySpawnWeightsCumulative = []
  
  pickupSpawnWeights = [
    {
      pickup: 'hpup',
      weight: 0.2
    },
    {
      pickup: 'jetpack',
      weight: 0.05
    },
    {
      pickup: 'treat',
      weight: 0.6
    },
    {
      pickup: 'bigtreat',
      weight: 0.15
    },
  ]
  pickupSpawnWeightsCumulative = [];
  jetPackMeter;
  spawnEnemyTimer;
  spawnPickupTimer;
  scorePopups = [];

  hpGroup = [];
  playerColliders = [];

  bgGroupFast = [];
  bgGroupMedium = [];
  bgGroupSlow = [];
  lamp;
  enemiesGroup = []
  enemySpawnRate = 0.9;

;

  preload() {
    this.score = 0;
    this.speedMultiplier = 1;
  
  
    this.load.image(GROUND_KEY, '../assets/ground.png');
    this.load.image(GROUNDBG_KEY, '../assets/groundbg.png');
    this.load.image(SPRUCE_KEY, '../assets/spruce.png');
    this.load.image(YARD1_KEY, '../assets/yard1.png');
    this.load.image(FENCE_KEY, '../assets/fence.png');
    this.load.image(LAMP_KEY, '../assets/lamp.png');
    this.load.image(HP_KEY, '../assets/hp.png');
    this.load.image(TREAT_KEY, '../assets/treat.png');
    this.load.image(JETPACK_KEY, '../assets/jetpack.png');
    this.load.image(HPUP_KEY, '../assets/hpUp.png');
    this.load.image(BIGTREAT_KEY, '../assets/bigtreat.png');


    this.load.spritesheet(VOLI_KEY,
      'assets/voli_sprite.png',
      { frameWidth: 42, frameHeight: 28});

    this.load.spritesheet(BITE_KEY,
      'assets/bite.png',
      { frameWidth: 5, frameHeight: 10});

    this.load.spritesheet(BIKER_KEY,
      'assets/spandex.png',
      { frameWidth: 48, frameHeight: 36});

      this.load.spritesheet(CAR_KEY,
        'assets/car.png',
        { frameWidth: 136/2, frameHeight: 31});
      
      this.load.spritesheet(UFO_KEY,
        'assets/ufo.png',
        { frameWidth: 120/4, frameHeight: 19});

      this.load.spritesheet(UFOPROJECTILE_KEY,
        'assets/ufoProjectile.png',
        { frameWidth: 6, frameHeight: 8});
        
        this.load.spritesheet(CAT_KEY,
          'assets/cat.png',
          { frameWidth: 25, frameHeight: 24});

  }

  create() {

    this.add.graphics().slice(100,100,Math.PI/4, Math.PI*2, true)
    .fillStyle(0xf00000, 1).fillPath();

    this.isGameOver = false;
    this.createBg();
    this.createPlatform();
    this.createPlayer();
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


    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createHP() {
    for (let i = 0; i < 3; i++) {
      this.hpGroup.push(this.add.image(10+this.hpGroup.length*4,10, HP_KEY).setDepth(2));
    }
  }

  
  createBg() {
    this.bgGroupSlow.push(this.add.tileSprite(125, 65,
      250,100, YARD1_KEY)); 

    this.bgGroupFast.push(this.add.tileSprite(125,130,
      250,30, GROUNDBG_KEY));

    this.bgGroupFast.push(this.add.tileSprite(125, 155,
      250, 30, GROUND_KEY));
    
    this.bgGroupMedium.push(this.add.tileSprite(125, 110,
      250,25, FENCE_KEY));
  }

  createPlatform() {
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

  createPlayer() {
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
      key: 'bite',
      frames: this.anims.generateFrameNumbers(BITE_KEY,
        {start:0, end:2}),
        frameRate: 4,
        repeat: 1
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

  createEnemySpawnWeights() {
    let sum = 0;
    this.enemySpawnWeights.forEach((item) => {
      sum += item.weight;
      this.enemySpawnWeightsCumulative.push(sum)
    });
  }

  createPickupSpawnWeights() {
    let sum = 0;
    this.pickupSpawnWeights.forEach((item) => {
      sum += item.weight;
      this.pickupSpawnWeightsCumulative.push(sum)
    });
  }

  update()
  {
    this.moveBackground();

    this.spawnEnemies();


    if (!this.isGameOver) {
      this.spawnPickups();
      
      this.checkScorePopups();
      this.updateScore(1);
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);

      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160)
      } else {
        this.player.setVelocityX(0);
      };

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-250);
        };
      if (this.playerInvincible) {
        if (this.invincibleTimer.getProgress() == 1) {
          this.jetpackEnd();
        }
        this.drawJetpackMeter();
      }
  } else {
    if (this.gameOverTimer.getProgress() == 1) {
      this.gameOverTimer = undefined;
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

    if (this.spawnEnemyTimer.getProgress() == 1){
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
      this.enemiesGroup.forEach(enemy => {
        if (enemy.texture.key == UFO_KEY) {
          this.ufoShoot(enemy);
        }
      })
      this.spawnEnemyTimer.reset({
        delay: (Math.random()*2000+ 500),
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

  spawnCat() {
    let yrandom = 80 + Math.random()*50;
  
    const newCat =this.physics.add.sprite(320,145, CAT_KEY)
    .setVelocityX(-yrandom).setVelocityY(-yrandom* this.speedMultiplier).anims.play('cat', true).setGravity(0, 60)
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

  ufoShoot(ufo) {
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
    this.enemiesGroup.push(ufoProjectile);
  }

  spawnPickups() {

    if (this.spawnPickupTimer.getProgress() == 1){
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

    let deathSprite = this.physics.add.sprite(0,0, object.texture.key).copyPosition(object);
    object.destroy();
    deathSprite.setGravity(0,100);
    deathSprite.setFlipY(true);
    deathSprite.setVelocityX((Math.random()-0.5)*100);
    deathSprite.setVelocityY(-80);
  };

  loseHp() {
    if (!this.playerInvincible) {
      this.player.anims.play('idle', true);
      this.player.anims.play('right', true);
      this.hpGroup.at(-1).destroy();
      this.hpGroup.pop();
      if (this.hpGroup.length <= 0) {
        this.gameOver();
    }
    } else {
      this.newScorePopup(this.player.x,this.player.y,200);
      this.updateScore(200);
    }
  };

  gainHp() {
    if (this.hpGroup.length <= 5) {
      this.newScorePopup(this.player.x, this.player.y, 'HP UP');
      this.hpGroup.push(this.add.image(10+this.hpGroup.length*4,10, HP_KEY).setDepth(2));
    }
  }

  jetPack() {
    this.playerInvincible = 1;
    this.speedMultiplier = 4;
    this.enemySpawnRate = 4.0;
    this.lamp.setVelocityX(-150);
    this.player.setGravity(0,300);
    this.invincibleTimer = this.time.addEvent({
      delay: 8000, timeScale: 1.0
    });
    this.player.anims.play('jetpack', true);
  }

  jetpackEnd() {
    this.playerInvincible = 0;
    this.speedMultiplier = 1;
    this.enemySpawnRate = 1;
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


  gameOver() {
    this.gameOverTimer = this.time.addEvent({
      delay: 3000, timeScale: 1.0
    });
    this.speedMultiplier = 0;
    this.destroyAnimation(this.player);
    this.isGameOver = true;
  }
  
}
