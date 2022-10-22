import Phaser from "phaser";
import { Scene } from "phaser";
import { config } from "./config";

var player;
var platforms;
var movingPlatform;
var hideingPlatform;
var stars;
var redstars;
var bomb;
var bombTwo;
var bombs;
var cursors;
var score;
var lives;
var scoreText;
var livesText;
var GameoverText;
var GameoverTextRed;
var GameoverTextinfo;
var door;
let gameOverSound;
let damageSound;
let collectSound;
let doorFoundSound;
let jumpSound;
let openSound;

class GameSceneTwo extends Scene {
  constructor() {
    super("gameTwo");
    score = 0;
    lives = 3;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("MovingGround", "assets/platformMoving.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.add.image(400, 300, "sky");
    this.sounds();
    this.createDoor();
    this.createPlatforms();
    this.createPlayer();
    this.createBombs();
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
    openSound = this.sound.add("open");
  }

  createDoor() {
    door = this.physics.add.image(30, 210, "door").setOrigin(0, 1);
    door.setImmovable(true);
    door.body.allowGravity = false;
    door.visible = false;
  }

  createPlatforms() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(700, 170, "ground");
    platforms.create(800, 400, "ground");

    hideingPlatform = this.physics.add.image(-50, 220, "ground");
    hideingPlatform.setImmovable(true);
    hideingPlatform.body.allowGravity = false;
    hideingPlatform.visible = false;

    movingPlatform = this.physics.add.image(199, 400, "MovingGround");
    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityY(30);
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
    this.physics.add.collider(player, movingPlatform);
  }

  createBombs() {
    bombs = this.physics.add.group();

    bomb = bombs.create(400, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    bombTwo = bombs.create(1, 16, "bomb");
    bombTwo.setBounce(1);
    bombTwo.setCollideWorldBounds(true);
    bombTwo.setVelocity(Phaser.Math.Between(-200, 200), 20);

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, movingPlatform);

    this.physics.add.collider(player, bombs, this.gotDamage, null, this);
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
    this.physics.add.collider(stars, movingPlatform);
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    redstars = this.physics.add.group({
      key: "redstar",
      repeat: 2,
      setXY: { x: 130, y: 180, stepX: 250 }
    });
    this.physics.add.collider(redstars, platforms);
    this.physics.add.collider(redstars, movingPlatform);
    this.physics.add.overlap(player, redstars, this.collectRedStar, null, this);
  }

  scoreInfo() {
    scoreText = this.add.text(16, 46, "Score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    var levelText = this.add.text(16, 16, "level: 2", {
      fontSize: "32px",
      fill: "#000"
    });
    livesText = this.add.text(16, 75, "Lives: 3", {
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
    if (score >= 55) {
      hideingPlatform.visible = true;
      doorFoundSound.play();
      door.visible = true;
      this.physics.add.collider(player, hideingPlatform);
      this.physics.add.collider(bombs, hideingPlatform);
      this.physics.add.overlap(player, door, this.nextLevel, null, this);
    }
  }

  collectRedStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    collectSound.play();
    scoreText.setText("Score: " + score);
    if (score >= 55) {
      door.visible = true;
      hideingPlatform.visible = true;
      doorFoundSound.play();
      this.physics.add.collider(player, hideingPlatform);
      this.physics.add.collider(bombs, hideingPlatform);
      this.physics.add.overlap(player, door, this.nextLevel, null, this);
    }
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

  nextLevel() {
    openSound.play();
    this.scene.start("gameFinal");
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
    if (movingPlatform.y >= 450) {
      movingPlatform.setVelocityY(-30);
    } else if (movingPlatform.y <= 250) {
      movingPlatform.setVelocityY(30);
    }
  }
}

export default GameSceneTwo;
