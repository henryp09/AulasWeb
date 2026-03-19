const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, game, highScore = 0;
let gameRunning = false;

function startGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  gameRunning = true;

  food = randomFood();
  updateScore();

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function updateScore() {
  document.getElementById("score").innerText = score;
}

document.addEventListener("keydown", (event) => {
  if (!gameRunning) return;

  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function drawGrid() {
  ctx.strokeStyle = "#222";
  for (let i = 0; i < 400; i += box) {
    ctx.strokeRect(i, 0, box, 400);
    ctx.strokeRect(0, i, 400, box);
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 400, 400);

  drawGrid();

  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#00ccaa";
    ctx.fillRect(segment.x, segment.y, box, box);
  });


  ctx.fillStyle = "#ff4d4d";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    if (score > highScore) highScore = score;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 || headY < 0 ||
    headX >= 400 || headY >= 400 ||
    collision(newHead, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

function collision(head, body) {
  return body.some(seg => seg.x === head.x && seg.y === head.y);
}

function gameOver() {
  clearInterval(game);
  gameRunning = false;

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, 400, 400);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over 😢", 110, 180);

  ctx.font = "16px Arial";
  ctx.fillText("Pontuação: " + score, 140, 210);
  ctx.fillText("Recorde: " + highScore, 140, 230);
}
