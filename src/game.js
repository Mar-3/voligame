import GameScene from './scenes/GameScene.js';


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
  scene: [GameScene]
};

export default new Phaser.Game(config);

