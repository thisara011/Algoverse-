import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { generateBoard, minThrowsBFS, minThrowsDP } from '../utils/gameLogic'
import GuessModal from '../components/ModalGuess' 
import Board from '../components/Board'
import Dice from '../components/Dice'
import Confetti from 'react-confetti'

export default function Game() {
  const { state } = useLocation()
  const N = state?.boardSize || 10 
  const playerName = state?.playerName || 'Guest'
  const navigate = useNavigate()

  // Game Data
  const [board, setBoard] = useState(null)
  
  // Logic State
  const [actualThrows, setActualThrows] = useState(0)
  const [gameStage, setGameStage] = useState('guess') // 'guess'  'playing'  'won'
  
  // Play State
  const [playerPos, setPlayerPos] = useState(1)
  const [diceVal, setDiceVal] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [log, setLog] = useState(["Game Started! Roll the dice."])

  useEffect(() => {
    // Generate board and solve it immediately
    const { total, snakes, ladders } = generateBoard(N)
    const bfs = minThrowsBFS(total, ladders, snakes)
    const dp = minThrowsDP(total, ladders, snakes)
    
    setActualThrows(bfs.throws)
    setBoard({ total, snakes, ladders, bfsTime: bfs.time, dpTime: dp.time })
  }, [N])

  const handleGuess = async (guess) => {
    // Calculate result
    const numericGuess = parseInt(guess, 10)
    const wonGuess = numericGuess === actualThrows
    
    // Save to Supabase (Using EXACT SQL column names)
    try {
        const { error } = await supabase.from('game_results').insert({
            player_name: playerName,
            board_size: N,
            guessed_min_throws: numericGuess, 
            actual_min_throws: actualThrows,  
            result: wonGuess ? 'win' : 'lose',
            bfs_time_ms: board.bfsTime || 0,
            dp_time_ms: board.dpTime || 0
        })
        
        if (error) {
            console.error("Supabase Insert Error:", error.message)
        }
    } catch (err) { 
        console.error("Unexpected Error:", err) 
    }

    // Switch to Play Mode
    setGameStage('playing')
  }

  const handleRoll = () => {
    if (isRolling || gameStage === 'won') return
    setIsRolling(true)
    
    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1
      setDiceVal(rolled)
      movePlayer(rolled)
      setIsRolling(false)
    }, 600)
  }

  const movePlayer = (steps) => {
    let next = playerPos + steps
    if (next > board.total) return 

    let msg = `Rolled ${steps}. Moved to ${next}.`
    
    const snake = board.snakes.find(s => s.head === next)
    const ladder = board.ladders.find(l => l.start === next)

    if (snake) {
      next = snake.tail
      msg += ` 🐍 OOPS! Snake bit you! Down to ${next}.`
    } else if (ladder) {
      next = ladder.end
      msg += ` 🪜 YAY! Ladder! Climbed to ${next}.`
    }

    setPlayerPos(next)
    setLog(prev => [msg, ...prev].slice(0, 3))

    if (next === board.total) {
      setGameStage('won')
    }
  }

  if (!board) return <div style={{color:'white', textAlign:'center', marginTop:'20%'}}>Loading Board...</div>

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      minHeight: '100vh', background: 'linear-gradient(180deg, #06020b 0%, #120022 60%)', color: '#e6f7ff', padding: '20px' 
    }}>
      {gameStage === 'won' && <Confetti />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginBottom: '10px', alignItems: 'center' }}>
        <h2 style={{ margin: 0, background: 'linear-gradient(90deg,#ff00ff,#00e5ff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{playerName} • Board</h2>
        <div style={{ textAlign: 'right', color: '#cfefff' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Target: <strong style={{ color: '#fff' }}>{board.total}</strong></p>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Current: <strong style={{ color: '#fff' }}>{playerPos}</strong></p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Board N={N} snakes={board.snakes} ladders={board.ladders} playerPos={playerPos} />
        
        <div style={{ width: '250px', background: 'linear-gradient(180deg, rgba(8,6,18,0.7), rgba(5,3,10,0.55))', padding: '20px', borderRadius: '12px', height: 'fit-content', border: '1px solid rgba(0,229,255,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 18px rgba(255,0,255,0.04) inset' }}>
          {gameStage === 'playing' || gameStage === 'won' ? (
            <>
              <Dice value={diceVal} rolling={isRolling} onRoll={handleRoll} />
              <div style={{ marginTop: '20px', textAlign: 'left', background: 'rgba(4,4,8,0.45)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(0,229,255,0.06)' }}>
                <p style={{ margin: '0 0 8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize:'0.8rem', color: '#cfefff' }}>Game Log:</p>
                {log.map((l, i) => <p key={i} style={{ fontSize: '0.9rem', margin: '6px 0', opacity: i===0?1:0.75, color: '#e6f7ff' }}>{l}</p>)}
              </div>
              {gameStage === 'won' && <div style={{ marginTop: '20px', color: '#4CAF50', fontSize: '1.5rem', fontWeight: 'bold' }}>VICTORY!</div>}
            </>
          ) : (
             <p>Solving board...</p>
          )}
          <div style={{ marginTop: '30px' }}>
             <button onClick={() => navigate('/')} style={{ width: '100%', padding: '10px', cursor: 'pointer', borderRadius:'6px', border:'1px solid rgba(255,0,255,0.12)', background: 'transparent', color: '#ffd2ff' }}>← Quit</button>
          </div>
        </div>
      </div>

      {gameStage === 'guess' && <GuessModal actual={actualThrows} onGuess={handleGuess} />}
    </div>
  )
}