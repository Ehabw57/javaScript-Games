export default class Enemy {
  constructor(x, y, r, color, speed, player, game) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.speed = speed;
    this.player = player;
    this.game = game;
  }

  isCollided() {
    let closestX = this.game.clamp(this.x, this.player.x, this.player.x + this.player.size);
    let closestY = this.game.clamp(this.y, this.player.y, this.player.y + this.player.size);
    const distance = this.game.distance(closestX, closestY, this.x, this.y);

    return distance <= this.r;
  }

  update() {
  }

  draw(context) {
  }
}

export class CircleEnemy extends Enemy {
  constructor(x, y, r, color, speed, player, game) {
    super(x, y, r, color, speed, player, game);
  }

  update() {
    const dx = (this.player.x + this.player.size / 2) - this.x;
    const dy = (this.player.y + this.player.size / 2) - this.y;
    const distance = Math.hypot(dx, dy);
    const direction = { x: dx / distance, y: dy / distance };

    this.x += direction.x * this.speed;
    this.y += direction.y * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fill();
  }
}

export class TriangleEnemy extends Enemy {
  constructor(x, y, r, color, speed, player, game) {
    super(x, y, r, color, speed, player, game);
    this.axis = Math.random() < 0.5 ? 'h' : 'v';
    this.targetX = 0;
    this.targetY = 0;
    this.setTarget();
  }

  setTarget() {
    if (this.axis === 'h') {
      const fromLeft = Math.random() < 0.5;
      this.y = Math.random() * this.game.height;
      if (fromLeft) {
        this.x = -this.r;
        this.targetX = this.game.width + this.r;
      } else {
        this.x = this.game.width + this.r;
        this.targetX = -this.r;
      }
      this.targetY = this.y;
    } else {
      const fromTop = Math.random() < 0.5;
      this.x = Math.random() * this.game.width;
      if (fromTop) {
        this.y = -this.r;
        this.targetY = this.game.height + this.r;
      } else {
        this.y = this.game.height + this.r;
        this.targetY = -this.r;
      }
      this.targetX = this.x; 
    }
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance > 0) {
      const direction = { x: dx / distance, y: dy / distance };
      this.x += direction.x * this.speed;
      this.y += direction.y * this.speed;
    }


    if (this.x < -this.r * 2 || this.x > this.game.width + this.r * 2 ||
        this.y < -this.r * 2 || this.y > this.game.height + this.r * 2) {
      this.axis = Math.random() < 0.5 ? 'h' : 'v';
      this.setTarget();
    }
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const angle = Math.atan2(dy, dx);
    

    const headLength = this.r * 0.6;
    const headAngle = Math.PI / 6;
    
    const p1x = this.x + Math.cos(angle) * this.r;
    const p1y = this.y + Math.sin(angle) * this.r;
    const p2x = this.x + Math.cos(angle + headAngle) * headLength;
    const p2y = this.y + Math.sin(angle + headAngle) * headLength;
    const p3x = this.x + Math.cos(angle - headAngle) * headLength;
    const p3y = this.y + Math.sin(angle - headAngle) * headLength;
    
    context.moveTo(p1x, p1y);
    context.lineTo(p2x, p2y);
    context.lineTo(p3x, p3y);
    context.closePath();
    context.fill();
  }
}


