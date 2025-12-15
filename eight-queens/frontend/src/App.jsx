import { useState, useEffect } from 'react';
import './App.css';
import SolvePanel from './components/SolvePanel';
import SubmitPanel from './components/SubmitPanel';
import StatsPanel from './components/StatsPanel';

function App() {
  // Handle back to menu
  const handleBackToMenu = () => {
    // Check if we're in an iframe
    if (window.parent !== window) {
      // Send message to parent to navigate back
      window.parent.postMessage({ type: 'NAVIGATE_BACK' }, '*');
    } else {
      // If not in iframe, just go back in history
      window.history.back();
    }
  };

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
        {/* Header with Back Button and Title */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '20px',
          position: 'relative'
        }}>
          <button
            onClick={handleBackToMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid #00ffff',
              borderRadius: '8px',
              color: '#00ffff',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
              transition: 'all 0.3s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
              e.target.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.5)';
              e.target.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <span>←</span>
            <span>Back to Menu</span>
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>♛ Eight Queens Puzzle ♛</h1>
          </div>

          {/* Spacer to balance the layout */}
          <div style={{ width: '140px' }}></div>
        </div>
        
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
