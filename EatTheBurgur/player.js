export default class Player {
  constructor(game) {
    this.game = game;
     this.background = window.background
    this.width = 50;
    this.height = 50;
    this.size = 2;
    this.speed = 6;
    this.x = this.game.width / 2 
    this.y = this.game.height / 2
    this.image = window.player
    this.frame = 0;
    this.maxFrame = 10
    this.fps = 8;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
  }

  update(input, deltaTime ) {
    //movment hadleing
    if (input['ArrowDown'])
      this.y += this.speed;
    if (input['ArrowRight'])
      this.x += this.speed;
    if (input['ArrowUp'])
      this.y -= this.speed;
    if (input['ArrowLeft'])
      this.x -= this.speed;

    // limits check
    if (this.x < 0)
      this.x = 0
    if (this.x > this.game.width - this.width * this.size)
      this.x = this.game.width - this.width * this.size
    if (this.y < 0)
      this.y = 0
    if (this.y > this.game.height - this.height * this.size)
      this.y = this.game.height - this.height * this.size

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
