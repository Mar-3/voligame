const VOLI_KEY = 'voli';
const BOSS_KEY = 'boss';

export default class BossCinematic extends Phaser.Scene {


  constructor() {
    super("bosscinematic-scene");
  }

  timer;
  renderOrder = 0;

  preload() {
    this.load.spritesheet(VOLI_KEY,
      'assets/img/voli_sprite.png',
      { frameWidth: 42, frameHeight: 28});

      this.load.spritesheet(BOSS_KEY,
        '../assets/img/catboss.png',
        { frameWidth: 35, frameHeight:70});
    this.load.audio('dramatic',['../assets/audio/dramatic.mp3']);
    this.load.audio('bossattack', ['../assets/audio/boss-attack-1.mp3']);
  }

  create() {
    this.thumpaudio = this.sound.add('bossattack');
    this.sound.add('dramatic').play();
    this.timer = this.time.addEvent({delay: 1000, timeScale:1.0});
  }

  update() {
    if (this.timer.getProgress() == 1) {

      switch(this.renderOrder) {
        case 0:
          const voli = this.add.sprite(20,60, VOLI_KEY);
          voli.setScale(4);
          this.timer.reset({delay:1500, timeScale:1.0});
          break;

        case 1:
          this.thumpaudio.play();
          const graphic1 = this.add.graphics();
          graphic1.fillStyle(0xf2020a, 0.8);
          graphic1.fillRect(90,20, 140,140)
          .setRotation(Phaser.Math.DegToRad(45))
          .setDepth(-1);
          this.add.text(10, 120, 'VOLI', {fontSize: '24px', fontColor: 0xffffff});
          this.timer.reset({delay:1500, timeScale:1.0});
          break;

        case 2:
          this.thumpaudio.play();
          this.add.text(100, 70, 'VS', {fontSize: '40px',fontStyle: 'bold', fontColor: 0xffffff});
          this.timer.reset({delay:1500, timeScale:1.0});
          
          break;

        case 3:
          this.thumpaudio.play();
          const graphic2 = this.add.graphics();
          graphic2.fillStyle(0x00000,0.8);
          graphic2.fillRect(110,-175, 130,130)
          .setRotation(Phaser.Math.DegToRad(45))
          .setDepth(-1);
          const boss = this.add.sprite(200,150, BOSS_KEY);
          boss.setScale(3);
          this.timer.reset({delay:500, timeScale:1.0});
          break;
          
        case 4:
          this.add.text(130, 20, 'CAT KING', {fontSize: '24px', fontColor: 0xffffff});
          this.timer.reset({delay:1500, timeScale:1.0});
          break;
          

        case 5:
          this.scene.stop('bosscinematic-scene');
          this.scene.run('game-scene');
        default:
          console.log('unknown');
      }
      this.renderOrder++;

    }
  }

}
 