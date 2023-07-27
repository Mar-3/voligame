import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import HighScoreScene from './scenes/HighScoreScene.js';


const gameOptions = {
  playerGravity: 500,
  playerSpeed: 200
}



const config = {
  type: Phaser.AUTO,
  backgroundColor: 0x1c103b,
  scale: {
    mode:Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 250,
    height:170
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y:0
      }
    }
  },
  scene: [MainMenuScene ,GameScene, GameOverScene, HighScoreScene]
};

export default new Phaser.Game(config);

