export default class HighScoreScene extends Phaser.Scene {
  
  inputTextStyle = {
    fontFamily:'nes-arcade',
    fontSize: '12px'
  }
  hiscores;
  newHighScore = 0;
  newName = [];

  selector;
  selectorX = 0;
  selectorY = 0;
  selectorAlphabet = []

  cursors;

  visibleText = [];
  constructor() {
    super("highscore-scene");
  }

  init(data) {
    this.hiscores = JSON.parse(localStorage.getItem('hiscores'));
    let newScore = data.score;
    if (newScore > this.hiscores.at(-1).score) {
      this.newHighScore = newScore;
    }
  }
 
  
  preload() {
    this.cursors = this.input.keyboard;
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Create the list for all possible inputs 
    const alphsString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.-←⏎";
    for (let i = 0; i < alphsString.length; i++) {
      this.selectorAlphabet.push(alphsString.at(i))
    };
    
    this.input.keyboard.on('keydown', () => {
      if (this.newHighScore == 0) {
        this.scene.stop('highscore-scene');
        this.scene.run('mainmenu-scene');
      }
    });

    // Create selector rectangle
    this.selector = this.add.graphics();
    this.selector.lineStyle(1, 0xfc0000, 0.4);
      this.selector.strokeRect(48,52,18, 18);
  }

  update() {
    console.log(this.newHighScore);
    if (this.newHighScore > 0) {
      this.selector.visible = true;
      this.inputName();
      if(Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.selectorY < 4) {
        this.selectorY ++;
      };
      if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.selectorY > 0) {
        this.selectorY --;
      };
      if(Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.selectorX > 0) {
        this.selectorX --;
      };
      if(Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.selectorX < 5) {
      this.selectorX ++;
      };
      if(Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        let newInput = this.selectorAlphabet.at(this.selectorX + this.selectorY * 6);
        if (newInput == '←') {
          this.newName.pop();
        } else if (newInput == '⏎') {
          this.submitScore();
        } else {
          if (this.newName.length > 2) {
            this.newName.pop();
          }
          this.newName.push(newInput);
        }
        console.log(this.newName);
      };
      this.updateCursorLocation();
    } else {
      this.printHiscores();
      this.selector.visible = false;
  }
  }

  // Show the new high score name input field
  inputName() {

    let nameInput = '';
    this.newName.every(char =>
        nameInput = nameInput.concat(char)
      )

    
    this.visibleText.forEach(text => text.destroy());
    this.visibleText.push(
      this.add.text(50,10, 'NEW SCORE: ' + this.newHighScore)
    );
    this.visibleText.push(
      this.add.text(50, 30, 'NAME: ' + nameInput)
    )
    this.visibleText.push(
      this.add.text(50,50, 'A B C D E F',this.inputTextStyle)
    )
    this.visibleText.push(
      this.add.text(50,70, 'G H I J K L',this.inputTextStyle)
    )
    this.visibleText.push(
      this.add.text(50,90, 'M N O P Q R',this.inputTextStyle)
    )
    this.visibleText.push(
      this.add.text(50,110, 'S T U V W X',this.inputTextStyle)
    )
    this.visibleText.push(
      this.add.text(50,130, 'Y Z . - ← ⏎', this.inputTextStyle)
    )
  }

  // print hiscores to screen 
  printHiscores() {
    let n = 0;
    this.visibleText.forEach(text => text.destroy());
    this.visibleText.push(this.add.text(50,10, 'HIGH SCORES:'));
    this.hiscores.forEach(score => {
      this.visibleText.push(this.add.text(50,30+n*20, score.name));
      this.visibleText.push(this.add.text(100,30+n*20, score.score));
      n++;
    });
  }

  submitScore() {
    console.log('submit')
    let nameInput = '';
    this.newName.every(char =>
        nameInput = nameInput.concat(char)
      )
    let newScore = this.newHighScore;

    let index = this.hiscores.findIndex((score) => score.score < newScore);
    console.log(index, newScore);
    this.hiscores[index] = {name:nameInput, score:newScore};
    console.log(this.hiscores)
    this.updateHiscoresStorage();
    this.newHighScore = 0;
  }

  updateHiscoresStorage() {
    localStorage.setItem('hiscores', JSON.stringify(this.hiscores));
  }

  // Move the name input cursor to new position
  updateCursorLocation() {
    this.selector.setPosition(this.selectorX*27.25, this.selectorY*20);
  }
}