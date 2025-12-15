import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [playerName, setPlayerName] = useState('')
  const [size, setSize] = useState(8)
  const navigate = useNavigate()

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

  const handleStartGame = () => {
    // Basic validation
    if (!playerName.trim()) {
      alert("Please enter a player name!")
      return
    }
    if (size < 6 || size > 12) {
      alert("Please choose a board size between 6 and 12.")
      return
    }

    // Navigate to Game page with the chosen name and board size
    navigate('/game', { 
      state: { 
        boardSize: size, 
        playerName: playerName 
      } 
    })
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '50px',
      background: 'linear-gradient(#4a2c0d, #2c1810)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Back Button */}
      <button
        onClick={handleBackToMenu}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
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

      <h1 style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '2px 2px 4px black' }}>Snakes & Ladders</h1>
      
      <div style={{
        maxWidth: '400px',
        width: '100%',
        margin: 'auto',
        background: '#3d2817',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        border: '1px solid #5d4037'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#ffeb8b' }}>Enter Game Details</h3>
        
        {/* Name Input */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Player Name:</label>
            <input 
            style={inputStyle} 
            type="text" 
            placeholder="e.g. SnakeMaster99" 
            value={playerName} 
            onChange={e => setPlayerName(e.target.value)} 
            />
        </div>
        
        {/* Size Selector */}
        <div style={{ margin: '20px 0', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Board Size (6-12):</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="range" 
              min="6" 
              max="12" 
              value={size} 
              onChange={e => setSize(+e.target.value)}
              style={{ flex: 1, cursor: 'pointer' }} 
            />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', textAlign: 'right' }}>{size}</span>
          </div>
        </div>

        <button onClick={handleStartGame} style={buttonStyle}>
          Start Game
        </button>
      </div>

      <p style={{ marginTop: '30px' }}>
        <a href="/leaderboard" style={{ color: '#ffeb8b', textDecoration: 'none', fontSize: '1.2rem', borderBottom: '1px dashed #ffeb8b' }}>
          View Leaderboard →
        </a>
      </p>
    </div>
  )
}

const inputStyle = { 
  width: '100%', 
  padding: '12px', 
  borderRadius: '8px', 
  border: 'none', 
  boxSizing: 'border-box',
  fontSize: '1rem'
}

const buttonStyle = { 
  width: '100%', 
  padding: '14px', 
  marginTop: '10px', 
  borderRadius: '8px', 
  border: 'none', 
  background: '#8d5524', 
  color: 'white', 
  fontSize: '1.1rem', 
  cursor: 'pointer',
  transition: 'background 0.2s'
}