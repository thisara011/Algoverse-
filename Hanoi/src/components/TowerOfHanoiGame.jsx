import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { getOptimalMoves, runAndLogSolvers } from '../utils/hanoiSolvers.js';

// --- Utility Functions ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pegNames = ['A', 'B', 'C', 'D'];

// --- Helper Components ---

// Renders a single disk
const Disk = ({ disk, color }) => {
  const width = 40 + disk * 18;
  return (
    <div
      className="h-7 rounded-lg border-2 relative overflow-hidden transition-all duration-300 shadow-lg"
      style={{
        width: `${width}px`,
        backgroundColor: color,
        boxShadow: `0 0 15px ${color}, inset 0 0 10px rgba(255,255,255,0.3)`,
        borderColor: 'rgba(255, 255, 255, 0.6)'
      }}
    >
      {/* Neon glow highlight effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/40"></div>
      <div className="absolute inset-0 animate-pulse opacity-30" style={{ backgroundColor: color }}></div>
    </div>
  );
};

// Renders a single peg
const Peg = ({ name, disks, onPegClick, isSelected }) => {
  // Cyberpunk neon colors
  const colors = [
    '#FF006E', // Hot Pink
    '#FB5607', // Orange
    '#FFBE0B', // Yellow
    '#8338EC', // Purple
    '#3A86FF', // Blue
    '#06FFA5', // Neon Green
    '#FF006E', // Hot Pink
    '#FB5607', // Orange
    '#FFBE0B', // Yellow
    '#8338EC'  // Purple
  ];

  return (
    <div className="group flex flex-col items-center justify-end w-32 sm:w-40 h-80 transition-transform duration-200">
      {/* Peg Interaction Area */}
      <div
        className={`relative flex flex-col-reverse items-center justify-start w-full h-full cursor-pointer transition-all duration-300 rounded-xl p-2 backdrop-blur-sm
          ${isSelected ? 'bg-cyan-500/20 scale-105 border border-cyan-400/50' : 'hover:bg-purple-500/10 border border-transparent'}
        `}
        onClick={() => onPegClick && onPegClick(name)}
      >
        {/* The Pole - Neon Glow */}
        <div
          className={`absolute bottom-0 w-4 h-[90%] rounded-t-lg transition-all duration-300
            ${isSelected ? 'bg-cyan-400 shadow-[0_0_20px_rgba(0,255,221,0.8)]' : 'bg-purple-600/80 shadow-[0_0_15px_rgba(139,92,246,0.6)]'}
          `}
        ></div>

        {/* The Disks */}
        <div className="z-10 flex flex-col-reverse items-center gap-[2px] mb-1">
          {disks.map((disk) => (
            <Disk key={disk} disk={disk} color={colors[disk - 1]} />
          ))}
        </div>
      </div>

      {/* Peg Base */}
      <div
        className={`w-28 sm:w-32 h-4 rounded-full mt-1 transition-all duration-300
           ${isSelected ? 'bg-cyan-400 shadow-[0_0_15px_rgba(0,255,221,0.8)]' : 'bg-purple-600/70 shadow-[0_0_10px_rgba(139,92,246,0.5)]'}
        `}
      ></div>

      {/* Label */}
      <span
        className={`mt-3 text-2xl font-black transition-all duration-300 tracking-widest
          ${isSelected ? 'text-cyan-400 scale-110 drop-shadow-[0_0_10px_rgba(0,255,221,0.8)]' : 'text-purple-400 group-hover:text-cyan-300 drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]'}
        `}
      >{name}</span>
    </div>
  );
};

