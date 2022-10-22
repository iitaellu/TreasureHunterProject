import Phaser, { Scene } from "phaser";
import { config } from "./config";

class Win extends Scene {
  constructor() {
    super("win");
  }
  preload() {}

  create() {
    var text = this.add.text(400, 150, "Congratulions!", {
      fontSize: "64px",
      fill: "#fff"
    });
    text.setOrigin(0.5);

    var introtext = this.add.text(400, 200, "You have passed the game", {
      fontSize: "25px",
      fill: "#fff"
    });
    introtext.setOrigin(0.5);

    var starttext = this.add.text(400, 250, "*Click to return start*", {
      fontSize: "20px",
      fill: "#fff"
    });
    starttext.setOrigin(0.5);
    this.newGame();
  }

  newGame() {
    this.input.on(
      "pointerdown",
      function () {
        this.sys.game.destroy(true);
        document.addEventListener("mousedown", function newGame() {
          var game = new Phaser.Game(config);
          document.removeEventListener("mousedown", newGame);
        });
      },
      this
    );
  }
}
export default Win;
