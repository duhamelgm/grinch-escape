let trineoImage;
let fondo;
let treeImage;
let starImage;

let player;
let treesProps;
let starsProps;
let gameInfo;
let iniciarJuego = false;
let gameOver = false;
let pickUpSound;
let music;

document.getElementById("back-button").addEventListener("click", () => {
  stopMusic();
  iniciarJuego = false;
  restartGame();
  document.getElementById("game-over").classList.remove("active");
  hideGuiElement(document.querySelector(".p5Canvas"));
  showGuiElement(document.querySelector("#start-image"));
  showGuiElement(document.querySelector("#main-menu"));
  hideGuiElement(document.querySelector("#game-menu"));
});
document.getElementById("start-button").addEventListener("click", () => {
  loop();
  document.getElementById("game-over").classList.remove("active");
  iniciarJuego = true;
});
document.getElementById("restart-button").addEventListener("click", () => {
  stopMusic();
  document.getElementById("game-over").classList.remove("active");
  restartGame();
  loop();
});

function preload() {
  trineoImage = loadImage("./assets/trineo.png");
  treeImage = loadImage("./assets/arbol.png");
  starImage = loadImage("./assets/estrella.png");
  pickUpSound = loadSound("./assets/pickup.mp3");
  music = loadSound("./assets/music.mp3");
}

function setup() {
  const canvas = createCanvas(500, 700);
  canvas.parent("game-container");
  gameInfo = new GameInfo();
  treesProps = new ListOfProps(Tree, treeImage, 184, 232, 3);
  starsProps = new ListOfProps(Star, starImage, 77, 91, 3);
  player = new Player(trineoImage, width / 2, height - 100, 179, 320, 3);
}

function draw() {
  if (iniciarJuego) {
    playMusic();
    gameInfo.score = Math.floor(gameInfo.distance) + 20 * Math.floor(gameInfo.stars);

    showGuiElement(document.querySelector(".p5Canvas"));
    hideGuiElement(document.querySelector("#start-image"));
    hideGuiElement(document.querySelector("#main-menu"));
    showGuiElement(document.querySelector("#game-menu"));

    background("#fff");
    drawPlayer();
    let hitbox = player.getHitbox();

    if (hitbox.bottom < 0) {
      gameOver = true;
    }
    if (hitbox.top > height) {
      gameOver = true;
    }

    drawBackground(hitbox);
    drawProps(hitbox);
    updateGui();

    gameInfo.distance += gameInfo.difficult[gameInfo.currentDifficult].backgroundSpeed / 2;
    if (gameInfo.distance > 100) {
      gameInfo.currentDifficult = 1;
    }
    if (gameInfo.distance > 200) {
      gameInfo.currentDifficult = 2;
    }
    if (gameInfo.distance > 400) {
      gameInfo.currentDifficult = 3;
    }
  } else {
    hideGuiElement(document.querySelector(".p5Canvas"));
    showGuiElement(document.querySelector("#start-image"));
    showGuiElement(document.querySelector("#main-menu"));
    hideGuiElement(document.querySelector("#game-menu"));
  }

  if (gameOver) {
    stopMusic();
    showGameOverScreen();
    noLoop();
  }
}

const stopMusic = () => {
  music.stop();
};

const playMusic = () => {
  if (music.isPlaying()) {
    return;
  } else {
    music.loop();
    music.setVolume(0.3);
  }
};

const showGameOverScreen = () => {
  document.getElementById("game-over").classList.add("active");
  document.getElementById("score-game").innerHTML = gameInfo.score;
};

const restartGame = () => {
  treesProps.deleteAll();
  starsProps.deleteAll();
  player.restartPosition();
  gameInfo = new GameInfo();
  gameOver = false;
};

const updateGui = () => {
  document.getElementById("distance").innerHTML = Math.floor(gameInfo.distance);
  document.getElementById("stars").innerHTML = Math.floor(gameInfo.stars);
  document.getElementById("score").innerHTML = gameInfo.score;
};

const drawPlayer = () => {
  player.move();
  player.draw();
};

const drawProps = hitbox => {
  let treeNearSpawn = treesProps.checkSpawned();
  let starNearSpawn = starsProps.checkSpawned();

  if (
    treesProps.canDrawProps(
      gameInfo.difficult[gameInfo.currentDifficult].treeSpawnRate,
      starNearSpawn
    )
  ) {
    treesProps.addOne(gameInfo.difficult[gameInfo.currentDifficult].assetSpeed);
  }

  if (
    starsProps.canDrawProps(
      gameInfo.difficult[gameInfo.currentDifficult].starSpawnRate,
      treeNearSpawn
    )
  ) {
    starsProps.addOne(gameInfo.difficult[gameInfo.currentDifficult].assetSpeed);
  }

  treesProps.drawAll();
  starsProps.drawAll();

  let treeTouched = treesProps.checkHitboxes(hitbox);
  let starTouched = starsProps.checkHitboxes(hitbox);

  if (starTouched !== -1) {
    pickUpSound.play();
    starsProps.props.splice(starTouched, 1);
    gameInfo.stars++;
  }
  if (treeTouched !== -1) {
    gameOver = true;
  }
};

let inc = 0.01;
let start = 0;
let mov = 0;
const drawBackground = hitbox => {
  let xoff = start;
  beginShape();
  fill(216, 235, 243);
  vertex(0, height);
  for (let y = height; y >= 0; y--) {
    stroke(255);

    let x = 20 + (noise(xoff) * 100) / 2;
    vertex(x, y);
    if (hitbox.left < x && y > hitbox.top && y < hitbox.bottom) {
      gameOver = true;
    }
    xoff += inc;
  }
  vertex(0, 0);
  endShape();

  beginShape();
  vertex(width, height);
  for (let y = height; y >= 0; y--) {
    stroke(255);

    let x = width - 20 - (noise(xoff) * 100) / 2;
    vertex(x, y);

    if (hitbox.right > x && y > hitbox.top && y < hitbox.bottom) {
      gameOver = true;
    }
    xoff += inc;
  }
  vertex(width, 0);
  endShape();

  start += gameInfo.difficult[gameInfo.currentDifficult].backgroundSpeed;
};

const hideGuiElement = element => {
  element.classList.remove("active");
  element.classList.add("deactive");
};

const showGuiElement = element => {
  element.classList.remove("deactive");
  element.classList.add("active");
};
