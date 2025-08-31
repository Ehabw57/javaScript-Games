export default class Player {
  constructor(game, config) {
    this.game = game;
    this.size = config.size;
    this.color = config.color;
    this.dashColor = config.dashColor
    this.speed = config.speed;
    this.dashSpeed = config.dashSpeed;
    this.dashDuration = config.dashDuration;
    this.maxCoolDown = config.dashCoolDown;
    this.dashCoolDown = 0;
    this.dashTime = 0;
    this.x = this.game.width / 2;
    this.y = this.game.height / 2;

    this.trail = [];
  }

  hadnelLimits() {
    this.x = this.game.clamp(this.x, 0, this.game.width - this.size);
    this.y = this.game.clamp(this.y, 0, this.game.height - this.size);
  }

  update(input, dt) {
    let vx = 0, vy = 0;
    if (input['ArrowDown']) vy += 1;
    if (input['ArrowRight']) vx += 1;
    if (input['ArrowUp']) vy -= 1;
    if (input['ArrowLeft']) vx -= 1;

    if (input['Shift'] && this.dashCoolDown < 0) {
      this.dashCoolDown = this.maxCoolDown;
      this.dashTime = this.dashDuration;
    }

    const direction = this.game.normlize(vx, vy);
    if (this.dashTime > 0) {
      this.trail.push({ x: this.x, y: this.y })

      this.x += direction.x * this.dashSpeed;
      this.y += direction.y * this.dashSpeed;
    } else {
      this.trail = []
      this.x += direction.x * this.speed;
      this.y += direction.y * this.speed;
    }

    this.dashTime -= dt;
    this.dashCoolDown -= dt;

    this.hadnelLimits();
  }

  draw(context) {
    this.trail.forEach((t) => {
      context.fillStyle = this.dashColor
      context.fillRect(t.x, t.y, this.size, this.size);
      this.trail.shift()
    })
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

