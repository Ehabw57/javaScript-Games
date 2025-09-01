import InputHandler from "./handelInput.js";
import Player from "./player.js";
import Enemy, { CircleEnemy, TriangleEnemy, PolygonEnemy, ZigzagEnemy } from "./enemy.js";
//import {DEFFICULTY} from "./global.js"

const DEFFICULTY = {
  spawnInterval: 2500,
  gridGap: 30,
  player: {
    size: 30,
    color: "rgba(255, 255, 255, 1)",
    dashColor: "rgba(25, 55, 255, .5)",
    speed: 5,
    dashSpeed: 15,
    dashDuration: 200,
    dashCoolDown: 1000,
  },
  enemy: {
    circle: {
      size: { min: 10, max: 20 },
      speed: { min: 1, max: 3 },
      color: "#ff4444",
    },
    triangle: {
      size: { min: 20, max: 50 },
      speed: { min: 15, max: 25 },
      color: "#ff8800",
    },
    polygon: {
      size: { min: 20, max: 20 },
      speed: { min: 3, max: 7 },
      color: "#8800ff",
    },
    zigzag: {
      size: { min: 15, max: 15 },
      speed: { min: 3, max: 5 },
      color: "#00ff88",
    },
  },
};

class Game {
  constructor(gameConfig) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.gameTime = 0;
    this.player = new Player(this, gameConfig.player);
    this.state = null;
    this.input = new InputHandler();
    this.enemies = [];
    this.enemySpawnInterval = gameConfig.spawnInterval;
    this.spawnTime = 0;
    this.gameConfig = gameConfig;
    this.gap = gameConfig.player.size;
  }

  spawnEnemy() {
    const enemyType = Math.floor(Math.random() * 4);
    let enemy;

    if (enemyType === 0) {
      const cfg = this.gameConfig.enemy.circle;
      const margin = cfg.size.max * 2;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      const side = Math.floor(this.rand(0, 4));
      let x, y = 0;

      if (side == 0) {
        x = -margin;
        y = this.rand(0, this.height);
      } else if (side == 1) {
        x = this.rand(0, this.width);
        y = -margin;
      } else if (side == 2) {
        x = this.width + margin;
        y = this.rand(0, this.height);
      } else if (side == 3) {
        x = this.rand(0, this.width);
        y = this.height + margin;
      }

            enemy = new CircleEnemy(x, y, r, cfg.color, speed, this.player, this);
    } else if (enemyType === 1) {
      const cfg = this.gameConfig.enemy.triangle;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      enemy = new TriangleEnemy(0, 0, r, cfg.color, speed, this.player, this);
    } else if (enemyType === 2) {
      // Polygon enemy - spawns from random side and bounces
      const cfg = this.gameConfig.enemy.polygon;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      const margin = cfg.size.max * 2;
      const side = Math.floor(this.rand(0, 4));
      let x, y = 0;
      let vx = 0, vy = 0;

      if (side == 0) { // left
        x = -margin;
        y = this.rand(0, this.height);
        vx = Math.abs(speed);
        vy = (Math.random() - 0.5) * speed;
      } else if (side == 1) { // top
        x = this.rand(0, this.width);
        y = -margin;
        vx = (Math.random() - 0.5) * speed;
        vy = Math.abs(speed);
      } else if (side == 2) { // right
        x = this.width + margin;
        y = this.rand(0, this.height);
        vx = -Math.abs(speed);
        vy = (Math.random() - 0.5) * speed;
      } else if (side == 3) { // bottom
        x = this.rand(0, this.width);
        y = this.height + margin;
        vx = (Math.random() - 0.5) * speed;
        vy = -Math.abs(speed);
      }
      enemy = new PolygonEnemy(x, y, r, cfg.color, speed, this.player, this, vx, vy);
    } else {
      // Zigzag enemy - spawns from random side and moves in zigzag pattern
      const cfg = this.gameConfig.enemy.zigzag;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      const margin = cfg.size.max * 2;
      const side = Math.floor(this.rand(0, 4));
      let x, y = 0;

      if (side == 0) {
        x = -margin;
        y = this.rand(0, this.height);
      } else if (side == 1) {
        x = this.rand(0, this.width);
        y = -margin;
      } else if (side == 2) {
        x = this.width + margin;
        y = this.rand(0, this.height);
      } else if (side == 3) {
        x = this.rand(0, this.width);
        y = this.height + margin;
      }
      
      enemy = new ZigzagEnemy(x, y, r, cfg.color, speed, this.player, this);
    }

    this.enemies.push(enemy);
  }

  drawGameOver(context) {
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width, this.height);
    context.textAlign = 'center'
    context.font = "50px Arial";
    context.fillStyle = "red";
    context.fillText("GameOver", this.width / 2, this.height / 2);
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Enenmy Cought you", this.width / 2, this.height / 2 + 30);
  }

  drawGrid(context) {
    context.fillStyle = "rgba(10,13,10, 1.0)";
    context.fillRect(0, 0, this.width, this.height);
    context.beginPath();
    for (let x = 0; x <= this.width; x += this.gap) {
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += this.gap) {
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }
    context.strokeStyle = "rgba(200,200,200,0.6)";
    context.lineWidth = 0.4;
    context.stroke();
  }

  rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  distance(ax, ay, bx, by) {
    const distanX = ax - bx;
    const distanY = ay - by;
    return Math.hypot(distanX, distanY);
  }

  normlize(x, y) {
    const hypot = Math.hypot(x, y) || 1;
    return { x: x / hypot, y: y / hypot };
  }

  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  update(deltaTime) {
    this.gameTime += deltaTime;
    this.spawnTime += deltaTime;
    if (this.spawnTime >= this.enemySpawnInterval) {
      this.spawnTime = 0;
      console.log("enemy spawnd!");
      this.spawnEnemy();
    }
    this.enemies.forEach((e) => {
      e.update(deltaTime);
      if (e.isCollided()) {
        this.state = 'over';
        this.drawGameOver(ctx)
      }
    });
    this.player.update(this.input.keys, deltaTime);
  }

  draw(context) {
    if(this.state == 'over') {
      return
    }
    this.drawGrid(context);
    this.player.draw(context);
    this.enemies.forEach((e) => {
      e.draw(context);
    });
  }

  resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
}

const canvas = document.getElementById("game");
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");

const game = new Game(DEFFICULTY);
window.onresize = game.resize;
let lastTime = 0;

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if( game.state != 'over')
    game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(animate);
}
animate(0);
