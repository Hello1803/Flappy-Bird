let bird = {
    x: 100,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

const birdWidth = 50;
const birdHeight = 50;

let pipes = [];
const pipeWidth = 80;
const pipeGap = 210;
const pipeSpeed = 2;
const pipeInterval = 300;

function createPipe() {
    const topHeight = Math.random() * (640 - 50) + 50;
    const bottomHeight = 720 - topHeight - pipeGap;
    pipes.push({
        x: 1280,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false
    });
}

function updateBird(deltaTime) {
    bird.velocity += bird.gravity * deltaTime;
    bird.y += bird.velocity * deltaTime;
}

function updatePipes(deltaTime) {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed * deltaTime;
    });
    pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

function addPipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 1280 - pipeInterval) {
        createPipe();
    }
}

function checkCollisions() {
    if (bird.y + birdHeight > 720 || bird.y < 0) {
        gameOver();
        return;
    }
    pipes.forEach(pipe => {
        if (
            bird.x + birdWidth > pipe.x && 
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + birdHeight > 720 - pipe.bottomHeight)
        ) {
            gameOver();
        }
    });
}

let score = 0;

function updateScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
        }
    });
}

const birdElement = document.getElementById('bird');
const pipesContainer = document.getElementById('pipes');
const scoreElement = document.getElementById('score');

function renderBird() {
    birdElement.style.top = bird.y + 'px';
}

function renderPipes() {
    pipesContainer.innerHTML = '';
    pipes.forEach(pipe => {
        const topPipe = document.createElement('div');
        topPipe.style.position = 'absolute';
        topPipe.style.left = pipe.x + 'px';
        topPipe.style.top = '0px';
        topPipe.style.width = pipeWidth + 'px';
        topPipe.style.height = pipe.topHeight + 'px';
        topPipe.style.backgroundColor = 'green';

        const bottomPipe = document.createElement('div');
        bottomPipe.style.position = 'absolute';
        bottomPipe.style.left = pipe.x + 'px';
        bottomPipe.style.bottom = '0px';
        bottomPipe.style.width = pipeWidth + 'px';
        bottomPipe.style.height = pipe.bottomHeight + 'px';
        bottomPipe.style.backgroundColor = 'green';

        pipesContainer.appendChild(topPipe);
        pipesContainer.appendChild(bottomPipe);
    });
}

function renderScore() {
    scoreElement.textContent = 'Score: ' + score;
}

let isGameOver = false;
let gameStarted = false;
let lastTime = 0;

function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = Math.min((time - lastTime) / 16.67, 2); // Cap at 2x speed
    lastTime = time;

    if (!isGameOver) {
        if (gameStarted) {
            updateBird(deltaTime);
            updatePipes(deltaTime);
            addPipes();
            checkCollisions();
            updateScore();
        }
        renderBird();
        renderPipes();
        renderScore();
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!gameStarted && !isGameOver) {
            gameStarted = true;
        }
        if (!isGameOver) {
            bird.velocity = bird.jump;
        }
    }
});

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        showRestartButton();
    }
}

function showRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.position = 'absolute';
    restartButton.style.left = '50%';
    restartButton.style.top = '50%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '20px';
    restartButton.addEventListener('click', restartGame);
    document.getElementById('game-container').appendChild(restartButton);
}

function restartGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    gameStarted = false;
    const restartButton = document.querySelector('button');
    if (restartButton) restartButton.remove();
    renderScore();
}

requestAnimationFrame(gameLoop);