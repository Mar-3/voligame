export default class MainMenuScene extends Phaser.Scene {

  cursors;
  constructor() {
    super("mainmenu-scene");
  }

  selection = 0;
  selectBone;
  defaultHiscores = [
    {
    name: 'VOL',
    score: 30000
    },
    {
    name: 'VOL',
    score: 25000
    },
    {
    name: 'VOL',
    score: 2000
    },
    {
    name: 'VOL',
    score: 1500
    },
    {
    name: 'VOL',
    score: 1000
    },
  ];
  
  preload() {

    this.cursors = this.input.keyboard;
    this.load.image('button', 'assets/button.png');
    this.load.image('bone', 'assets/hp.png');
    
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.text(75,10, 'VOLI', {
      fontSize: '40px',
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.add.image(125,75,'button').setScale(0.8);
    this.add.image(125,110,'button').setScale(0.8);
    this.add.image(125,145,'button').setScale(0.8);
    this.add.text(107,65, 'PLAY', { fontSize: '14px', stroke: '#00000', strokeThickness: 3});
    this.add.text(90,102, 'HISCORES', { fontSize: '14px', stroke: '#00000', strokeThickness: 3});
    
    this.add.text(100,135, 'GUIDE', { fontSize: '14px', stroke: '#00000', strokeThickness: 3});
    this.selectBone = this.add.image(160, 75, 'bone').setScale(1.5);
    this.checkHiscores();
  }

  checkHiscores() {
    const hiscores = localStorage.getItem('hiscores');
    if (hiscores === null) {
      localStorage.setItem('hiscores', JSON.stringify(this.defaultHiscores));
    }
  }

  update() {

    if (this.cursors.space.isDown) {
      switch (this.selection) {
        case 0:  
          this.scene.sleep('mainmenu-scene');
          this.scene.start('game-scene');
          break;
        case 1:
          this.scene.sleep('mainmenu-scene');
          this.scene.start('highscore-scene', {score: 0});
          break;
        case 2: 
          this.scene.sleep('mainmenu-scene');
          this.scene.start('manual-scene');
          break;
        default:
          console.log("unknown option");
      }
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.selection < 2) {
      this.selection ++;
    }
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.selection > 0) {
      this.selection --;
    }
    this.selectBone.setPosition(160, 75+this.selection*35)
  }
}