import Phaser from "phaser";
import { Scene } from "phaser";
import { config } from "./config";

var player;
var platforms;
var stars;
var cursors;
var score;
var lives;
var scoreText;
var livesText;
var GameoverText;
var GameoverTextRed;
var GameoverTextinfo;
var redstars;
var enemys;
var enemysleft;
var door;
let gameOverSound;
let damageSound;
let collectSound;
let doorFoundSound;
let jumpSound;
let openSound;

var pixelWidth = 2;

//from https://phaser.io/examples/v3/view/textures/generate-more-textures
var redstar = [
  ".....843.....",
  "....84443....",
  "....84443....",
  "...8444443...",
  "4444444444444",
  "8444444444443",
  ".84444444443.",
  "..844444443..",
  "..844444443..",
  ".84444444443.",
  ".84443.74443.",
  ".843.....7443."
];
var rocketright = [
  "334.............",
  "3333............",
  "333332222222D...",
  ".FF22222222EED..",
  ".F222222222FEED.",
  ".2222222222FFEED",
  "4443322222222222",
  "44433FFFFFFFFFFF",
  ".111FFFFFFFFFFF.",
  ".11FFFFFFFFFFF..",
  ".1FFFFFFFFFF1...",
  "3333............",
  "333............."
];

var rocketleft = [
  ".............433",
  "............3333",
  "...D222222233333",
  "..DEE22222222FF.",
  ".DEEF222222222F.",
  "DEFF22222222222.",
  "2222222222233444",
  "FFFFFFFFFFF33444",
  ".FFFFFFFFFFF111.",
  "..FFFFFFFFFFF11.",
  "...1FFFFFFFFFF1.",
  "............3333",
  ".............333"
];

var doorpx = [
  "...6565656...",
  "..656565656..",
  ".65656665656.",
  "6566565656656",
  "6566565656656",
  "6786566656656",
  "6775665665656",
  "6565656565656",
  "6565656565656",
  "6565656565656",
  "6565656565656"
];

class GameScene extends Scene {
  constructor() {
    super("game");
    score = 0;
    lives = 3;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("MovingGround", "assets/platformMoving.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.textures.generate("redstar", {
      data: redstar,
      pixelWidth: pixelWidth
    });
    this.textures.generate("rocket", {
      data: rocketright,
      pixelWidth: pixelWidth
    });
    this.textures.generate("rocketleft", {
      data: rocketleft,
      pixelWidth: pixelWidth
    });
    this.textures.generate("door", {
      data: doorpx,
      pixelWidth: 6
    });

    this.load.audio("loose", "audios/loose.mp3");
    this.load.audio("damage", "audios/die.mp3");
    this.load.audio("collect", "audios/collect_star.mp3");
    this.load.audio("doorFound", "audios/door_appear.mp3");
    this.load.audio("jump", "audios/jump.mp3");
    this.load.audio("open", "audios/open.mp3");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.sounds();
    this.createDoor();
    this.createPlatforms();
    this.creatPlayer();
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
    openSound = this.sound.add("open");
  }

  createDoor() {
    door = this.physics.add.image(200, 202, "door");
    door.setImmovable(true);
    door.body.allowGravity = false;
    door.visible = false;
  }

  createPlatforms() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(700, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
  }

  creatPlayer() {
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
  }

  createEnemys() {
    enemys = this.physics.add.image(400, 340, "rocket");
    enemys.setImmovable(true);
    enemys.body.allowGravity = false;
    enemys.setVelocityX(50);
    this.physics.add.overlap(player, enemys, this.gotDamage, null, this);

    enemysleft = this.physics.add.image(600, 150, "rocketleft");
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
    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    redstars = this.physics.add.group({
      key: "redstar",
      repeat: 2,
      setXY: { x: 130, y: 0, stepX: 250 }
    });
    this.physics.add.collider(redstars, platforms);
    this.physics.add.overlap(player, redstars, this.collectRedStar, null, this);
  }

  scoreInfo() {
    var levelText = this.add.text(16, 16, "Level: 1", {
      fontSize: "32px",
      fill: "#000"
    });
    scoreText = this.add.text(16, 45, "Score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    livesText = this.add.text(16, 73, "Lives: 3", {
      fontSize: "32px",
      fill: "#000"
    });
  }

  gameOverTexts() {
    GameoverTextRed = this.add.text(400, 300, "Game Over!", {
      fontSize: "64px",
      fill: "	#FF0000"
    });
    GameoverTextRed.setOrigin(0.5);
    GameoverTextRed.visible = false;

    GameoverText = this.add.text(399, 299, "Game Over!", {
      fontSize: "64px",
      fill: "#000"
    });
    GameoverText.setOrigin(0.5);
    GameoverText.visible = false;

    GameoverTextinfo = this.add.text(400, 350, "Click to start again", {
      fontSize: "20px",
      fill: "#000"
    });
    GameoverTextinfo.setOrigin(0.5);
    GameoverTextinfo.visible = false;
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    score += 5;
    collectSound.play();
    if (score >= 50) {
      doorFoundSound.play();
      door.visible = true;
      this.physics.add.overlap(player, door, this.nextLevel, null, this);
    }
    scoreText.setText("Score: " + score);
  }

  collectRedStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    collectSound.play();
    if (score >= 50) {
      doorFoundSound.play();
      door.visible = true;
      this.physics.add.overlap(player, door, this.nextLevel, null, this);
    }
    scoreText.setText("Score: " + score);
  }

  nextLevel() {
    openSound.play();
    this.scene.start("gameTwo");
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
      //this.input.on("pointerdown", () => this.scene.start("preload"));
    }
    if (lives > 0) {
      player.x = 100;
      player.y = 450;
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
  }
}

export default GameScene;
