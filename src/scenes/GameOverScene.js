

export default class GameOver extends Phaser.Scene {


  constructor() {
    super("gameover-scene");
  }
  
  data;

  init(data) {
    this.data = data;
  }
  
  preload() {
    this.load.audio('gameoversound', ['assets/audio/game-over.mp3']);
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.text(75,50, 'GAME OVER');
    this.add.text(85,80,'Score:' + this.data.score);
    this.sound.add('gameoversound').play();
  }
  
  update() {
    if (this.cursors.space.isDown) {
      this.scene.run('highscore-scene', this.data);
      this.scene.stop('gameover-scene');
    }
  }
}
