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
    <div style={{ padding: '40px', background: '#2c1810', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Global Leaderboard</h1>
      
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading scores...</p>
      ) : (
        <table style={{ width: '90%', maxWidth: '800px', margin: 'auto', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
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
                <tr key={r.id || i} style={{ background: i % 2 === 0 ? '#4a341f' : '#5d4037' }}>
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
          style={{ background: 'none', border: 'none', color: '#ffeb8b', fontSize: '1.2rem', cursor: 'pointer', borderBottom: '1px dashed #ffeb8b' }}
        >
          ← Back to Home
        </button>
      </p>
    </div>
  )
}

const thStyle = { padding: '15px', border: '1px solid #2c1810', textAlign: 'center', background: '#2c1810' }
const tdStyle = { padding: '12px', textAlign: 'center', border: '1px solid #2c1810' }