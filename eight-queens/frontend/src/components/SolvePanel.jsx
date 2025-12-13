import { useState } from 'react';
import '../styles/Panel.css';

export default function SolvePanel({ solveStats, setSolveStats, onSolve }) {
  const [loading, setLoading] = useState(null);

  const solve = async (mode) => {
    setLoading(mode);
    setSolveStats({ mode: '-', time: '-', count: '-' });
    try {
      const res = await fetch(`http://localhost:3001/solve/${mode}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSolveStats({
          mode: data.mode,
          time: data.timeMs + ' ms',
          count: data.count
        });
        onSolve();
      }
    } catch (error) {
      console.error('Solve error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="panel">
      <h2>Solve Algorithm</h2>
      <div className="controls">
        <button
          onClick={() => solve('sequential')}
          disabled={loading !== null}
          className="btn"
        >
          {loading === 'sequential' ? 'Loading...' : 'Sequential'}
        </button>
        <button
          onClick={() => solve('threaded')}
          disabled={loading !== null}
          className="btn"
        >
          {loading === 'threaded' ? 'Loading...' : 'Threaded'}
        </button>
      </div>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Mode:</span>
          <span className="stat-value">{solveStats.mode}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{solveStats.time}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Solutions:</span>
          <span className="stat-value">{solveStats.count}</span>
        </div>
      </div>
    </div>
  );
}
