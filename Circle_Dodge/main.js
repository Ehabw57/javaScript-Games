import InputHandler from "./handelInput.js";
import Player from "./player.js";
import Enemy, { CircleEnemy, TriangleEnemy, PolygonEnemy, DiamondEnemy } from "./enemy.js";


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
    diamond: {
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
    this.state = 'notStarted';
    this.input = new InputHandler();
    this.enemies = [];
    this.enemySpawnInterval = gameConfig.spawnInterval;
    this.spawnTime = 0;
    this.gameConfig = gameConfig;
    this.gap = gameConfig.player.size;
    this.unlockedEnemyTypes = ['triangle'];
    this.notificationTime = 0;
    this.notificationDuration = 3000;
    this.currentNotification = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' && this.state === 'notStarted') {
        this.startGame();
      } else if (e.code === 'KeyP' && (this.state === 'running' || this.state === 'paused')) {
        this.togglePause();
      } else if (e.code === 'KeyR' && this.state === 'gameOver') {
        this.restartGame();
      }
    });
  }

  startGame() {
    this.state = 'running';
    this.gameTime = 0;
    this.enemies = [];
    this.spawnTime = 0;
    this.unlockedEnemyTypes = ['triangle'];
    this.notificationTime = 0;
    this.currentNotification = null;
    this.player.x = this.game.width / 2;
    this.player.y = this.game.height / 2;
    this.player.dashCoolDown = 0;
    this.player.dashTime = 0;
  }

  togglePause() {
    if (this.state === 'running') {
      this.state = 'paused';
    } else if (this.state === 'paused') {
      this.state = 'running';
    }
  }

  restartGame() {
    this.startGame();
  }

  spawnEnemy() {
    const availableTypes = this.unlockedEnemyTypes;
    const randomIndex = Math.floor(Math.random() * availableTypes.length);
    const enemyTypeName = availableTypes[randomIndex];
    let enemy;

    if (enemyTypeName === 'circle') {
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
    } else if (enemyTypeName === 'triangle') {
      const cfg = this.gameConfig.enemy.triangle;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      enemy = new TriangleEnemy(0, 0, r, cfg.color, speed, this.player, this);
    } else if (enemyTypeName === 'polygon') {
      const cfg = this.gameConfig.enemy.polygon;
      const speed = this.rand(cfg.speed.min, cfg.speed.max);
      const r = this.rand(cfg.size.min, cfg.size.max);
      const margin = cfg.size.max * 2;
      const side = Math.floor(this.rand(0, 4));
      let x, y = 0;
      let vx = 0, vy = 0;

      if (side == 0) { 
        x = -margin;
        y = this.rand(0, this.height);
        vx = Math.abs(speed);
        vy = (Math.random() - 0.5) * speed;
      } else if (side == 1) {
        x = this.rand(0, this.width);
        y = -margin;
        vx = (Math.random() - 0.5) * speed;
        vy = Math.abs(speed);
      } else if (side == 2) {
        x = this.width + margin;
        y = this.rand(0, this.height);
        vx = -Math.abs(speed);
        vy = (Math.random() - 0.5) * speed;
      } else if (side == 3) {
        x = this.rand(0, this.width);
        y = this.height + margin;
        vx = (Math.random() - 0.5) * speed;
        vy = -Math.abs(speed);
      }
      enemy = new PolygonEnemy(x, y, r, cfg.color, speed, this.player, this, vx, vy);
    } else if (enemyTypeName === 'diamond') {
      const cfg = this.gameConfig.enemy.diamond;
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
      
      enemy = new DiamondEnemy(x, y, r, cfg.color, speed, this.player, this);
    }

    this.enemies.push(enemy);
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
    if (this.state !== 'running') return;
    
    this.gameTime += deltaTime;
    this.spawnTime += deltaTime;
    
    this.checkForNewEnemyType();
    
    if (this.spawnTime >= this.enemySpawnInterval) {
      this.spawnTime = 0;
      this.spawnEnemy();
    }
    this.enemies.forEach((e) => {
      e.update(deltaTime);
      if (e.isCollided()) {
        this.state = 'gameOver';
      }
    });
    this.player.update(this.input.keys, deltaTime);
    
    if (this.currentNotification) {
      this.notificationTime += deltaTime;
      if (this.notificationTime >= this.notificationDuration) {
        this.currentNotification = null;
        this.notificationTime = 0;
      }
    }
  }

  checkForNewEnemyType() {
    const seconds = Math.floor(this.gameTime / 1000);
    const enemyTypes = ['triangle', 'circle', 'polygon', 'diamond'];
    const unlockTimes = [0, 20, 40, 60];
    
    for (let i = 0; i < enemyTypes.length; i++) {
      if (seconds >= unlockTimes[i] && !this.unlockedEnemyTypes.includes(enemyTypes[i])) {
        this.unlockedEnemyTypes.push(enemyTypes[i]);
        this.showNotification(enemyTypes[i]);
        break;
      }
    }
  }

  showNotification(enemyType) {
    this.currentNotification = enemyType;
    this.notificationTime = 0;
  }

  draw(context) {
    this.drawGrid(context);
    
    if (this.state === 'running' || this.state === 'paused' || this.state === 'gameOver') {
      this.player.draw(context);
      this.enemies.forEach((e) => {
        e.draw(context);
      });
      this.updateUI();
    }
    
    if (this.state !== 'running') {
      this.drawSplashScreen(context);
    }
    
    if (this.currentNotification) {
      this.drawNotification(context);
    }
  }

  drawNotification(context) {
    const centerX = this.width / 2;
    const topY = 100;
    
    context.fillStyle = "white";
    context.font = "bold 32px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("NEW ENEMY UNLOCKED!", centerX, topY);
    
    context.font = "24px Arial";
    context.fillStyle = "#00ff88";
    context.fillText(this.currentNotification.toUpperCase(), centerX, topY + 40);
    
    this.drawEnemyPreview(context, centerX, topY + 80, this.currentNotification);
  }

  drawEnemyPreview(context, x, y, enemyType) {
    const size = 30;
    context.save();
    context.translate(x, y);
    
    if (enemyType === 'circle') {
      context.beginPath();
      context.fillStyle = "#ff4444";
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.fill();
    } else if (enemyType === 'triangle') {
      context.beginPath();
      context.fillStyle = "#ff8800";
      const p1x = 0;
      const p1y = -size;
      const p2x = size * 0.866;
      const p2y = size * 0.5;
      const p3x = -size * 0.866;
      const p3y = size * 0.5;
      context.moveTo(p1x, p1y);
      context.lineTo(p2x, p2y);
      context.lineTo(p3x, p3y);
      context.closePath();
      context.fill();
    } else if (enemyType === 'polygon') {
      context.beginPath();
      context.fillStyle = "#8800ff";
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.closePath();
      context.fill();
    } else if (enemyType === 'diamond') {
      context.beginPath();
      context.fillStyle = "#00ff88";
      const points = [
        { x: 0, y: -size },
        { x: size, y: 0 },
        { x: 0, y: size },
        { x: -size, y: 0 }
      ];
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      context.closePath();
      context.fill();
    }
    
    context.restore();
  }

  drawSplashScreen(context) {
    if (this.state === 'notStarted') {
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      context.fillRect(0, 0, this.width, this.height);
    } else {
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(0, 0, this.width, this.height);
    }
    
    context.font = "bold 60px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    let title = "";
    let subtitle = "";
    let titleColor = "white";
    
    switch (this.state) {
      case 'notStarted':
        title = "CIRCLE DODGE";
        subtitle = "Press ENTER to Start";
        titleColor = "white";
        break;
      case 'paused':
        title = "PAUSED";
        subtitle = "Press P to Resume";
        titleColor = "white";
        break;
      case 'gameOver':
        title = "GAME OVER";
        subtitle = "Press R to Restart";
        titleColor = "red";
        break;
    }
    
    context.fillStyle = titleColor;
    context.fillText(title, this.width / 2, this.height / 2 - 50);
    
    context.font = "24px Arial";
    context.fillStyle = "#ccc";
    context.fillText(subtitle, this.width / 2, this.height / 2 + 30);
    
    if (this.state === 'gameOver') {
      const finalScore = Math.floor(this.gameTime / 100) + (this.enemies.length * 10);
      context.font = "20px Arial";
      context.fillStyle = "#00ff88";
      context.fillText(`Final Score: ${finalScore}`, this.width / 2, this.height / 2 + 70);
    }
  }

  updateUI() {
    const dashReady = this.player.dashCoolDown <= 0;
    const dashStatus = document.getElementById('dashStatus');
    const dashBar = document.getElementById('dashBar');
    
    if (dashReady) {
      dashStatus.textContent = "Ready!";
      dashStatus.className = "dash-ready";
      dashBar.style.width = "100%";
    } else {
      const cooldownSeconds = Math.ceil(this.player.dashCoolDown / 1000);
      dashStatus.textContent = `${cooldownSeconds}s`;
      dashStatus.className = "dash-cooldown";
      
      const dashCooldownPercent = Math.max(0, this.player.dashCoolDown / this.player.maxCoolDown);
      dashBar.style.width = `${(1 - dashCooldownPercent) * 100}%`;
    }
    
    const survivalSeconds = Math.floor(this.gameTime / 1000);
    const minutes = Math.floor(survivalSeconds / 60);
    const seconds = survivalSeconds % 60;
    document.getElementById('survivalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('enemyCount').textContent = this.enemies.length;
    
    const score = Math.floor(this.gameTime / 100) + (this.enemies.length * 10);
    document.getElementById('score').textContent = score;
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
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(animate);
}
animate(0);
