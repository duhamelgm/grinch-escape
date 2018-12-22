class GameInfo {
  constructor() {
    this.distance = 0;
    this.stars = 0;
    this.score = 0;
    this.currentDifficult = 0;
    this.difficult = [
      {
        treeSpawnRate: 0.05,
        starSpawnRate: 0.1,
        assetSpeed: 8,
        backgroundSpeed: 0.1
      },
      {
        treeSpawnRate: 0.1,
        starSpawnRate: 0.05,
        assetSpeed: 10,
        backgroundSpeed: 0.15
      },
      {
        treeSpawnRate: 0.2,
        starSpawnRate: 0.05,
        assetSpeed: 12,
        backgroundSpeed: 0.2
      },
      {
        treeSpawnRate: 0.4,
        starSpawnRate: 0.05,
        assetSpeed: 15,
        backgroundSpeed: 0.3
      }
    ];
  }
}

class Player {
  constructor(image, xi, yi, imageWidth, imageHeight, imageFactor) {
    this.image = image;
    this.xi = xi;
    this.yi = yi;
    this.x = xi;
    this.y = yi;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.imageFactor = imageFactor;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }

    if (keyIsDown(UP_ARROW)) {
      this.y -= 5;
    }

    if (keyIsDown(DOWN_ARROW)) {
      this.y += 5;
    }
  }

  restartPosition() {
    this.x = this.xi;
    this.y = this.yi;
  }

  draw() {
    image(
      this.image,
      this.x,
      this.y,
      this.imageWidth / this.imageFactor,
      this.imageHeight / this.imageFactor
    );
  }

  getHitbox() {
    return {
      top: this.y + 25,
      bottom: this.y + this.imageHeight / this.imageFactor - 25,
      left: this.x + 20,
      right: this.x + this.imageWidth / this.imageFactor - 20
    };
  }
}

class ListOfProps {
  constructor(typeOfProp, propImage, imageWidth, imageHeight, imageScale) {
    this.props = [];
    this.typeOfProp = typeOfProp;
    this.propImage = propImage;
    this.spawnMarginError = 0;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.imageScale = imageScale;
  }

  addOne(speed) {
    let prop = this.typeOfProp;
    this.props.push(
      new prop(
        Math.random(),
        this.propImage,
        this.imageWidth,
        this.imageHeight,
        this.imageScale,
        speed
      )
    );
  }

  drawAll() {
    for (let i = 0; i < this.props.length; i++) {
      let p = this.props[i];
      p.move();
      p.draw();
      if (p.end()) {
        this.props.splice(i, 1);
      }
    }
  }

  deleteAll() {
    this.props = [];
  }

  checkHitboxes(hitbox) {
    for (let i = 0; i < this.props.length; i++) {
      let p = this.props[i];
      let propHitbox = p.getHitbox();

      if (
        (hitbox.bottom >= propHitbox.top && hitbox.bottom <= propHitbox.bottom) ||
        (hitbox.top <= propHitbox.bottom && hitbox.top > propHitbox.top)
      ) {
        if (hitbox.left <= propHitbox.right && hitbox.left >= propHitbox.left) {
          return i;
        }
        if (hitbox.right >= propHitbox.left && hitbox.right <= propHitbox.right) {
          return i;
        }
      }
    }
    return -1;
  }

  canDrawProps(chanceOfSpawn, nearSpawn) {
    if (Math.random() < chanceOfSpawn && this.spawnMarginError === 0 && !nearSpawn) {
      this.spawnMarginError++;
      return true;
    } else {
      if (this.spawnMarginError !== 0) {
        this.spawnMarginError++;
        if (this.spawnMarginError > 20) {
          this.spawnMarginError = 0;
        }
      }

      return false;
    }
  }

  checkSpawned() {
    if (this.spawnMarginError === 0) {
      return false;
    } else {
      return true;
    }
  }
}

class RandomProp {
  constructor(rand, image, imageWidth, imageHeight, factor, speed) {
    this.y = -100;
    this.x = map(rand, 0, 1, 50, 400);
    this.image = image;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.factor = factor;
    this.speed = speed;
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    this.prop = image(
      this.image,
      this.x,
      this.y,
      this.imageWidth / this.factor,
      this.imageHeight / this.factor
    );
  }

  getHitbox() {
    return {
      top: this.y,
      bottom: this.y + this.imageHeight / this.factor,
      left: this.x,
      right: this.x + this.imageWidth / this.factor
    };
  }

  end() {
    if (this.y > height) {
      return true;
    }
  }
}

class Tree extends RandomProp {
  constructor(rand, tree, imageWidth, imageHeight, factor, speed) {
    super(rand, tree, imageWidth, imageHeight, factor, speed);
  }
}

class Star extends RandomProp {
  constructor(rand, star, imageWidth, imageHeight, factor, speed) {
    super(rand, star, imageWidth, imageHeight, factor, speed);
  }

  getHitbox() {
    return {
      top: this.y - 15,
      bottom: this.y + this.imageHeight / this.factor + 15,
      left: this.x - 15,
      right: this.x + this.imageWidth / this.factor + 15
    };
  }
}
