

export default class GameOver extends Phaser.Scene {


  constructor() {
    super("gameover-scene");
  }
  
  data;

  init(data) {
    this.data = data;
  }
  
  preload() {
    
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.text(75,50, 'GAME OVER');
    this.add.text(85,80,'Score:' + this.data.score);
    this.events.emit('postScore', this.data.score);
  }
  
  update() {
    if (this.cursors.space.isDown) {
      this.scene.run('highscore-scene', this.data);
      this.scene.stop('gameover-scene');
    }
  }
}