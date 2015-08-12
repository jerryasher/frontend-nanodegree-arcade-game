// Enemies our player must avoid

var blockBlankHeight = 50,
    blockHorizOff = 0,
    blockHeight = 84,
    blockWidth = 101,

    gridMinLane = 0,
    gridMaxLane = 5,
    gridMinColumn = 0,
    gridMaxColumn = 4,

    enemyWidth = 100,
    enemyCenter = enemyWidth / 2,
    enemyOffset = enemyCenter + ((blockWidth - enemyWidth) / 2),
    // speed is pixels per second
    // grid width is 500 pixels
    enemyMinSpeed = 25,
    enemyMaxSpeed = 250,
    enemyMinLane = 1,
    enemyMaxLane = 3,

    playerWidth = 70,
    playerCenter = playerWidth / 2,
    playerOffset = playerCenter + ((blockWidth - playerWidth) / 2),
    playerStartLane = 5,
    playerStartColumn = 2;

var randomRange = function(min, max) {
  var width = max - min;
  return (Math.random()*width) + min;
};

var randomRangeInt = function(min, max) {
  var width = max - min;
  return Math.floor((Math.random()*width)) + Math.floor(min);
};

var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.reset();
};

var enemyLane = enemyMinLane;
Enemy.prototype.reset = function() {
  // this.lane = randomRangeInt(enemyMinLane, enemyMaxLane);
  this.lane = enemyLane++;
  if (enemyLane > enemyMaxLane) {
  enemyLane = enemyMinLane;
  }
  // seeming delay entry by allowing for extra long start off the grid
  this.x = randomRangeInt(-5, 1) * blockWidth;
  // this.x = 0;
  this.y = (this.lane * blockHeight);
  this.speed = randomRange(enemyMinSpeed, enemyMaxSpeed);
  // this.speed = 25;

  // console.log("enemy.Reset");
  // console.log(this);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (!pause) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
    if (this.x > 505) {
      this.reset(this);
    } else if (player && player.collisionDetect(this.lane, this.x)) {
      player.die();
    } else {
      // this.y = blockBlankHeight + (Math.floor(Math.random()*3) * blockHeight);
      // this.y =  blockBlankHeight + (this.lane * blockHeight);
      this.y = (this.lane * blockHeight);
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  // console.log("Enemy: render");
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  // console.log("Player: constructor");
  this.sprite = 'images/char-boy.png';
  this.reset();
  // console.log(this);
};

Player.prototype.reset = function(){
  this.column = playerStartColumn;
  this.x = blockHorizOff + (this.column * blockWidth);
  this.lane = playerStartLane;
  this.y = this.lane * blockHeight;
};

Player.prototype.collisionDetect = function(lane, x) {
  var noseX = x + enemyWidth;
  if (lane == this.lane) {
    var enemyNoseColumn = Math.floor(noseX / blockWidth);
    var enemyNoseEntry = ((noseX % blockWidth) / blockWidth) * 100;
    // console.log("MyColumn: " + this.column + 
    //             " NoseX: " + noseX + 
    //             " NoseColumn: " + enemyNoseColumn + 
    //             " NoseEntry " + enemyNoseEntry);
    if ((enemyNoseColumn == this.column) && (enemyNoseEntry > 25)) {
      // console.log("killed by bug running into player");
      return true;
    } else if ((enemyNoseColumn == (this.column + 1)) && (enemyNoseEntry < 75)) {
      // console.log("killed by player running into bug");
      return true;
    } else {
      return false;
    }
  }
  return false;
};

Player.prototype.die = function() {
  console.log("die!");
  this.reset();
};

Player.prototype.update = function(){
  // console.log("Player: update");
  this.x = this.column *  blockWidth;
  this.y = this.lane *  blockHeight;
};

Player.prototype.render = function(){
  // console.log("Player: render");
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.win = function() {
  console.log("win!");
  return true;
};

var pause = false;
Player.prototype.handleInput = function(keyCode){
  // console.log("Player key input: " + keyCode);
  switch (keyCode) {
  case 'space':
    pause = ! pause;
    break;
  case 'left':
    this.column--;
    break;
  case 'up':
    this.lane--;
    break;
  case 'right':
    this.column++;
    break;
  case 'down':
    this.lane++;
    break;
  default:
    return;
  }
  if (this.lane > gridMaxLane) {
    this.lane = gridMaxLane;
  } else if (this.lane <= gridMinLane) {
    this.lane = gridMinLane;
    this.win();
  }
  if (this.column > gridMaxColumn) {
    this.column = gridMaxColumn;
  } else if (this.column < gridMinColumn) {
    this.column = gridMinColumn;
  }
  // console.log(this);
};

// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// var allEnemies = [new Enemy()];
// four enemies
var allEnemies = [new Enemy(), new Enemy(), 
                  new Enemy(), new Enemy(),
                  new Enemy(), new Enemy()
                 ];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  if (allowedKeys.hasOwnProperty(e.keyCode)) {
    player.handleInput(allowedKeys[e.keyCode]);
  } else {
    console.log("keyCode not handled: " + e.keyCode);
  }
});
