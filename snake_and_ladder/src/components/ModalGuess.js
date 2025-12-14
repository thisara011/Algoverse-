import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function GuessModal({ actual, onGuess }) {
  const options = useMemo(() => {
    const validOptions = new Set([actual]);
    
    while (validOptions.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2; 
      const val = actual + offset;
      if (val > 0) validOptions.add(val);
    }
    
    return Array.from(validOptions).sort(() => Math.random() - 0.5);
  }, [actual]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
      }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        style={{
          background: '#3d2817', padding: '40px', borderRadius: '20px', textAlign: 'center', color: 'white',
          boxShadow: '0 0 30px gold', maxWidth: '90%'
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Guess Minimum Dice Throws!</h2>
        <div>
          {options.map((opt, index) => (
            <button
              key={`${opt}-${index}`} 
              onClick={() => onGuess(opt)}
              style={{
                margin: '10px', padding: '15px 30px', fontSize: '1.5rem',
                background: '#8d5524', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}