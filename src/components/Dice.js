import React from 'react'
import { motion } from 'framer-motion'

export default function Dice({ value, rolling, onRoll }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <motion.div
        animate={rolling ? { rotate: 360, scale: [1, 1.2, 1] } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '60px', height: '60px', background: 'white', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          fontSize: '2rem', fontWeight: 'bold', color: '#333', border: '2px solid #333'
        }}
      >
        {value}
      </motion.div>
      <button 
        onClick={onRoll} 
        disabled={rolling}
        style={{
          padding: '10px 20px', fontSize: '1.2rem', background: '#e67e22', 
          color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
          opacity: rolling ? 0.7 : 1
        }}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  )
}