import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient.js';
import { runAndLogSolvers, getOptimalMoves } from '../utils/hanoiSolvers.js';

// --- Utility Functions ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pegNames = ['A', 'B', 'C', 'D'];

// --- Helper Components ---

// Renders a single disk
const Disk = ({ disk, color }) => {
  const width = 40 + disk * 18; 
  return (
    <div
      className="h-7 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-black/10 relative overflow-hidden transition-all duration-300"
      style={{ width: `${width}px`, backgroundColor: color }}
    >
      {/* Glossy highlight effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20"></div>
    </div>
  );
};

// Renders a single peg
const Peg = ({ name, disks, onPegClick, isSelected }) => {
  // Disk colors
  const colors = [
    '#f87171', // Red
    '#fb923c', // Orange
    '#fbbf24', // Amber
    '#a3e635', // Lime
    '#34d399', // Emerald
    '#22d3ee', // Cyan
    '#60a5fa', // Blue
    '#818cf8', // Indigo
    '#c084fc', // Violet
    '#f472b6'  // Pink
  ];

  return (
    <div className="group flex flex-col items-center justify-end w-32 sm:w-40 h-80 transition-transform duration-200">
      {/* Peg Interaction Area */}
      <div 
        className={`relative flex flex-col-reverse items-center justify-start w-full h-full cursor-pointer transition-all duration-300 rounded-xl p-2
          ${isSelected ? 'bg-indigo-50/50 scale-105' : 'hover:bg-gray-50/50'}
        `}
        onClick={() => onPegClick && onPegClick(name)}
      >
        {/* The Pole */}
        <div className={`absolute bottom-0 w-4 h-[90%] rounded-t-lg transition-colors duration-300 shadow-inner
          ${isSelected ? 'bg-indigo-300' : 'bg-amber-800/80'}
        `}></div>

        {/* The Disks */}
        <div className="z-10 flex flex-col-reverse items-center gap-[2px] mb-1">
          {disks.map((disk) => (
            <Disk key={disk} disk={disk} color={colors[disk - 1]} />
          ))}
        </div>
      </div>

      {/* Peg Base */}
      <div className={`w-28 sm:w-32 h-4 rounded-full shadow-md mt-1 transition-colors duration-300
         ${isSelected ? 'bg-indigo-400' : 'bg-amber-900'}
      `}></div>
      
      {/* Label */}
      <span className={`mt-3 text-2xl font-black transition-colors duration-300
        ${isSelected ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-gray-600'}
      `}>{name}</span>
    </div>
  );
};

