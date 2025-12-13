import '../styles/Panel.css';

export default function StatsPanel({ stats, solveStats }) {
  return (
    <div className="panel">
      <h2>Game Statistics</h2>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Total Solutions in DB:</span>
          <span className="stat-value">{stats.totalSolutions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Recognized by Players:</span>
          <span className="stat-value">{stats.recognizedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sequential Avg Time:</span>
          <span className="stat-value">{stats.sequentialStats.avgTime.toFixed(2)} ms</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Threaded Avg Time:</span>
          <span className="stat-value">{stats.threadedStats.avgTime.toFixed(2)} ms</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Submissions:</span>
          <span className="stat-value">{stats.totalSubmissions}</span>
        </div>
      </div>
    </div>
  );
}
