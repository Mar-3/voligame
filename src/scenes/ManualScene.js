export default class ManualScene extends Phaser.Scene  {

  constructor() {
    super('manual-scene')
  }

  preload(){
    this.cursors = this.input.keyboard.createCursorKeys();

  }

  create(){
    this.slides = [
      "ABOUT: VOLI is an arcade style platformer, where you control Voli the dog. The aim of the game is to avert enemies and collect pick ups to gain high score and beat the king of the cats",
      'CONTROLS: Right and left arrow move Voli horizontally, space or up arrow make Voli jump. Voli can jump on top of the lamp to reach higher pick ups and dodge enemies.',
      'PICKUPS: Voli can collect 4 different pick ups: Dog treat (300 points), golden dog treat(1000 points), bone (extra life, 5 max), and jetpack(invincibility and super speed)',
      'ENEMIES: Game introduces Voli the dogs worst adversaries: Cyclists, Cars, Cats and UFO:s.',
      'THE KING OF CATS: Final boss of the game appears after scoring 20 000 or more points. Beating the boss awards 5000 points',
      'ENDLESS MODE: The endless mode begins after the boss is beaten, difficulty increases as the score goes up.',
      'CHEATS: In case you want to test the boss or jetpack without the need to actually play the game, add "?skiptoboss" or "?jetpack" to the end of your url bar and press enter.'
    ];
    this.slide = 0;
    this.add.text(75,10, 'VOLI - GUIDE')
    this.manualtext = this.add.text(20,30,'',{fontSize:'12px', wordWrap:{width:200, useAdvancedWrap:true}});
    this.add.text(30,150, '(Press space to continue)',{fontSize:'12px'})
  }
  
  update() {
    if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.slide++;
      if (this.slide > 6) {
        this.scene.stop('manual-scene');
        this.scene.run('mainmenu-scene');
      }
    }
    this.manualtext.setText(this.slides.at(this.slide));
  }

}