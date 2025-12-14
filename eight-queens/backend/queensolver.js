/**
 * Eight Queens Puzzle Solver
 * Sequential and Threaded (Worker Threads) implementations
 */

const { Worker } = require('worker_threads');
const path = require('path');

class QueenSolver {
  static BOARD_SIZE = 8;

  /**
   * Check if a queen placement is safe
   * @param {number[]} board - Current board state
   * @param {number} row - Row to check
   * @param {number} col - Column to check
   * @returns {boolean}
   */
  static isSafe(board, row, col) {
    // Check if any queen in previous rows attacks this position
    for (let i = 0; i < row; i++) {
      const placedCol = board[i];
      if (placedCol === -1) continue;
      
      // Same column
      if (placedCol === col) return false;
      
      // Diagonal
      if (Math.abs(i - row) === Math.abs(placedCol - col)) return false;
    }

    return true;
  }

  /**
   * Convert board array to string representation
   * @param {number[]} board - Board state
   * @returns {string}
   */
  static boardToString(board) {
    return JSON.stringify(board);
  }

  /**
   * Convert string to board array
   * @param {string} boardStr - Board string
   * @returns {number[]}
   */
  static stringToBoard(boardStr) {
    return JSON.parse(boardStr);
  }

  /**
   * Sequential solver - finds all solutions
   * @returns {Promise<{solutions: number[][], time: number}>}
   */
  static async solveSequential() {
    const startTime = performance.now();
    const solutions = [];
    const board = new Array(this.BOARD_SIZE).fill(-1);

    const solve = (row) => {
      if (row === this.BOARD_SIZE) {
        solutions.push([...board]);
        return;
      }

      for (let col = 0; col < this.BOARD_SIZE; col++) {
        board[row] = col;
        if (this.isSafe(board, row, col)) {
          solve(row + 1);
        }
      }
      board[row] = -1;
    };

    solve(0);
    const endTime = performance.now();

    return {
      solutions: solutions.map(b => this.boardToString(b)),
      time: endTime - startTime,
      count: solutions.length
    };
  }

  /**
   * Threaded solver - uses Worker Threads
   * @returns {Promise<{solutions: string[], time: number}>}
   */
  static async solveThreaded(numWorkers = 8) {
    const startTime = performance.now();
    const solutions = [];

    // Distribute work across workers - one worker per starting column
    return new Promise((resolve, reject) => {
      let completedWorkers = 0;
      const totalWorkers = Math.min(numWorkers, this.BOARD_SIZE);

      for (let startCol = 0; startCol < totalWorkers; startCol++) {
        const worker = new Worker(path.join(__dirname, 'worker.js'));

        worker.on('message', (msg) => {
          if (msg.type === 'solutions') {
            solutions.push(...msg.data);
          }
          completedWorkers++;

          if (completedWorkers === totalWorkers) {
            const endTime = performance.now();
            resolve({
              solutions: solutions,
              time: endTime - startTime,
              count: solutions.length
            });
          }
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });

        worker.postMessage({ startCol, boardSize: this.BOARD_SIZE });
      }
    });
  }

  /**
   * Validate if a board configuration is a valid solution
   * @param {string} boardStr - Board string representation
   * @returns {boolean}
   */
  static isValidSolution(boardStr) {
    try {
      const board = this.stringToBoard(boardStr);
      
      if (!Array.isArray(board) || board.length !== this.BOARD_SIZE) {
        return false;
      }

      // Check for exactly 8 queens
      const validPositions = board.filter(col => col >= 0 && col < this.BOARD_SIZE);
      if (validPositions.length !== this.BOARD_SIZE) {
        return false;
      }

      // Check all columns are different
      const uniqueCols = new Set(board);
      if (uniqueCols.size !== this.BOARD_SIZE) {
        return false;
      }

      // Check diagonals
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let otherRow = row + 1; otherRow < this.BOARD_SIZE; otherRow++) {
          const col1 = board[row];
          const col2 = board[otherRow];
          if (Math.abs(row - otherRow) === Math.abs(col1 - col2)) {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  }
}

module.exports = QueenSolver;
