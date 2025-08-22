import InputHandler from "./handelInput.js";
import Player from "./player.js"
//import Enemy from "./enemy.js"
//import {DEFFICULTY} from "./global.js"

const DEFFICULTY = {
  spawnInterval: 3,
  gridGap: 30,
  player: {
    size: 30,
    color: "blue",
    speed: 10,
  },
  enemy: {
    size: {min: 5, max:20},
    speed: {min: 3, max: 10},
  }
}

class Game {
  constructor(gameCofnig){
    this.width = canvas.width
    this.height = canvas.height
    this.player = new Player(this, gameCofnig.player)
    this.gameTime = 0;
    this.state = null;
    this.input = new InputHandler()
    this.enemies = []
    this.enemySpawnInterval = gameCofnig.spawnInterval;
    this.gap = gameCofnig.player.size;
  }

  spawnEnemy() {
    const margin = gameConfig.enemy.size.max * 2;
    const speed = this.rand(gameConfig.enemy.speed.min, gameConfig.enemy.speed.max)
    const raduis = this.rand(gameConfig.enemy.size.min, gameConfig.enemy.size.max)
    const side = Math.floor(this.rand(0, 4)) 
    let x, y = 0;

    if (side == 0) {x = -margin; y = this.rand(0, this.height)}
    else if (side == 1) {x = this.rand(0, this.width); y = -margin}
    else if (side == 2) {x = this.width + margin; y = this.rand(0, this.height)}
    else {x = this.rand(0, this.width); y = this.height + margin}

    return {
      x, y,
      r: raduis,
      speed,side}
  }

  drawGrid(context) {
    context.beginPath();
    console.log(this.width)
    for (let x = 0; x <= this.width; x += this.gap) {
      context.moveTo(x, 0); context.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += this.gap) {
      context.moveTo(0, y); context.lineTo(this.width, y);
    }
    context.strokeStyle = 'rgba(0,0,0,0.2)';
    context.lineWidth = 0.4;
    context.stroke();
  }

  rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  distance(ax, ay, bx, by) {
    const distanX = ax - bx;
    const distanY = ay - by;
    return Math.hypot(distanX, distanY)
  }

  normlize(x, y) {
    const hypot = Math.hypot(x, y) || 1;
    return {x: x / hypot, y: y / hypot}
  }

  clamp(v, min, max) { 
    return Math.max(min, Math.min(max, v)); 
  }

  update(deltaTime) {
    this.player.update(this.input.keys, deltaTime)
  }

  draw(context) {
    this.drawGrid(context)
    this.player.draw(context)
  }

  resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}

const canvas = document.getElementById('game');
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext('2d');

const game = new Game(DEFFICULTY)
window.onresize = game.resize;
let lastTime = 0;

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  game.update(deltaTime)
  game.draw(ctx)
  requestAnimationFrame(animate)
}
animate(0)