// --- Game Rules Modal ---
const GameRulesModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
        <h2 className="text-3xl font-extrabold flex items-center gap-3"><span>📜</span> How to Play</h2>
        <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-8 overflow-y-auto bg-slate-50">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 3-Peg Instructions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">🧠</div> 3-Peg Classic
            </h3>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <strong className="text-green-700 block mb-1">🎯 Objective</strong>
                Move all disks from <span className="font-semibold">Source (A)</span> to <span className="font-semibold">Dest (C)</span>.
              </div>
              <ul className="space-y-2 marker:text-green-500 list-disc pl-5">
                <li>Only one disk can be moved at a time.</li>
                <li>A larger disk cannot be placed on a smaller disk.</li>
                <li>Use <strong>Aux (B)</strong> as temporary storage.</li>
              </ul>
            </div>
          </div>
          {/* 4-Peg Instructions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">🚀</div> 4-Peg Reve's Puzzle
            </h3>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <strong className="text-blue-700 block mb-1">🎯 Objective</strong>
                Move all disks from <span className="font-semibold">Source (A)</span> to <span className="font-semibold">Dest (D)</span>.
              </div>
              <ul className="space-y-2 marker:text-blue-500 list-disc pl-5">
                <li>Same rules apply (one at a time, size order).</li>
                <li>You have <strong>TWO</strong> auxiliary pegs (B & C).</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><span>🎮</span> Controls</h4>
          <p className="text-indigo-800 text-sm">
            <strong>Tap/Click</strong> a peg to pick up the top disk and another to drop it. 
            <strong>OR</strong> use the Manual Move controls to select Source and Destination from the dropdowns.
          </p>
        </div>
        <div className="mt-8 text-center">
          <button onClick={onClose} className="px-12 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">Let's Play!</button>
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
          duration_seconds: timeElapsed
        });

      if (error) throw error;
      
    } catch (error) {
      console.error("Error saving game result:", error.message);
      alert("Could not save your score. Check the console.");
    }
  };

  // --- Render Components ---

  const renderSetup = () => (
    <div className="text-center w-full max-w-2xl mx-auto">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Tower of Hanoi
        </h2>
        <div className="mb-8">
          <p className="text-gray-500 uppercase tracking-wide text-xs font-bold mb-2">Current Challenge</p>
          <div className="text-6xl font-black text-slate-800">{n} <span className="text-2xl font-medium text-gray-400">Disks</span></div>
        </div>
        <p className="text-lg text-gray-600 mb-6">Choose your difficulty:</p>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <button onClick={() => selectPegs(3)} className="group relative px-8 py-6 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
            <span className="text-2xl font-bold block mb-1">3 Pegs</span>
            <span className="text-green-100 text-sm">Classic Mode</span>
          </button>
          <button onClick={() => selectPegs(4)} className="group relative px-8 py-6 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
            <span className="text-2xl font-bold block mb-1">4 Pegs</span>
            <span className="text-blue-100 text-sm">Reve's Puzzle</span>
          </button>
        </div>
        <button onClick={() => setShowRules(true)} className="text-gray-400 hover:text-indigo-500 font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How to Play?
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Pre-Game Quiz</h2>
          <p className="text-gray-500 mt-2">For <strong className="text-indigo-600">{n} disks</strong> and <strong className="text-indigo-600">{m} pegs</strong>...</p>
        </div>
        <form onSubmit={startGame} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Player Name</label>
            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="Enter your name" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">What is the optimal number of moves?</label>
            <input type="number" value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="Your guess..." required />
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transform active:scale-95 transition-all">Start Game</button>
            <button type="button" onClick={() => setShowRules(true)} className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Need a hint? Check Rules</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center h-full max-w-7xl mx-auto">
      
      {/* LEFT: Game Board */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Stats Bar */}
        <div className="w-full max-w-2xl relative flex justify-center items-center mb-6">
          <div className="flex items-center gap-8 bg-white px-10 py-4 rounded-full shadow-xl shadow-indigo-100/50 border border-indigo-50">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moves</span>
              <span className="text-3xl font-black text-indigo-600 tabular-nums">{moveCount}</span>
            </div>
            <div className="w-px h-10 bg-gray-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target</span>
              <span className="text-3xl font-black text-emerald-500 tabular-nums">{optimalMoves}</span>
            </div>
            <div className="w-px h-10 bg-gray-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
              <span className="text-3xl font-black text-blue-500 tabular-nums">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <button onClick={() => setShowRules(true)} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-2xl shadow-md border border-gray-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        </div>
        
        {/* Game Area */}
        <div className="relative w-full flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 rounded-full blur-3xl -z-10"></div>
          <div className="flex justify-center items-end gap-4 sm:gap-12 p-8 sm:p-12 bg-white/60 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/60 min-h-[400px]">
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
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-50">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎮</span> Manual Move
          </h3>
          <form onSubmit={handleManualMove} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">From</label>
                <select 
                  value={manualSource} 
                  onChange={(e) => setManualSource(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {pegNames.slice(0, m).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-2 text-gray-300">→</div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">To</label>
                <select 
                  value={manualDest} 
                  onChange={(e) => setManualDest(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {pegNames.slice(0, m).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md">
              Move Disk
            </button>
          </form>
        </div>

        {/* Move History Log */}
        {/* CHANGED: Removed fixed height (h-[400px]) and scroll (overflow-y-auto). Added natural height behavior. Reversed list order. */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-700">Move Sequence</h3>
          </div>
          <div className="flex-1 p-4 space-y-3">
            {moveHistory.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-4">Moves will appear here...</p>
            ) : (
              // NOTE: Reversing array here so newest moves appear at the TOP
              [...moveHistory].reverse().map((move) => (
                <div key={move.moveNum} className="flex items-center gap-3 text-sm bg-white border border-gray-100 p-2 rounded-lg shadow-sm">
                  <span className="font-bold text-gray-400 w-6">#{move.moveNum}</span>
                  <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded text-indigo-700 font-bold border border-indigo-100">
                    <span>Disk {move.disk}</span>
                  </div>
                  <span className="text-gray-400">from</span>
                  <span className="font-bold text-gray-700 bg-gray-100 w-6 h-6 flex items-center justify-center rounded">{move.from}</span>
                  <span className="text-gray-300">→</span>
                  <span className="font-bold text-gray-700 bg-gray-100 w-6 h-6 flex items-center justify-center rounded">{move.to}</span>
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
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-black text-gray-800 mb-2">Victory!</h2>
          <p className="text-gray-500 mb-8">Great job, <span className="font-bold text-indigo-600">{playerName}</span>!</p>
          <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100">
            <div className="grid grid-cols-3 gap-4">
              <div><span className="block text-xs font-bold text-emerald-600 uppercase">Moves</span><span className="block text-3xl font-black text-emerald-800">{moveCount}</span></div>
              <div><span className="block text-xs font-bold text-emerald-600 uppercase">Optimal</span><span className="block text-3xl font-black text-emerald-800">{optimalMoves}</span></div>
              <div><span className="block text-xs font-bold text-emerald-600 uppercase">Time</span><span className="block text-3xl font-black text-emerald-800">{formatTime(timeElapsed)}</span></div>
            </div>
          </div>
          <button onClick={startNewRound} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black hover:scale-[1.02] transition-all shadow-xl">Play Again</button>
        </div>
      </div>
      
      {/* Show history even after winning */}
      <div className="w-full lg:w-80 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-emerald-50">
          <h3 className="text-lg font-bold text-emerald-800">Your Full Sequence</h3>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...moveHistory].reverse().map((move) => (
            <div key={move.moveNum} className="flex items-center gap-3 text-sm bg-white border border-gray-100 p-2 rounded-lg shadow-sm">
              <span className="font-bold text-gray-400 w-6">#{move.moveNum}</span>
              <span className="font-bold text-gray-700">Disk {move.disk}: {move.from} → {move.to}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    // Fixed UI layout: items-start + pt-12 to prevent jumping
    <div className="w-full min-h-screen bg-slate-50 flex items-start justify-center p-4 pt-12 font-sans text-slate-800">
      {showRules && <GameRulesModal onClose={() => setShowRules(false)} />}
      <div className="w-full max-w-7xl animate-fade-in">
        {gameState === 'setup' && renderSetup()}
        {gameState === 'quiz' && renderQuiz()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'won' && renderWon()}
      </div>
    </div>
  );
};

export default TowerOfHanoiGame;