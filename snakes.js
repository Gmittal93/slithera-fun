const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let tileSize = 20; // This will change dynamically based on the screen size
let tileCountX;
let tileCountY;

// Automatically adjust the canvas size based on the screen size
function adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate the maximum height and width based on the viewport
    const maxHeight = window.innerHeight * 0.8; // Use 70% of the screen height
    const maxWidth = window.innerWidth * 0.8; // Use 90% of the screen width

    canvas.width = Math.floor(Math.min(maxHeight, maxWidth)/tileSize) * tileSize;
    canvas.height = Math.floor(Math.min(maxHeight, maxWidth)/tileSize) * tileSize;

    // Calculate the number of tiles and tile size based on the canvas size
    tileCountX = Math.floor(canvas.width / tileSize);
    tileCountY = Math.floor(canvas.height / tileSize);
}

// Call adjustCanvasSize at the beginning
adjustCanvasSize();


// // Re-adjust canvas size if window is resized
// window.addEventListener('resize', adjustCanvasSize);


// Generate a random position for the food (pallet)
function randomFoodPosition() {
    let food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
    };
    return food
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
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY || selfCollision(head)) {
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

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

// Reset the game if a collision occurs
function resetGame() {
    sleep(500)
    snake = [
        { x: 3, y: 3 }, // Head
        { x: 2, y: 3 },  // Body
        { x: 1, y: 3 },  // Pre-Tail
        { x: 0, y: 3 }   // Post-Tail
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

// Change direction of the snake using keyboard
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

// Detect touch start
function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

// Detect touch end and calculate the direction of the swipe
function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

// Handle swipe direction based on the touch movement
function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe was horizontal
        if (diffX > 0 && snakeDir.x === 0) {
            snakeDir = { x: 1, y: 0 }; // Right swipe
        } else if (diffX < 0 && snakeDir.x === 0) {
            snakeDir = { x: -1, y: 0 }; // Left swipe
        }
    } else {
        // Swipe was vertical
        if (diffY > 0 && snakeDir.y === 0) {
            snakeDir = { x: 0, y: 1 }; // Down swipe
        } else if (diffY < 0 && snakeDir.y === 0) {
            snakeDir = { x: 0, y: -1 }; // Up swipe
        }
    }
}



let snake = [
    { x: 3, y: 3 }, // Head
    { x: 2, y: 3 },  // Body
    { x: 1, y: 3 },  // Pre-Tail
    { x: 0, y: 3 }   // Post-Tail
];

let snakeDir = { x: 1, y: 0 }; // Moving to the right by default
let food 
food = randomFoodPosition();
let score = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Load images for the snake parts from 'media/images/sprites/'
const headImg = new Image();
headImg.src = 'media/images/sprites/head.png';

const bodyImg = new Image();
bodyImg.src = 'media/images/sprites/body.png';

const preTailImg = new Image();
preTailImg.src = 'media/images/sprites/pre_tail.png';

const postTailImg = new Image();
postTailImg.src = 'media/images/sprites/post_tail.png';

const palletImg = new Image();
palletImg.src = 'media/images/sprites/pallet.png';



// Event listener for keyboard direction
document.addEventListener('keydown', changeDirection);

// Event listeners for touch swipe gestures
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

// Run the game loop every 100ms
setInterval(gameLoop, 100);