// --- Game Rules Modal ---
const GameRulesModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-cyan-500/30">
      <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,.05)_2px,rgba(255,255,255,.05)_4px)]"></div>
        <h2 className="text-3xl font-extrabold flex items-center gap-3 relative z-10 drop-shadow-[0_0_10px_rgba(0,255,221,0.8)]"><span>📜</span> GAME RULES</h2>
        <button onClick={onClose} className="p-2 bg-cyan-400/20 hover:bg-cyan-400/40 rounded-full transition-all border border-cyan-400/50 relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-8 overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 3-Peg Instructions */}
          <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,255,221,0.5)]">
              <div className="bg-cyan-500/30 p-2 rounded-lg text-cyan-400 border border-cyan-400/50">🧠</div> 3-PEG CLASSIC
            </h3>
            <div className="space-y-4 text-cyan-100/80 text-sm leading-relaxed">
              <div className="bg-cyan-900/30 p-3 rounded-lg border border-cyan-500/30">
                <strong className="text-cyan-400 block mb-1 drop-shadow-[0_0_5px_rgba(0,255,221,0.6)]">🎯 OBJECTIVE</strong>
                Move all disks from <span className="font-semibold text-cyan-300">Source (A)</span> to <span className="font-semibold text-cyan-300">Dest (C)</span>.
              </div>
              <ul className="space-y-2 marker:text-cyan-400 list-disc pl-5">
                <li>Only one disk can be moved at a time.</li>
                <li>A larger disk cannot be placed on a smaller disk.</li>
                <li>Use <strong>Aux (B)</strong> as temporary storage.</li>
              </ul>
            </div>
          </div>
          {/* 4-Peg Instructions */}
          <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,0,110,0.5)]">
              <div className="bg-pink-500/30 p-2 rounded-lg text-pink-400 border border-pink-400/50">🚀</div> 4-PEG REVE'S PUZZLE
            </h3>
            <div className="space-y-4 text-cyan-100/80 text-sm leading-relaxed">
              <div className="bg-pink-900/30 p-3 rounded-lg border border-pink-500/30">
                <strong className="text-pink-400 block mb-1 drop-shadow-[0_0_5px_rgba(255,0,110,0.6)]">🎯 OBJECTIVE</strong>
                Move all disks from <span className="font-semibold text-pink-300">Source (A)</span> to <span className="font-semibold text-pink-300">Dest (D)</span>.
              </div>
              <ul className="space-y-2 marker:text-pink-400 list-disc pl-5">
                <li>Same rules apply (one at a time, size order).</li>
                <li>You have <strong>TWO</strong> auxiliary pegs (B & C).</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-6 rounded-2xl border border-cyan-400/30 backdrop-blur-sm">
          <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(0,255,221,0.5)]"><span>🎮</span> CONTROLS</h4>
          <p className="text-cyan-100/80 text-sm">
            <strong>Tap/Click</strong> a peg to pick up the top disk and another to drop it.
            <strong className="text-cyan-300"> OR</strong> use the Manual Move controls to select Source and Destination from the dropdowns.
          </p>
        </div>
        <div className="mt-8 text-center">
          <button onClick={onClose} className="px-12 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-900 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,221,0.8)] hover:scale-105 transition-all border border-cyan-400/50 drop-shadow-[0_0_10px_rgba(0,255,221,0.5)]">LAUNCH GAME</button>
        </div>
      </div>
    </div>
  </div>
);


// --- Main Game Component ---

