import '../styles/Chessboard.css';

export default function Chessboard({ boardState, onToggleSquare }) {
  return (
    <div className="chessboard">
      {boardState.map((col, row) => (
        Array.from({ length: 8 }).map((_, colIndex) => {
          const isLight = (row + colIndex) % 2 === 0;
          const hasQueen = col === colIndex;
          
          return (
            <div
              key={`${row}-${colIndex}`}
              className={`square ${isLight ? 'light' : 'dark'} ${hasQueen ? 'selected' : ''}`}
              onClick={() => onToggleSquare(row, colIndex)}
            >
              {hasQueen ? '♛' : ''}
            </div>
          );
        })
      ))}
    </div>
  );
}
