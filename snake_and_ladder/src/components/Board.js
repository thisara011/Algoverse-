import React from 'react'
import { getCoords } from '../utils/gameLogic'
import { motion } from 'framer-motion'

export default function Board({ N, snakes, ladders, playerPos }) {
  const cellSize = 50
  const boardSize = N * cellSize

  // Get the exact center pixel (x,y) of a tile number
  const getCenter = (pos) => {
    const { row, col } = getCoords(pos, N)
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2
    }
  }

  // Snakes connect Head and Tail. Head is start, Tail is end
  const getSnakeStyle = (head, tail) => {
    const start = getCenter(head)
    const end = getCenter(tail)

    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      position: 'absolute',
      left: start.x,
      top: start.y,
      width: `${length}px`, 
      height: '40px',       
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%', 
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' 
    }
  }

  // Generate CSS to stretch a LADDER
  // Ladders connect Start Bottom and End Top
  const getLadderStyle = (startPos, endPos) => {
    const start = getCenter(startPos)
    const end = getCenter(endPos)

    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    
   
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90

    return {
      position: 'absolute',
      left: start.x,
      top: start.y,
      width: '30px',        
      height: `${length}px`, 
      transform: `rotate(${angle}deg)`,
      transformOrigin: '50% 0%', 
      transformOrigin: '0 0', 
      marginLeft: '-15px',
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
    }
  }

  // Player pixel coordinates
  const playerCoords = getCenter(playerPos)

  return (
    <div style={{
      position: 'relative',
      width: boardSize,
      height: boardSize,
      margin: 'auto',
      background: '#f4e7d5', 
      border: '8px solid #5d4037',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      borderRadius: '4px'
    }}>

      {/* The Grid Numbers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${N}, 1fr)`,
        gridTemplateRows: `repeat(${N}, 1fr)`,
        height: '100%'
      }}>
        {Array.from({ length: N * N }).map((_, i) => {
          const row = Math.floor(i / N)
          const col = i % N
          const actualRow = N - 1 - row
          const isEvenRow = actualRow % 2 === 0
          const number = actualRow * N + (isEvenRow ? col : N - 1 - col) + 1
          const isBlack = (row + col) % 2 === 1

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isBlack ? 'rgba(230, 185, 138, 0.6)' : 'rgba(255, 243, 224, 0.6)',
              color: '#3e2723', fontWeight: 'bold', fontSize: '0.9rem',
              border: '1px solid rgba(93, 64, 55, 0.1)'
            }}>
              {number}
            </div>
          )
        })}
      </div>

      {/* Render Ladders (Vertical Stretch) */}
      {ladders.map((l, i) => (
        <img
          key={`ladder-${i}`}
          src="/ladder.png"
          alt="Ladder"
          style={{
            ...getLadderStyle(l.start, l.end),
            objectFit: 'fill' 
          }}
        />
      ))}

      {/* Render Snakes Horizontal Stretch */}
      {snakes.map((s, i) => (
        <img
          key={`snake-${i}`}
          src="/snake.png"
          alt="Snake"
          style={{
            ...getSnakeStyle(s.head, s.tail),
            objectFit: 'contain' 
          }}
        />
      ))}

      {/* Player Piece */}
      <motion.div
        animate={{ left: playerCoords.x - 15, top: playerCoords.y - 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: 'absolute',
          width: '30px', height: '30px',
          background: 'radial-gradient(circle at 10px 10px, #2980b9, #2c3e50)',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          zIndex: 100
        }}
      />
    </div>
  )
}