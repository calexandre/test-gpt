const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

let board = [];
let currentPiece;
let score = 0;

function setup() {
    createCanvas(COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    for (let i = 0; i < ROWS; i++) {
        board.push(new Array(COLS).fill(0));
    }
    currentPiece = new Piece();
}

function draw() {
    background(0);
    drawBoard();
    currentPiece.draw();
    if (frameCount % 60 == 0) {
        currentPiece.moveDown();
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        currentPiece.moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        currentPiece.moveRight();
    } else if (keyCode === DOWN_ARROW) {
        currentPiece.moveDown();
    } else if (keyCode === UP_ARROW) {
        currentPiece.rotate();
    }
}

function drawBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j] !== 0) {
                fill(255);
                rect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

class Piece {
    constructor() {
        this.x = Math.floor(COLS / 2) - 1;
        this.y = 0;
        this.shape = this.randomShape();
        this.color = color(random(255), random(255), random(255));
    }

    randomShape() {
        const shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]],   // O
            [[0, 1, 0], [1, 1, 1]], // T
            [[1, 1, 0], [0, 1, 1]], // S
            [[0, 1, 1], [1, 1, 0]], // Z
            [[1, 0, 0], [1, 1, 1]], // J
            [[0, 0, 1], [1, 1, 1]]  // L
        ];
        return random(shapes);
    }

    draw() {
        fill(this.color);
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] === 1) {
                    rect((this.x + j) * BLOCK_SIZE, (this.y + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    moveDown() {
        this.y++;
        if (this.collides()) {
            this.y--;
            this.lock();
            currentPiece = new Piece();
        }
    }

    moveLeft() {
        this.x--;
        if (this.collides()) {
            this.x++;
        }
    }

    moveRight() {
        this.x++;
        if (this.collides()) {
            this.x--;
        }
    }

    rotate() {
        const newShape = [];
        for (let j = 0; j < this.shape[0].length; j++) {
            const newRow = [];
            for (let i = this.shape.length - 1; i >= 0; i--) {
                newRow.push(this.shape[i][j]);
            }
            newShape.push(newRow);
        }
        this.shape = newShape;
        if (this.collides()) {
            // rotate back
            for (let i = 0; i < 3; i++) {
                this.rotate();
            }
        }
    }

    collides() {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] === 1) {
                    const newX = this.x + j;
                    const newY = this.y + i;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lock() {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j] === 1) {
                    board[this.y + i][this.x + j] = 1;
                }
            }
        }
        this.clearLines();
    }

    clearLines() {
        for (let i = ROWS - 1; i >= 0; i--) {
            if (board[i].every(cell => cell === 1)) {
                board.splice(i, 1);
                board.unshift(new Array(COLS).fill(0));
                score += 10;
            }
        }
    }
}