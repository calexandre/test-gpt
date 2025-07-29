// Tetris Game Implementation with Vanilla JavaScript Canvas

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

// Game variables
let canvas, ctx, nextCanvas, nextCtx;
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let dropCounter = 0;
let dropInterval = 60; // frames
let gameOver = false;
let gameRunning = false;

// Tetris piece definitions (tetrominoes)
const PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00FFFF' // Cyan
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#FFFF00' // Yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#800080' // Purple
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00FF00' // Green
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#FF0000' // Red
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000FF' // Blue
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#FFA500' // Orange
  }
};

class TetrisPiece {
  constructor(type, x = Math.floor(BOARD_WIDTH / 2) - 1, y = 0) {
    this.type = type;
    this.shape = PIECES[type].shape;
    this.color = PIECES[type].color;
    this.x = x;
    this.y = y;
  }

  rotate() {
    // Rotate the shape matrix 90 degrees clockwise
    const rotated = [];
    const rows = this.shape.length;
    const cols = this.shape[0].length;
    
    for (let i = 0; i < cols; i++) {
      rotated[i] = [];
      for (let j = 0; j < rows; j++) {
        rotated[i][j] = this.shape[rows - 1 - j][i];
      }
    }
    
    return rotated;
  }

  canMove(dx, dy, newShape = null) {
    const shape = newShape || this.shape;
    const newX = this.x + dx;
    const newY = this.y + dy;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = newX + col;
          const y = newY + row;
          
          // Check boundaries
          if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
            return false;
          }
          
          // Check collision with existing pieces
          if (y >= 0 && board[y][x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  move(dx, dy) {
    if (this.canMove(dx, dy)) {
      this.x += dx;
      this.y += dy;
      return true;
    }
    return false;
  }

  rotatePiece() {
    const rotated = this.rotate();
    if (this.canMove(0, 0, rotated)) {
      this.shape = rotated;
      return true;
    }
    return false;
  }
}

function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  nextCanvas = document.getElementById('nextCanvas');
  nextCtx = nextCanvas.getContext('2d');
  
  // Initialize board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      board[y][x] = null;
    }
  }
  
  // Create first pieces
  spawnNewPiece();
  nextPiece = createRandomPiece();
  
  // Start game loop
  gameRunning = true;
  gameLoop();
  
  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeyPress);
}

function gameLoop() {
  if (!gameRunning) return;
  
  if (gameOver) {
    drawGameOver();
  } else {
    updateGame();
    draw();
  }
  
  setTimeout(gameLoop, 1000 / 60); // 60 FPS
}

function updateGame() {
  dropCounter++;
  
  if (dropCounter >= dropInterval) {
    if (!currentPiece.move(0, 1)) {
      // Piece can't move down, lock it in place
      lockPiece();
      clearLines();
      spawnNewPiece();
      
      // Check game over
      if (!currentPiece.canMove(0, 0)) {
        gameOver = true;
        document.getElementById('gameOverText').style.display = 'block';
      }
    }
    dropCounter = 0;
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw board
  drawBoard();
  
  // Draw current piece
  drawCurrentPiece();
  
  // Draw next piece
  drawNextPiece();
  
  // Update UI
  updateUI();
}

function drawBoard() {
  // Draw board cells
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x]) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * CELL_SIZE + 50, y * CELL_SIZE + 50, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * CELL_SIZE + 50, y * CELL_SIZE + 50, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  
  // Draw grid lines
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE + 50, 50);
    ctx.lineTo(x * CELL_SIZE + 50, BOARD_HEIGHT * CELL_SIZE + 50);
    ctx.stroke();
  }
  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(50, y * CELL_SIZE + 50);
    ctx.lineTo(BOARD_WIDTH * CELL_SIZE + 50, y * CELL_SIZE + 50);
    ctx.stroke();
  }
}

function drawCurrentPiece() {
  if (!currentPiece) return;
  
  ctx.fillStyle = currentPiece.color;
  
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = (currentPiece.x + col) * CELL_SIZE + 50;
        const y = (currentPiece.y + row) * CELL_SIZE + 50;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function drawNextPiece() {
  if (!nextPiece) return;
  
  // Clear next canvas
  nextCtx.fillStyle = '#000';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  
  nextCtx.fillStyle = nextPiece.color;
  
  for (let row = 0; row < nextPiece.shape.length; row++) {
    for (let col = 0; col < nextPiece.shape[row].length; col++) {
      if (nextPiece.shape[row][col]) {
        const x = col * 20 + 10;
        const y = row * 20 + 10;
        nextCtx.fillRect(x, y, 18, 18);
        nextCtx.strokeStyle = '#333';
        nextCtx.strokeRect(x, y, 18, 18);
      }
    }
  }
}

function updateUI() {
  document.getElementById('score').textContent = score;
  document.getElementById('lines').textContent = lines;
  document.getElementById('level').textContent = level;
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#FF0000';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
}

function spawnNewPiece() {
  currentPiece = nextPiece || createRandomPiece();
  nextPiece = createRandomPiece();
}

function createRandomPiece() {
  const types = Object.keys(PIECES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  return new TetrisPiece(randomType);
}

function lockPiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentPiece.x + col;
        const y = currentPiece.y + row;
        if (y >= 0) {
          board[y][x] = currentPiece.color;
        }
      }
    }
  }
}

function clearLines() {
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let fullLine = true;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (!board[y][x]) {
        fullLine = false;
        break;
      }
    }
    
    if (fullLine) {
      // Remove the line
      board.splice(y, 1);
      // Add empty line at top
      const emptyLine = [];
      for (let x = 0; x < BOARD_WIDTH; x++) {
        emptyLine[x] = null;
      }
      board.unshift(emptyLine);
      
      linesCleared++;
      y++; // Check the same line again
    }
  }
  
  if (linesCleared > 0) {
    lines += linesCleared;
    score += linesCleared * 100 * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(10, 60 - (level - 1) * 5);
  }
}

function handleKeyPress(event) {
  if (gameOver) {
    if (event.key === 'r' || event.key === 'R') {
      restartGame();
    }
    return;
  }
  
  switch (event.key) {
    case 'ArrowLeft':
      currentPiece.move(-1, 0);
      event.preventDefault();
      break;
    case 'ArrowRight':
      currentPiece.move(1, 0);
      event.preventDefault();
      break;
    case 'ArrowDown':
      currentPiece.move(0, 1);
      event.preventDefault();
      break;
    case 'ArrowUp':
      currentPiece.rotatePiece();
      event.preventDefault();
      break;
  }
}

function restartGame() {
  // Reset game state
  board = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      board[y][x] = null;
    }
  }
  
  score = 0;
  lines = 0;
  level = 1;
  dropCounter = 0;
  dropInterval = 60;
  gameOver = false;
  
  document.getElementById('gameOverText').style.display = 'none';
  
  spawnNewPiece();
  nextPiece = createRandomPiece();
}

// Start the game when page loads
window.addEventListener('load', init);