export default class Bot {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.size = 2;
    this.speed = 4;
    this.x = Math.floor(Math.random() * game.width)
    this.y = Math.floor(Math.random() * game.height)
    this.image = window.bot
    this.frame = 0;
    this.maxFrame = 10
    this.fps = 8;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
  }

  update(input, deltaTime ) {
    //chase the food
    const dx = (this.game.food.x - this.game.food.size / 2) -  (this.x + this.width / 2);
    const dy = (this.game.food.y - this.game.food.size / 2) -  (this.y + this.height /2);
    const distance = Math.hypot(dx, dy)
    const direction = {x: dx / distance, y: dy / distance}
    this.x += direction.x * this.speed
    this.y += direction.y * this.speed


    //framerate Control
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0 
      if (this.frame > this.maxFrame)
        this.frame = 0;
      this.frame++;
    } else
      this.frameTimer += deltaTime

  }

  draw(context) {
    context.drawImage(this.image, this.width * this.frame, 0, this.width, this.height, this.x, this.y, this.width * this.size, this.height * this.size)
  }
}
