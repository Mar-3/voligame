export default class ManualScene extends Phaser.Scene  {

  constructor() {
    super('manual-scene')
  }

  preload(){
    this.cursors = this.input.keyboard.createCursorKeys();

  }

  create(){
    this.slides = [
      'ABOUT/nVOLI is an arcade style platformer, where you control Voli the dog./n',
      ''
    ]
    this.slide = 0;
    this.add.text(100,10, 'VOLI - GUIDE')
    this.manualtext = this.add.text(100,30,'');
    this.add.text(100,150, '(Press space to continue)',{fontSize:'12px'})
  }
  
  update() {
    if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.slide++;
      if (this.slide > 4) {
        this.scene.stop()
      }
    }
    this.manualtext.setText(this.slides.at(this.slide));
  }

}