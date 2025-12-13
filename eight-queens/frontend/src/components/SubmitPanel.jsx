import { useState } from 'react';
import Chessboard from './Chessboard';
import '../styles/Panel.css';

const QueenSolver = {
  isValidSolution(boardStr) {
    try {
      const board = JSON.parse(boardStr);
      if (!Array.isArray(board) || board.length !== 8) return false;

      const validPositions = board.filter(col => col >= 0 && col < 8);
      if (validPositions.length !== 8) return false;

      const uniqueCols = new Set(board);
      if (uniqueCols.size !== 8) return false;

      for (let row = 0; row < 8; row++) {
        for (let otherRow = row + 1; otherRow < 8; otherRow++) {
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
};

export default function SubmitPanel({ onSubmit }) {
  const [boardState, setBoardState] = useState([-1, -1, -1, -1, -1, -1, -1, -1]);
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const toggleSquare = (row, col) => {
    const newBoard = [...boardState];
    if (newBoard[row] === col) {
      newBoard[row] = -1;
    } else {
      // Remove other queen in this row
      if (newBoard[row] !== -1) {
        // Just replace
      }
      // Check if column already has a queen
      for (let i = 0; i < 8; i++) {
        if (i !== row && newBoard[i] === col) {
          newBoard[i] = -1;
        }
      }
      newBoard[row] = col;
    }
    setBoardState(newBoard);
  };

  const clearBoard = () => {
    setBoardState([-1, -1, -1, -1, -1, -1, -1, -1]);
  };

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setMessage({ text: 'Please enter your name', type: 'error' });
      return;
    }

    const queenCount = boardState.filter(q => q !== -1).length;
    if (queenCount !== 8) {
      setMessage({ text: `Place all 8 queens (currently ${queenCount})`, type: 'error' });
      return;
    }

    const boardStr = JSON.stringify(boardState);
    if (!QueenSolver.isValidSolution(boardStr)) {
      setMessage({ text: 'Invalid board configuration', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, board: boardStr })
      });
      const data = await res.json();
      if (data.correct) {
        setMessage({ text: data.message, type: 'success' });
        clearBoard();
        onSubmit();
      } else {
        setMessage({ text: data.message || data.error, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Submit Your Solution</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value.slice(0, 100))}
        maxLength="100"
      />
      {message.text && (
        <div className={`message ${message.type}`} style={{ margin: '10px 0 15px' }}>
          {message.text}
        </div>
      )}
      <div style={{ marginBottom: '20px', width: '400px', height: '400px', margin: '0 auto 20px' }}>
        <Chessboard boardState={boardState} onToggleSquare={toggleSquare} />
      </div>
      <button onClick={handleSubmit} disabled={loading} className="btn">
        {loading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
}
