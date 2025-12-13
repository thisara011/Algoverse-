/**
 * Eight Queens Puzzle Backend Server
 * Express API with Supabase Integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const QueenSolver = require('./queensolver');
const DatabaseManager = require('./database');

const app = express();
const db = new DatabaseManager();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Input validation middleware
const validateInput = (req, res, next) => {
  req.body.playerName = String(req.body.playerName || '').trim().slice(0, 100);
  req.body.board = String(req.body.board || '').trim();
  next();
};

app.use(validateInput);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Solve using Sequential algorithm
 * POST /solve/sequential
 */
app.post('/solve/sequential', async (req, res) => {
  try {
    const result = await QueenSolver.solveSequential();
    await db.saveSolutions(result.solutions, 'sequential', result.time);

    res.json({
      success: true,
      mode: 'sequential',
      count: result.count,
      timeMs: result.time.toFixed(2),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Solve using Threaded algorithm
 * POST /solve/threaded
 */
app.post('/solve/threaded', async (req, res) => {
  try {
    const result = await QueenSolver.solveThreaded(8);
    await db.saveSolutions(result.solutions, 'threaded', result.time);

    res.json({
      success: true,
      mode: 'threaded',
      count: result.count,
      timeMs: result.time.toFixed(2),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Submit player's answer
 * POST /submit
 * Body: { playerName: string, board: string }
 */
app.post('/submit', async (req, res) => {
  try {
    const { playerName, board } = req.body;

    if (!playerName || playerName.length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    if (!board || board.length === 0) {
      return res.status(400).json({ error: 'Board configuration is required' });
    }

    if (!QueenSolver.isValidSolution(board)) {
      return res.status(400).json({
        correct: false,
        error: 'Invalid board configuration'
      });
    }

    const result = await db.submitAnswer(playerName, board);

    // Check if all solutions found
    if (result.correct && !result.alreadyRecognized && result.remainingSolutions === 0) {
      await db.resetAllSolutions();
      result.message += ' All solutions found! Starting new round...';
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get all solutions
 * GET /solutions
 */
app.get('/solutions', async (req, res) => {
  try {
    const solutions = await db.getAllSolutions();
    res.json({ count: solutions.length, solutions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get game statistics
 * GET /stats
 */
app.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Eight Queens Backend running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /solve/sequential - Solve using sequential algorithm');
  console.log('  POST /solve/threaded - Solve using threaded algorithm');
  console.log('  POST /submit - Submit player answer');
  console.log('  GET /solutions - Get all solutions');
  console.log('  GET /stats - Get game statistics');
});

module.exports = app;
