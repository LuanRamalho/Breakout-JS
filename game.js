const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 15;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 12;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 7;
let dy = -7;

const brickRowCount = 8;
const brickColumnCount = 14;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
resetBricks();

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let lives = 3;
let level = 1;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF"; // Bola branca
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00FF00"; // Paleta verde claro
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color; // Utiliza a cor definida para o bloco
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawHighScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("High Score: " + highScore, canvas.width - 700, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, canvas.width / 2 + 100, 20);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += b.points; // Atualiza a pontuação baseada na cor do bloco
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                    }
                    if (allBricksCleared()) {
                        levelUp();
                    }
                }
            }
        }
    }
}

function allBricksCleared() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                return false;
            }
        }
    }
    return true;
}

function levelUp() {
    level++;
    resetBricks();
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
}

function resetBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            let color, points;
            switch (r) {
                case 0:
                    color = "#FFFFFF";
                    points = 10;
                    break;
                case 1:
                    color = "#00FFFF";
                    points = 25;
                    break;
                case 2:
                    color = "#FFA500";
                    points = 35;
                    break;
                case 3:
                    color = "#00FF00";
                    points = 50;
                    break;
                case 4:
                    color = "#800080";
                    points = 75;
                    break;
                case 5:
                    color = "#FFFF00";
                    points = 100;
                    break;
                case 6:
                    color = "#FF0000";
                    points = 150;
                    break;
                case 7:
                    color = "#808080";
                    points = 200;
                    break;
            }
            bricks[c][r] = { x: 0, y: 0, status: 1, color: color, points: points };
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawHighScore();
    drawLives();
    drawLevel();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 7;
                dy = -7;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

setInterval(movePaddle, 10);

draw();
