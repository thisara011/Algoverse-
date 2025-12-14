import { useState, useEffect } from 'react';
import './App.css';
import SolvePanel from './components/SolvePanel';
import SubmitPanel from './components/SubmitPanel';
import StatsPanel from './components/StatsPanel';

function App() {
  const [stats, setStats] = useState({
    totalSolutions: 0,
    recognizedCount: 0,
    sequentialStats: { avgTime: 0 },
    threadedStats: { avgTime: 0 },
    totalSubmissions: 0
  });
  const [solveStats, setSolveStats] = useState({
    mode: '-',
    time: '-',
    count: '-'
  });

  const loadStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>♛ Eight Queens Puzzle ♛</h1>
        <br />
        <p className="subtitle"> Click squares to toggle queens exactly one per row/column/diagonal.</p>
        <div className="content">
          <SolvePanel solveStats={solveStats} setSolveStats={setSolveStats} onSolve={loadStats} />
          <SubmitPanel onSubmit={loadStats} />
        </div>

        <StatsPanel stats={stats} solveStats={solveStats} />
      </div>
    </div>
  );
}

export default App;
