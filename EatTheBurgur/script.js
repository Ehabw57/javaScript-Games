import Player from './player.js'
import Bot from './bot.js'
import InputHandler from './handelInput.js'

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Food {
  constructor(game) {
    this.x = Math.floor(Math.random() * game.width)
    this.y = Math.floor(Math.random() * game.height)
    this.width = 40;
    this.height = 40;
    this.image = window.food
    this.size = 1;
  }
  updatePostion() {
    this.x = Math.floor(Math.random() * game.width)
    this.y = Math.floor(Math.random() * game.height)
  }
  draw(context) {
    context.drawImage(this.image, this.x , this.y, this.width, this.height )
  }
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.background = window.bg;
    this.input = new InputHandler()
    this.player = new Player(this)
    this.bot = new Bot(this)
    this.food = new Food(this)
    this.over = false
  }

  static isColliding(a, b) {
    const aWidth = a.width * a.size ;
    const aHeight = a.height * a.size ;
    const bWidth = b.width * b.size ;
    const bHeight = b.height * b.size ;

    return (
      a.x < b.x + bWidth &&
      a.x + aWidth > b.x &&
      a.y < b.y + bHeight &&
      a.y + aHeight > b.y
    );
  }


  update (deltaTime) {
    if (this.over)
      return 

    if (Game.isColliding(this.bot, this.food))
    {
      this.food.updatePostion()
      this.bot.size += 0.5;
      this.bot.speed += 0.5;
    }

    if (Game.isColliding(this.food, this.player))
    {
      this.food.updatePostion()
      this.player.size += 0.5;
      this.player.speed += 0.5;
    }
    this.player.update(this.input.keys, deltaTime)
    this.bot.update(this.input.keys, deltaTime)
  }

  draw(context) {
    context.drawImage(this.background, 0 , 0 , this.width, this.height )
    this.player.draw(context)
    this.bot.draw(context)

    if(this.player.size > 5 || this.bot.size > 5) {
      this.over = true;
      this.gameOver(this.player.size > 5 ? 'You' : 'Bot' )
      return;
    }

    this.food.draw(context)
  }

  resizeCanvas() {
    this.width = window.innerWidth
    this.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  gameOver(winner) {
    const title = winner == 'Bot' ? "Game Over!" : "Congratulation!"
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle =  winner == 'Bot' ? "#ef8251" : 'lightgreen'
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, this.width / 2, this.height / 2 - 40);

    ctx.fillStyle =  winner == 'Bot' ? "lightred" : 'yellow'
    ctx.font = "32px Arial";
    ctx.fillText(`${winner} Won`, this.width / 2, this.height / 2 + 10);
  }

}


const game = new Game(window.innerWidth, window.innerHeight)
game.resizeCanvas()
let lastTime = 0;

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  game.update(deltaTime)
  game.draw(ctx)
  requestAnimationFrame(animate)
}

animate(0);

window.onresize = function () {
  game.resizeCanvas()
}
