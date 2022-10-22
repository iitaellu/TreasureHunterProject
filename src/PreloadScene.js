import Phaser, { Scene } from "phaser";

class PreloadScene extends Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.audio("backGround", "audios/background_long.mp3");
  }

  create() {
    let soundSample = this.sound.add("backGround");
    soundSample.play();

    var text = this.add.text(400, 150, "Treasure hunter", {
      fontSize: "64px",
      fill: "#fff"
    });
    text.setOrigin(0.5);

    var introtext = this.add.text(
      400,
      200,
      "Collect all stars to reveal secret and dodge enemys",
      {
        fontSize: "25px",
        fill: "#fff"
      }
    );
    introtext.setOrigin(0.5);

    var starttext = this.add.text(400, 250, "*click to start*", {
      fontSize: "20px",
      fill: "#fff"
    });
    starttext.setOrigin(0.5);
    this.input.on("pointerdown", () => this.scene.start("game"));
  }
}

export default PreloadScene;
