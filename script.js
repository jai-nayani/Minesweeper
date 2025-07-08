const boardSize = 10;
const mineCount = 10;
let mineField = [];
let revealedCells = 0;
let timerInterval;
let startTime;

function initializeGame() {
    mineField = [];
    revealedCells = 0;
    document.getElementById('board').innerHTML = '';
    document.getElementById('end-banner').classList.add('hidden');
    document.getElementById('timer').textContent = 'Time: 0s';
    createMineField();
    createBoard();
}

function createMineField() {
    for (let i = 0; i < boardSize; i++) {
        mineField[i] = [];
        for (let j = 0; j < boardSize; j++) {
            mineField[i][j] = { mine: false, revealed: false, flagged: false };
        }
    }
    placeMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (!mineField[x][y].mine) {
            mineField[x][y].mine = true;
            minesPlaced++;
        }
    }
}

function createBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener('click', () => revealCell(i, j));
            cell.addEventListener('contextmenu', (e) => flagCell(e, i, j));
            board.appendChild(cell);
        }
    }
}

function revealCell(x, y) {
    if (mineField[x][y].revealed || mineField[x][y].flagged) return;
    mineField[x][y].revealed = true;
    revealedCells++;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (mineField[x][y].mine) {
        cell.style.backgroundColor = 'red';
        endGame(false);
    } else {
        const mineCount = countMinesAround(x, y);
        cell.textContent = mineCount > 0 ? mineCount : '';
        cell.style.backgroundColor = '#fff';
        if (mineCount === 0) {
            revealAdjacentCells(x, y);
        }
    }
    if (revealedCells === boardSize * boardSize - mineCount) {
        endGame(true);
    }
}

function countMinesAround(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && mineField[newX][newY].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealAdjacentCells(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !mineField[newX][newY].revealed) {
                revealCell(newX, newY);
            }
        }
    }
}

function flagCell(e, x, y) {
    e.preventDefault();
    if (mineField[x][y].revealed) return;
    mineField[x][y].flagged = !mineField[x][y].flagged;
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (mineField[x][y].flagged) {
        cell.textContent = '🚩';
    } else {
        cell.textContent = '';
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(0);
        document.getElementById('timer').textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function endGame(won) {
    stopTimer();
    document.getElementById('end-banner').classList.remove('hidden');
    document.getElementById('end-message').textContent = won ? 'You Win!' : 'Game Over!';
}

document.getElementById('start-game').addEventListener('click', () => {
    initializeGame();
    startTimer();
});

document.getElementById('restart-game').addEventListener('click', () => {
    initializeGame();
    startTimer();
});