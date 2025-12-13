import { motion } from 'framer-motion';

export default function PlayerPiece({ position, cellMap }) {
  const { row, col } = cellMap[position];
  return (
    <motion.div
      animate={{ x: col * 50, y: row * 50 }} 
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="player-piece" 
    />
  );
}