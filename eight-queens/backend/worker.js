/**
 * Worker Thread for Eight Queens Solver
 */

const { parentPort } = require('worker_threads');

const BOARD_SIZE = 8;

function isSafe(board, row, col) {
  // Check if any queen in previous rows attacks this position
  for (let i = 0; i < row; i++) {
    const placedCol = board[i];
    if (placedCol === -1) continue;
    
    if (placedCol === col) return false; // Same column

    if (Math.abs(i - row) === Math.abs(placedCol - col))   // Diagonal

      return false;
  }

  return true;
}

function solve(board, row, startCol) {
  const solutions = [];

  const backtrack = (r) => {
    if (r === BOARD_SIZE) {
      solutions.push(JSON.stringify([...board]));
      return;
    }

    const colStart = r === 0 ? startCol : 0;
    const colEnd = r === 0 ? startCol + 1 : BOARD_SIZE;

    for (let col = colStart; col < colEnd; col++) {
      board[r] = col;
      if (isSafe(board, r, col)) {
        backtrack(r + 1);
      }
    }
    board[r] = -1;
  };

  backtrack(0);
  return solutions;
}

parentPort.on('message', (msg) => {
  const { startCol, boardSize } = msg;
  const board = new Array(boardSize).fill(-1);
  const solutions = solve(board, 0, startCol);
  parentPort.postMessage({ type: 'solutions', data: solutions });
});