const TowerOfHanoiGame = () => {
  const [gameState, setGameState] = useState('setup'); // setup, quiz, playing, won
  const [n, setN] = useState(0); // Number of disks
  const [m, setM] = useState(0); // Number of pegs
  const [showRules, setShowRules] = useState(false);

  // Game state
  const [pegs, setPegs] = useState({});
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]); // Stores { moveNum, disk, from, to }

  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Manual Move Form State
  const [manualSource, setManualSource] = useState('A');
  const [manualDest, setManualDest] = useState('B');

  // User info
  const [playerName, setPlayerName] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [optimalMoves, setOptimalMoves] = useState(0);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newN = getRandomInt(5, 10);
    setN(newN);
    setM(0);
    setGameState('setup');
    setPlayerName('');
    setQuizAnswer('');
    setMoveCount(0);
    setMoveHistory([]);
    setSelectedPeg(null);
    setShowRules(false);
    setTimeElapsed(0);
  };

  const selectPegs = (numPegs) => {
    setM(numPegs);
    setGameState('quiz');

    const destPeg = pegNames[numPegs - 1];
    const auxPegs = pegNames.slice(1, numPegs - 1);

    const optimal = getOptimalMoves(n, numPegs);
    setOptimalMoves(optimal);

    runAndLogSolvers(n, numPegs, 'A', destPeg, ...auxPegs).catch(err => {
      console.error("Failed to log algorithms:", err);
    });
  };

  const startGame = (e) => {
    e.preventDefault();
    if (!playerName) {
      alert("Please enter your name.");
      return;
    }

    // Setup initial pegs
    const initialPegs = {};
    for (let i = 0; i < m; i++) {
      initialPegs[pegNames[i]] = [];
    }
    initialPegs['A'] = Array.from({ length: n }, (_, i) => n - i);

    setPegs(initialPegs);
    setGameState('playing');
  };

  // --- Core Game Logic (Used by Click & Manual) ---

  const executeMove = (fromPegName, toPegName) => {
    try {
      const fromPeg = pegs[fromPegName];
      const toPeg = pegs[toPegName];

      if (!fromPeg || fromPeg.length === 0) {
        throw new Error(`Invalid Move: Source peg ${fromPegName} is empty.`);
      }

      const diskToMove = fromPeg[fromPeg.length - 1];
      const topDiskOnToPeg = toPeg.length > 0 ? toPeg[toPeg.length - 1] : Infinity;

      if (diskToMove > topDiskOnToPeg) {
        throw new Error(`Invalid Move: Cannot place disk ${diskToMove} on smaller disk ${topDiskOnToPeg}.`);
      }

      // Perform Move
      const newPegs = { ...pegs };
      const disk = newPegs[fromPegName].pop();
      newPegs[toPegName].push(disk);

      setPegs(newPegs);
      setMoveCount(prev => prev + 1);

      // Update History
      const newMove = {
        moveNum: moveCount + 1,
        disk: disk,
        from: fromPegName,
        to: toPegName
      };
      setMoveHistory(prev => [...prev, newMove]);

      // Check Win
      const destPeg = pegNames[m - 1];
      if (newPegs[destPeg]?.length === n) {
        handleWin();
      }
      return true; // Success
    } catch (error) {
      alert(error.message);
      return false; // Failed
    }
  };

  // --- Handlers ---

  const handlePegClick = (pegName) => {
    if (gameState !== 'playing') return;

    if (!selectedPeg) {
      // Select Source
      if (pegs[pegName].length > 0) {
        setSelectedPeg(pegName);
        // Auto-set the manual dropdowns to match click for better UX
        setManualSource(pegName);
      }
    } else {
      // Select Destination
      if (selectedPeg === pegName) {
        setSelectedPeg(null); // Deselect if clicking same peg
      } else {
        const success = executeMove(selectedPeg, pegName);
        if (success) {
          setSelectedPeg(null);
          // Auto-set dropdowns for next logical move? Maybe not.
        } else {
          setSelectedPeg(null); // Reset on error
        }
      }
    }
  };

  const handleManualMove = (e) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    if (manualSource === manualDest) {
      alert("Source and Destination cannot be the same.");
      return;
    }
    executeMove(manualSource, manualDest);
  };

  const handleWin = async () => {
    setGameState('won');
    const isQuizCorrect = parseInt(quizAnswer) === optimalMoves;

    try {
      const { error } = await supabase
        .from('game_players')
        .insert({
          player_name: playerName,
          disks: n,
          pegs: m,
          user_moves: moveCount,
          quiz_answer: parseInt(quizAnswer) || 0,
          is_quiz_correct: isQuizCorrect,
          duration_seconds: timeElapsed,
          game_status: 'completed'
        });

      if (error) throw error;

      // Update player stats in main hub
      const { updatePlayerStats } = await import('../utils/updateStats');
      updatePlayerStats(playerName, true, timeElapsed * 1000); // Convert to milliseconds

    } catch (error) {
      console.error("Error saving game result:", error.message);
      alert("Could not save your score. Check the console.");
    }
  };

  const handleGiveUp = async () => {
    setGameState('failed');

    try {
      const { error } = await supabase
        .from('game_players')
        .insert({
          player_name: playerName,
          disks: n,
          pegs: m,
          user_moves: moveCount,
          quiz_answer: parseInt(quizAnswer) || 0,
          is_quiz_correct: false,
          duration_seconds: timeElapsed,
          game_status: 'failed'
        });

      if (error) throw error;

      // Update player stats in main hub (lost)
      const { updatePlayerStats } = await import('../utils/updateStats');
      updatePlayerStats(playerName, false, timeElapsed * 1000); // Convert to milliseconds

    } catch (error) {
      console.error("Error saving failed game result:", error.message);
      alert("Could not save your attempt. Check the console.");
    }
  };

  // --- Render Components ---

  const renderSetup = () => (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 p-10 rounded-3xl shadow-2xl border border-cyan-400/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,221,.1)_2px,rgba(0,255,221,.1)_4px)]"></div>
        <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)] relative z-10">
          ⚔️ TOWER OF HANOI
        </h2>
        <div className="mb-8 relative z-10">
          <p className="text-cyan-400/70 uppercase tracking-widest text-xs font-bold mb-2 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">Current Challenge</p>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 drop-shadow-[0_0_10px_rgba(0,255,221,0.8)]">{n} <span className="text-2xl font-medium text-purple-400">DISKS</span></div>
        </div>
        <p className="text-lg text-cyan-100/80 mb-6 relative z-10">SELECT YOUR DIFFICULTY:</p>
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          <button onClick={() => selectPegs(3)} className="group relative px-8 py-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-slate-900 rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,221,0.8)] hover:-translate-y-1 transition-all font-bold border border-cyan-400/50 hover:border-cyan-300">
            <span className="text-2xl font-black block mb-1">3 PEGS</span>
            <span className="text-slate-800 text-sm font-semibold">CLASSIC MODE</span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-cyan-400/20 to-transparent"></div>
          </button>
          <button onClick={() => selectPegs(4)} className="group relative px-8 py-6 bg-gradient-to-br from-purple-600 to-purple-700 text-slate-900 rounded-2xl hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] hover:-translate-y-1 transition-all font-bold border border-purple-400/50 hover:border-purple-300">
            <span className="text-2xl font-black block mb-1">4 PEGS</span>
            <span className="text-slate-200 text-sm font-semibold">REVE'S PUZZLE</span>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-purple-400/20 to-transparent"></div>
          </button>
        </div>
        <button onClick={() => setShowRules(true)} className="text-cyan-400/70 hover:text-cyan-300 font-medium flex items-center justify-center gap-2 mx-auto transition-colors drop-shadow-[0_0_5px_rgba(0,255,221,0.3)] relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          VIEW RULES
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 p-8 rounded-3xl shadow-2xl border border-cyan-400/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,221,.1)_2px,rgba(0,255,221,.1)_4px)]"></div>
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">PRE-GAME ASSESSMENT</h2>
          <p className="text-cyan-100/60 mt-2">For <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{n} disks</strong> and <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{m} pegs</strong>...</p>
        </div>
        <form onSubmit={startGame} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-cyan-400 uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">PILOT NAME</label>
            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-slate-800 transition-all text-cyan-100 placeholder:text-slate-500" placeholder="Enter your codename" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-cyan-400 uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">OPTIMAL MOVE COUNT</label>
            <input type="number" value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-cyan-400/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-slate-800 transition-all text-cyan-100 placeholder:text-slate-500" placeholder="Your prediction..." required />
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,255,221,0.8)] hover:scale-105 transform active:scale-95 transition-all border border-cyan-400/50 uppercase tracking-widest">INITIALIZE GAME</button>
            <button type="button" onClick={() => setShowRules(true)} className="text-sm text-cyan-400/60 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(0,255,221,0.3)]">Need help? Check RULES</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center h-full max-w-7xl mx-auto">

      {/* LEFT: Game Board */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Stats Bar - Sticky to stay below header */}
        <div className="w-full max-w-2xl relative flex justify-center items-center mb-6 z-10">
          <div className="flex items-center gap-8 bg-gradient-to-br from-slate-800 to-purple-900 px-10 py-4 rounded-full shadow-2xl shadow-cyan-500/30 border border-cyan-400/30 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-widest drop-shadow-[0_0_3px_rgba(0,255,221,0.3)]">Moves</span>
              <span className="text-3xl font-black text-cyan-400 tabular-nums drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">{moveCount}</span>
            </div>
            <div className="w-px h-10 bg-purple-600/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-pink-400/70 uppercase tracking-widest drop-shadow-[0_0_3px_rgba(255,0,110,0.3)]">Target</span>
              <span className="text-3xl font-black text-pink-400 tabular-nums drop-shadow-[0_0_10px_rgba(255,0,110,0.6)]">{optimalMoves}</span>
            </div>
            <div className="w-px h-10 bg-purple-600/50"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-purple-400/70 uppercase tracking-widest drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">Time</span>
              <span className="text-3xl font-black text-purple-400 tabular-nums drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button onClick={() => setShowRules(true)} className="p-3 bg-gradient-to-br from-slate-800 to-purple-900 hover:shadow-[0_0_20px_rgba(0,255,221,0.6)] text-cyan-400 hover:text-cyan-300 rounded-2xl border border-cyan-400/30 transition-all drop-shadow-[0_0_10px_rgba(0,255,221,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
            <button onClick={handleGiveUp} className="p-3 bg-gradient-to-br from-slate-800 to-purple-900 hover:shadow-[0_0_20px_rgba(255,0,110,0.6)] text-red-400 hover:text-red-300 rounded-2xl border border-red-400/30 transition-all drop-shadow-[0_0_10px_rgba(255,0,110,0.3)]" title="Give up and submit incomplete sequence">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative w-full flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="flex justify-center items-end gap-4 sm:gap-12 p-8 sm:p-12 bg-gradient-to-br from-slate-800/40 to-purple-900/40 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-cyan-400/20 min-h-[400px]">
            {Object.keys(pegs).map((pegName) => (
              <Peg
                key={pegName}
                name={pegName}
                disks={pegs[pegName]}
                onPegClick={handlePegClick}
                isSelected={selectedPeg === pegName}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Manual Controls & History */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* Manual Move Form */}
        <div className="bg-gradient-to-br from-slate-800 to-purple-900 p-6 rounded-3xl shadow-xl border border-cyan-400/30 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">
            <span>🎮</span> MANUAL MOVE
          </h3>
          <form onSubmit={handleManualMove} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-cyan-400/70 uppercase ml-1 drop-shadow-[0_0_3px_rgba(0,255,221,0.3)]">From</label>
                <select
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  className="w-full p-2 bg-slate-700/50 border border-cyan-400/40 rounded-xl font-bold text-cyan-100 focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur-sm"
                >
                  {pegNames.slice(0, m).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-2 text-purple-400 font-bold">→</div>
              <div className="flex-1">
                <label className="text-xs font-bold text-cyan-400/70 uppercase ml-1 drop-shadow-[0_0_3px_rgba(0,255,221,0.3)]">To</label>
                <select
                  value={manualDest}
                  onChange={(e) => setManualDest(e.target.value)}
                  className="w-full p-2 bg-slate-700/50 border border-cyan-400/40 rounded-xl font-bold text-cyan-100 focus:ring-2 focus:ring-cyan-400 outline-none backdrop-blur-sm"
                >
                  {pegNames.slice(0, m).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,255,221,0.8)] transition-all border border-cyan-400/50 uppercase tracking-widest text-sm">
              Execute Move
            </button>
          </form>
        </div>

        {/* Move History Log */}
        <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl shadow-xl border border-cyan-400/20 backdrop-blur-sm flex-1 flex flex-col">
          <div className="p-4 border-b border-purple-600/30 bg-gradient-to-r from-slate-800/50 to-purple-900/50">
            <h3 className="text-lg font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">MOVE SEQUENCE</h3>
          </div>
          <div className="flex-1 p-4 space-y-3">
            {moveHistory.length === 0 ? (
              <p className="text-center text-purple-400/60 italic mt-4">Awaiting your moves...</p>
            ) : (
              [...moveHistory].reverse().map((move) => (
                <div key={move.moveNum} className="flex items-center gap-3 text-sm bg-slate-700/50 border border-purple-600/30 p-2 rounded-lg shadow-sm backdrop-blur-sm">
                  <span className="font-bold text-purple-400/70 w-6 drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">#{move.moveNum}</span>
                  <div className="flex items-center gap-2 bg-cyan-900/50 px-2 py-1 rounded text-cyan-300 font-bold border border-cyan-400/30">
                    <span>Disk {move.disk}</span>
                  </div>
                  <span className="text-purple-400/60">from</span>
                  <span className="font-bold text-cyan-400 bg-slate-700/70 w-6 h-6 flex items-center justify-center rounded border border-cyan-400/30 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{move.from}</span>
                  <span className="text-purple-400/60">→</span>
                  <span className="font-bold text-cyan-400 bg-slate-700/70 w-6 h-6 flex items-center justify-center rounded border border-cyan-400/30 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{move.to}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWon = () => (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center max-w-6xl mx-auto">
      <div className="text-center w-full max-w-lg">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 p-10 rounded-3xl shadow-2xl border border-cyan-400/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 animate-pulse"></div>
          <div className="text-6xl mb-6 drop-shadow-[0_0_10px_rgba(0,255,221,0.8)]">🎉</div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-2 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">VICTORY!</h2>
          <p className="text-cyan-100/80 mb-8">Outstanding performance, <span className="font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{playerName}</span>!</p>
          <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-2xl p-6 mb-8 border border-cyan-400/30 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xs font-bold text-cyan-400/70 uppercase drop-shadow-[0_0_3px_rgba(0,255,221,0.3)]">Moves</span>
                <span className="block text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">{moveCount}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-pink-400/70 uppercase drop-shadow-[0_0_3px_rgba(255,0,110,0.3)]">Optimal</span>
                <span className="block text-3xl font-black text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,110,0.6)]">{optimalMoves}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-purple-400/70 uppercase drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">Time</span>
                <span className="block text-3xl font-black text-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          <button onClick={startNewRound} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 font-black rounded-xl hover:shadow-[0_0_30px_rgba(0,255,221,0.8)] hover:scale-105 transition-all shadow-xl border border-cyan-400/50 uppercase tracking-widest">NEW CHALLENGE</button>
        </div>
      </div>

      {/* Show history even after winning */}
      <div className="w-full lg:w-80 bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl shadow-xl border border-cyan-400/30 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-purple-600/30 bg-gradient-to-r from-slate-800/50 to-purple-900/50">
          <h3 className="text-lg font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">COMPLETE SEQUENCE</h3>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...moveHistory].reverse().map((move) => (
            <div key={move.moveNum} className="flex items-center gap-3 text-sm bg-slate-700/50 border border-purple-600/30 p-2 rounded-lg shadow-sm backdrop-blur-sm">
              <span className="font-bold text-purple-400/70 w-6 drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">#{move.moveNum}</span>
              <span className="font-bold text-cyan-300">Disk {move.disk}: {move.from} → {move.to}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFailed = () => (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center max-w-6xl mx-auto">
      <div className="text-center w-full max-w-lg">
        <div className="bg-gradient-to-br from-slate-900 to-purple-900 p-10 rounded-3xl shadow-2xl border border-red-400/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-pulse"></div>
          <div className="text-6xl mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">⚠️</div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">INCOMPLETE</h2>
          <p className="text-cyan-100/80 mb-8">Challenge submitted, <span className="font-bold text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,221,0.4)]">{playerName}</span>!</p>
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-6 mb-8 border border-red-400/30 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xs font-bold text-cyan-400/70 uppercase drop-shadow-[0_0_3px_rgba(0,255,221,0.3)]">Moves</span>
                <span className="block text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,221,0.6)]">{moveCount}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-pink-400/70 uppercase drop-shadow-[0_0_3px_rgba(255,0,110,0.3)]">Target</span>
                <span className="block text-3xl font-black text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,110,0.6)]">{optimalMoves}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-purple-400/70 uppercase drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">Time</span>
                <span className="block text-3xl font-black text-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8 backdrop-blur-sm">
            <p className="text-red-300 font-semibold">You were <span className="text-cyan-400">{optimalMoves - moveCount}</span> moves away from the optimal solution.</p>
          </div>
          <button onClick={startNewRound} className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-slate-900 font-black rounded-xl hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] hover:scale-105 transition-all shadow-xl border border-red-400/50 uppercase tracking-widest">TRY AGAIN</button>
        </div>
      </div>

      {/* Show incomplete sequence */}
      <div className="w-full lg:w-80 bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl shadow-xl border border-red-400/30 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-purple-600/30 bg-gradient-to-r from-slate-800/50 to-purple-900/50">
          <h3 className="text-lg font-bold text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">ATTEMPTED SEQUENCE</h3>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {moveHistory.length === 0 ? (
            <p className="text-center text-purple-400/60 italic mt-4">No moves recorded</p>
          ) : (
            [...moveHistory].reverse().map((move) => (
              <div key={move.moveNum} className="flex items-center gap-3 text-sm bg-slate-700/50 border border-red-600/30 p-2 rounded-lg shadow-sm backdrop-blur-sm">
                <span className="font-bold text-purple-400/70 w-6 drop-shadow-[0_0_3px_rgba(139,92,246,0.3)]">#{move.moveNum}</span>
                <span className="font-bold text-cyan-300">Disk {move.disk}: {move.from} → {move.to}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    // Fixed UI layout: items-start + pt-20 to account for iframe header
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-start justify-center p-4 pt-20 font-mono text-cyan-100 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,221,.1)_2px,rgba(0,255,221,.1)_4px)]"></div>
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(139,92,246,.1)_2px,rgba(139,92,246,.1)_4px)]"></div>

      {showRules && <GameRulesModal onClose={() => setShowRules(false)} />}
      <div className="w-full max-w-7xl animate-fade-in relative z-10">
        {gameState === 'setup' && renderSetup()}
        {gameState === 'quiz' && renderQuiz()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'won' && renderWon()}
        {gameState === 'failed' && renderFailed()}
      </div>
    </div>
  );
};

export default TowerOfHanoiGame;