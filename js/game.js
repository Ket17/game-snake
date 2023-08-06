document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  const startButton = document.querySelector(".game-start");
  const resetButton = document.querySelector(".game-reset");
  const scoreDisplay = document.querySelector(".game-score");

  const snakeImage = new Image();
  snakeImage.src = "img/snake.png"; // Замініть "path/to/snake_image.png" на шлях до зображення для змійки

  const foodImage = new Image();
  foodImage.src = "img/cherry.png"; // Замініть "path/to/food_image.png" на шлях до зображення для їжі

  // Основний клас гри
  class SnakeGame {
    constructor() {
      this.cellSize = 20;
      this.gridSize = canvas.width / this.cellSize;
      this.snake = [{ x: 2, y: 2 }];
      this.food = this.getRandomPosition();
      this.direction = { x: 1, y: 0 };
      this.score = 0;
      this.isGameOver = false;
      this.gameSpeed = 150; // Значення змінної для швидкості руху змійки

      document.addEventListener("keydown", this.handleKeyPress.bind(this));
      startButton.addEventListener("click", this.startGame.bind(this));
      resetButton.addEventListener("click", this.resetGame.bind(this));
    }

    drawCell(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    drawSnake() {
      this.snake.forEach((segment) => {
        ctx.drawImage(snakeImage, segment.x * this.cellSize, segment.y * this.cellSize, this.cellSize, this.cellSize);
      });
    }

    drawFood() {
      ctx.drawImage(foodImage, this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize, this.cellSize);
    }

    getRandomPosition() {
      return {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };
    }

    isCollision(x, y) {
      return (
        x < 0 ||
        y < 0 ||
        x >= this.gridSize ||
        y >= this.gridSize ||
        this.snake.some((segment) => segment.x === x && segment.y === y)
      );
    }

    handleKeyPress(event) {
      if (event.keyCode === 37 && this.direction.x !== 1) {
        this.direction = { x: -1, y: 0 }; // Left arrow key
      } else if (event.keyCode === 38 && this.direction.y !== 1) {
        this.direction = { x: 0, y: -1 }; // Up arrow key
      } else if (event.keyCode === 39 && this.direction.x !== -1) {
        this.direction = { x: 1, y: 0 }; // Right arrow key
      } else if (event.keyCode === 40 && this.direction.y !== -1) {
        this.direction = { x: 0, y: 1 }; // Down arrow key
      }
    }

    update() {
      if (this.isGameOver) return;

      const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
      if (this.isCollision(head.x, head.y)) {
        this.isGameOver = true;
        this.displayGameOver();
        return;
      }

      this.snake.unshift(head);

      if (head.x === this.food.x && head.y === this.food.y) {
        this.score++;
        this.food = this.getRandomPosition();
      } else {
        this.snake.pop();
      }
    }

    displayGameOver() {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Кінець гри!", canvas.width / 2, canvas.height / 2);
      scoreDisplay.textContent = `Очки: ${this.score}`;
    }

    draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawSnake();
      this.drawFood();
    }

    startGame() {
      this.isGameOver = false;
      this.score = 0;
      this.snake = [{ x: 2, y: 2 }];
      this.direction = { x: 1, y: 0 };
      this.food = this.getRandomPosition();
      this.gameLoop = setInterval(() => {
        this.update();
        this.draw();
      }, this.gameSpeed);
    }

    resetGame() {
      clearInterval(this.gameLoop);
      this.startGame();
    }
  }

  const game = new SnakeGame();
});
