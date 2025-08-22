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
  

  update(deltaTime) {
    const dx = (this.player.x - this.player.size / 2) -  (this.x + this.width / 2);
    const dy = (this.player.y - this.player.size / 2) -  (this.y + this.height /2);
    const distance = Math.hypot(dx, dy)
    const direction = {x: dx / distance, y: dy / distance}
    this.x += direction.x * this.speed
    this.y += direction.y * this.speed
  }

  draw(context) {
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.fill()
  }
}
