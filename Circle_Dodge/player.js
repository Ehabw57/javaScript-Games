export default class Player {
  constructor(game, config) {
    this.game = game;
    this.size = config.size;
    this.color = config.color
    this.speed = config.speed;
    this.x = this.game.width / 2
    this.y = this.game.height / 2
  }

  hadnelLimits() {
    this.x = this.game.clamp(this.x, 0, this.game.width - this.size)
    this.y = this.game.clamp(this.y, 0, this.game.height - this.size)
  }

  update(input) {
    let vx = 0, vy = 0;
    if (input['ArrowDown']) vy += 1;
    if (input['ArrowRight']) vx += 1;
    if (input['ArrowUp']) vy -= 1;
    if (input['ArrowLeft']) vx -= 1;

    const direction = this.game.normlize(vx, vy)
    this.x += direction.x * this.speed
    this.y += direction.y * this.speed
    this.hadnelLimits()
  }


  draw(context) {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.size, this.size)
  }
}
