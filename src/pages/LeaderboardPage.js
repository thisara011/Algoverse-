import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Leaderboard() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all columns
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) console.error('Error fetching leaderboard:', error)
      else setRecords(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(180deg,#05020a 0%, #0b0420 70%)', color: '#e6f7ff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(90deg,#ff00ff,#00e5ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Global Leaderboard</h1>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading scores...</p>
      ) : (
        <table style={{ width: '90%', maxWidth: '800px', margin: 'auto', borderCollapse: 'collapse', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', background: 'rgba(6,4,18,0.6)', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#3d2817' }}>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Player</th>
              <th style={thStyle}>Board</th>
              <th style={thStyle}>Guessed</th>
              <th style={thStyle}>Actual</th>
              <th style={thStyle}>Result</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((r, i) => (
                <tr key={r.id || i} style={{ background: i % 2 === 0 ? 'rgba(12,8,24,0.55)' : 'rgba(10,6,20,0.45)' }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{r.player_name || 'Anonymous'}</td>
                  <td style={tdStyle}>{r.board_size}×{r.board_size}</td>
                  
                  {/* Reading EXACT database column names */}
                  <td style={tdStyle}>{r.guessed_min_throws}</td>
                  <td style={tdStyle}>{r.actual_min_throws}</td>
                  
                  <td style={{ ...tdStyle, color: r.result === 'win' ? '#4CAF50' : '#ff5252', fontWeight: 'bold' }}>
                    {r.result === 'win' ? 'WIN' : 'LOSE'}
                  </td>
                  <td style={tdStyle}>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ ...tdStyle, padding: '20px' }}>No games played yet. Be the first!</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
      <p style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'transparent', border: '1px solid rgba(255,0,255,0.12)', color: '#ffd2ff', fontSize: '1.05rem', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px' }}
        >
          ← Back to Home
        </button>
      </p>
    </div>
  )
}

const thStyle = { padding: '15px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', background: 'linear-gradient(90deg, rgba(255,0,255,0.05), rgba(0,229,255,0.03))', color: '#e6f7ff' }
const tdStyle = { padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.02)', color: '#dff6ff' }