import Phaser from "phaser";
import GameScene from "./GameScene";
import PreloadScene from "./PreloadScene";
import GameSceneTwo from "./GameSceneTwo";
import GameSceneFinal from "./GameSceneFinal";
import Win from "./Win";

const config = {
  type: Phaser.AUTO,

  scale: {
    mode: Phaser.DOM.FIT,
    autoCenter: Phaser.DOM.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [PreloadScene, GameScene, GameSceneTwo, GameSceneFinal, Win]
};

export { config };
