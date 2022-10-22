import Phaser from "phaser";
import { Scene } from "phaser";
import { config } from "./config";

var player;
var platforms;
var stars;
var bomb;
var bombs;
var cursors;
var score = 0;
var lives = 3;
var scoreText;
var livesText;
var GameoverText;
var GameoverTextRed;
var redstars;
var enemys;
var enemysleft;
var movablePlatform;
var GameoverTextinfo;
var isClicking = false;
var treasure;
let gameOverSound;
let damageSound;
let collectSound;
let doorFoundSound;
let jumpSound;
let winSound;

var treasurepx = [
  "...5555555...",
  "..566656665..",
  ".56665666665.",
  "5666566666665",
  "5555555555555",
  "5686566666665",
  "5676566666665",
  "5666566666665",
  "5666566666665",
  "5555555555555"
];

class GameSceneFinal extends Scene {
  constructor() {
    super("gameFinal");
    score = 0;
    lives = 3;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("MovableGround", "assets/platformMovable.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });

    this.textures.generate("treasure", {
      data: treasurepx,
      pixelWidth: 6
    });

    this.load.audio("winGame", "audios/win.mp3");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.sounds();
    this.createTreasure();
    this.createPlatforms();
    this.createPlayer();
    this.createBombs();
    this.createEnemys();
    this.createStars();
    this.scoreInfo();
    this.gameOverTexts();
  }

  sounds() {
    gameOverSound = this.sound.add("loose");
    damageSound = this.sound.add("damage");
    collectSound = this.sound.add("collect");
    doorFoundSound = this.sound.add("doorFound");
    jumpSound = this.sound.add("jump");
    winSound = this.sound.add("winGame");
  }

  createTreasure() {
    treasure = this.physics.add.image(700, 537, "treasure").setOrigin(0, 1);
    treasure.setImmovable(true);
    treasure.body.allowGravity = false;
    treasure.visible = false;
  }

  createPlatforms() {
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(900, 170, "ground");
    platforms.create(900, 450, "ground");
    platforms.create(-50, 120, "ground");

    var text = this.add.text(400, 250, "Click background to move", {
      fontSize: "20px",
      fill: "#fff"
    });

    text.setOrigin(0.5);
    movablePlatform = this.physics.add.image(300, 300, "MovableGround");
    movablePlatform.body.allowGravity = false;
    movablePlatform.setImmovable(true);
  }

  createPlayer() {
    player = this.physics.add.sprite(100, 450, "dude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movablePlatform);
  }

  createBombs() {
    bombs = this.physics.add.group();
    bomb = bombs.create(500, 30, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    this.physics.add.collider(bomb, movablePlatform);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    bomb = bombs.create(300, 100, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, movablePlatform);

    this.physics.add.collider(player, bombs, this.gotDamage, null, this);
  }

  createEnemys() {
    enemys = this.physics.add.image(700, 250, "rocket");
    enemys.setImmovable(true);
    enemys.body.allowGravity = false;
    enemys.setVelocityX(50);
    this.physics.add.overlap(player, enemys, this.gotDamage, null, this);

    enemysleft = this.physics.add.image(600, 400, "rocketleft");
    enemysleft.setImmovable(true);
    enemysleft.body.allowGravity = false;
    enemysleft.setVelocityX(50);
    this.physics.add.overlap(player, enemysleft, this.gotDamage, null, this);
  }

  createStars() {
    stars = this.physics.add.group({
      key: "star",
      repeat: 6,
      setXY: { x: 45, y: 20, stepX: 120 }
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, movablePlatform);
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    redstars = this.physics.add.group({
      key: "redstar",
      repeat: 2,
      setXY: { x: 130, y: 180, stepX: 250 }
    });
    this.physics.add.collider(redstars, platforms);
    this.physics.add.collider(redstars, movablePlatform);
    this.physics.add.overlap(player, redstars, this.collectRedStar, null, this);
  }

  scoreInfo() {
    scoreText = this.add.text(16, 46, "Score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    livesText = this.add.text(16, 75, "Lives: 3", {
      fontSize: "32px",
      fill: "#000"
    });
    var levelText = this.add.text(16, 16, "level: 3", {
      fontSize: "32px",
      fill: "#000"
    });
  }

  gameOverTexts() {
    GameoverTextRed = this.add.text(299, 300, "Game Over!", {
      fontSize: "64px",
      fill: "	#FF0000"
    });
    GameoverTextRed.setOrigin(0.2);
    GameoverTextRed.visible = false;

    GameoverText = this.add.text(300, 299, "Game Over!", {
      fontSize: "64px",
      fill: "#000"
    });
    GameoverText.setOrigin(0.2);
    GameoverText.visible = false;

    GameoverTextinfo = this.add.text(400, 350, "Click to start again", {
      fontSize: "20px",
      fill: "#000"
    });
    GameoverTextinfo.setOrigin(0.5);
    GameoverTextinfo.visible = false;
  }

  gotDamage(player) {
    lives -= 1;
    livesText.setText("Lives: " + lives);
    damageSound.play();
    //player.events.onOutOfBounds.add(resecharacter,this);

    if (lives === 0) {
      this.physics.pause();
      player.setTint(0xff0000);
      gameOverSound.play();
      GameoverText.visible = true;
      GameoverTextRed.visible = true;
      GameoverTextinfo.visible = true;
      this.newGame();
    }
    if (lives > 0) {
      player.x = 100;
      player.y = 450;
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    score += 5;
    collectSound.play();
    scoreText.setText("Score: " + score);
    if (score === 65) {
      treasure.visible = true;
      doorFoundSound.play();
      this.physics.add.overlap(player, treasure, this.won, null, this);
    }
  }

  collectRedStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    collectSound.play();
    scoreText.setText("Score: " + score);
    if (score === 65) {
      doorFoundSound.play();
      treasure.visible = true;
      this.physics.add.overlap(player, treasure, this.won, null, this);
    }
  }
  won() {
    winSound.play();
    this.scene.start("win");
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

  update() {
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      jumpSound.play();
      player.setVelocityY(-330);
    }

    if (enemys.x >= 750) {
      enemys.body.velocity.x = -70;
    } else if (enemys.x <= 20) {
      enemys.body.velocity.x = 256;
    }

    if (enemysleft.x >= 750) {
      enemysleft.setVelocityX(50);
      enemysleft.body.velocity.x = -256;
    } else if (enemysleft.x <= 20) {
      enemysleft.setVelocityX(70);
    }

    if (!this.input.activePointer.isDown && isClicking === true) {
      movablePlatform.setData("positionX", this.input.activePointer.position.x);
      isClicking = false;
    } else if (this.input.activePointer.isDown && isClicking === false) {
      isClicking = true;
    }

    if (
      Math.abs(movablePlatform.x - movablePlatform.getData("positionX")) <= 10
    ) {
      movablePlatform.x = movablePlatform.getData("positionX");
    } else if (
      movablePlatform.x < movablePlatform.getData("positionX") &&
      movablePlatform.x < 550
    ) {
      movablePlatform.x += 2;
    } else if (
      movablePlatform.y > movablePlatform.getData("positionX") &&
      movablePlatform.x > 250
    ) {
      movablePlatform.x -= 2;
    }
  }
}

export default GameSceneFinal;
