export default class Enemy{
  constructor(x, y, r, color, speed, player, game) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.speed = speed;
    this.player = player;
    this.game = game
  }
  
isCollided() {
  let closestX = this.game.clamp(this.x, this.player.x, this.player.x + this.player.size);
  let closestY = this.game.clamp(this.y, this.player.y, this.player.y + this.player.size);
  const distance = this.game.distance(closestX, closestY, this.x, this.y);

  return distance <= this.r;
}

  update() {
    const dx = (this.player.x + this.player.size / 2) -  this.x 
    const dy = (this.player.y + this.player.size / 2) -  this.y
    const distance = Math.hypot(dx, dy)
    const direction = {x: dx / distance, y: dy / distance}

    this.x += direction.x * this.speed
    this.y += direction.y * this.speed
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.fill()
  }
}
