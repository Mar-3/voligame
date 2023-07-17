const VOLI_KEY = 'voli';
const GROUND_KEY = 'ground';
const GROUNDBG_KEY = 'groundbg'; 
const SPRUCE_KEY = 'spruce'; 
const YARD1_KEY = 'yard1';
const FENCE_KEY = 'fence';
const LAMP_KEY = 'lamp';
const BIKER_KEY = 'spandex'

export default class PlayGame extends Phaser.Scene {
  
  constructor() {
    super("game-scene")

    this.player = undefined;
    this.cursors = undefined;
  }

  cooldown = 0;

  bgGroupFast = [];
  bgGroupMedium = [];
  bgGroupSlow = [];
  enemiesGroup = [];

  preload() {
    
    this.load.image(GROUND_KEY, '../assets/ground.png');
    this.load.image(GROUNDBG_KEY, '../assets/groundbg.png');
    this.load.image(SPRUCE_KEY, '../assets/spruce.png');
    this.load.image(YARD1_KEY, '../assets/yard1.png');
    this.load.image(FENCE_KEY, '../assets/fence.png');
    this.load.image(LAMP_KEY, '../assets/lamp.png');

    this.load.spritesheet(VOLI_KEY,
      'assets/voli_sprite.png',
      { frameWidth: 42, frameHeight: 28});

    this.load.spritesheet(BIKER_KEY,
      'assets/spandex.png',
      { frameWidth: 48, frameHeight: 36});

  }

  create() {
    this.createBg();
    this.createPlatform();
    const ground = this.physics.add.sprite(125,130).setImmovable().setCollideWorldBounds(true);
    ground.setPushable(false);
    ground.setSize(250,1);
    this.createPlayer();
    this.physics.add.collider(ground, this.player);
    this.createEnemy();

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Used as reference for making parallax backgroung:
  // https://www.joshmorony.com/how-to-create-a-parallax-background-in-phaser/
  
  createBg() {
    this.bgGroupSlow.push(this.add.tileSprite(125, 65,
      250,100, YARD1_KEY)); 
    //Add fast backgrounds
    this.bgGroupFast.push(this.add.tileSprite(125,130,
      250,30, GROUNDBG_KEY));
    this.bgGroupFast.push(this.add.tileSprite(125, 155,
      250, 30, GROUND_KEY));
    
      this.bgGroupMedium.push(this.add.tileSprite(125, 110,
        250,25, FENCE_KEY));
      this.bgGroupMedium.push(this.add.tileSprite(123, 100,
        250, 60, LAMP_KEY));
  }

  createPlatform() {
  }

  createPlayer() {
    this.player = this.physics.add.sprite(30,0, VOLI_KEY);
    this.player.setBounce(0.2);
    this.player.setGravity(0,500);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(VOLI_KEY,
        {start:1, end:3}),
        frameRate: 7,
        repeat: -1
    });
  }

  createEnemy() {
    this.anims.create({
      key: 'bikerLeft',
      frames: this.anims.generateFrameNumbers(BIKER_KEY,
        {start: 0, end:1}),
        frameRate: 3,
        repeat: -1
    });
  }

  update()
  {
    this.player.anims.play('right', true);
    this.moveBackground();
    this.createEnemies();


    
    if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
    } else {
      this.player.setVelocityX(0);
    };

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-200);
    }
  }
  moveBackground() {
    this.bgGroupFast.forEach(bg => {
      bg.tilePositionX += 1.1;
    });

    this.bgGroupMedium.forEach(bg => {
      bg.tilePositionX += 1;
    })
    this.bgGroupSlow.forEach(bg => {
      bg.tilePositionX += 0.5;
    });
  }

  createEnemies() {
    if (this.cooldown < 0) {
      this.enemiesGroup.push(this.physics.add.sprite(250,120, BIKER_KEY)
      .setVelocityX(-20).anims.play('bikerLeft', true));
      this.cooldown = 300;
    }
    this.cooldown -= 1;


  }
  
}
