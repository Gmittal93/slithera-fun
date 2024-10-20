const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let snake = [
    { x: 10, y: 10 }, // Head
    { x: 9, y: 10 },  // Body
    { x: 8, y: 10 },  // Pre-Tail
    { x: 7, y: 10 }   // Post-Tail
];

let snakeDir = { x: 1, y: 0 }; // Moving to the right by default
let food = randomFoodPosition();
let score = 0;

// Load images for the snake parts from 'media/images/sprites/'
const headImg = new Image();
headImg.src = 'media/images/sprites/head.png';
const bodyImg = new Image();
bodyImg.src = 'media/images/sprites/body.png';
const preTailImg = new Image();
preTailImg.src = 'media/images/sprites/pre_tail.png';
const postTailImg = new Image();
postTailImg.src = 'media/images/sprites/post_tail.png';

// Load image for the pallet from 'media/images/sprites/'
const palletImg = new Image();
palletImg.src = 'media/images/sprites/pallet.png';

// Generate a random position for the food (pallet)
function randomFoodPosition() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        food = randomFoodPosition();
    } else {
        snake.pop(); // Remove tail segment if food isn't eaten
    }

    snake.unshift(head); // Add new head to the snake

    // Check for collisions (wall or self)
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || selfCollision(head)) {
        resetGame();
    }
}

// Check if the snake collides with itself
function selfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Reset the game if a collision occurs
function resetGame() {
    snake = [
        { x: 10, y: 10 }, // Head
        { x: 9, y: 10 },  // Body
        { x: 8, y: 10 },  // Pre-Tail
        { x: 7, y: 10 }   // Post-Tail
    ];
    snakeDir = { x: 1, y: 0 }; // Moving right by default
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    food = randomFoodPosition();
}

// Draw the game: snake and pallet
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food (pallet)
    ctx.drawImage(palletImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Draw snake (using assets for head, body, pre-tail, post-tail)
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(headImg, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        } else if (index === snake.length - 2) {
            ctx.drawImage(preTailImg, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        } else if (index === snake.length - 1) {
            ctx.drawImage(postTailImg, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        } else {
            ctx.drawImage(bodyImg, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        }
    });
}

// Change direction of the snake
function changeDirection(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            if (snakeDir.x === 0) snakeDir = { x: -1, y: 0 };
            break;
        case 38: // Up arrow
            if (snakeDir.y === 0) snakeDir = { x: 0, y: -1 };
            break;
        case 39: // Right arrow
            if (snakeDir.x === 0) snakeDir = { x: 1, y: 0 };
            break;
        case 40: // Down arrow
            if (snakeDir.y === 0) snakeDir = { x: 0, y: 1 };
            break;
    }
}

// Event listener for key presses to control the snake
document.addEventListener('keydown', changeDirection);

// Run the game loop every 100ms
setInterval(gameLoop, 100);
