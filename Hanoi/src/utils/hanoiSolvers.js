import { supabase } from '../supabaseClient.js';

/**
 * == 3-PEG ALGORITHMS ==
 */

export const solve3PegRecursive = (n, source, dest, aux) => {
  const moves = [];
  function recurse(n, source, dest, aux) {
    if (n === 1) {
      moves.push({ disk: n, from: source, to: dest });
    } else {
      recurse(n - 1, source, aux, dest);
      moves.push({ disk: n, from: source, to: dest });
      recurse(n - 1, aux, dest, source);
    }
  }
  recurse(n, source, dest, aux);
  return moves;
};

export const solve3PegIterative = (n, source, dest, aux) => {
  const moves = [];
  const totalMoves = 2 ** n - 1;
  const pegs = { [source]: [], [dest]: [], [aux]: [] };

  pegs[source] = Array.from({ length: n }, (_, i) => n - i);

  let s = source, d = dest, a = aux;
  if (n % 2 === 0) {
    [d, a] = [a, d];
  }

  for (let i = 1; i <= totalMoves; i++) {
    if (i % 3 === 1) { 
      makeValidMove(pegs, s, d, moves);
    } else if (i % 3 === 2) { 
      makeValidMove(pegs, s, a, moves);
    } else if (i % 3 === 0) { 
      makeValidMove(pegs, a, d, moves);
    }
  }
  return moves;
};

function makeValidMove(pegs, p1, p2, moves) {
  const peg1 = pegs[p1];
  const peg2 = pegs[p2];
  const disk1 = peg1.length > 0 ? peg1[peg1.length - 1] : Infinity;
  const disk2 = peg2.length > 0 ? peg2[peg2.length - 1] : Infinity;

  if (disk1 < disk2) {
    const disk = peg1.pop();
    peg2.push(disk);
    moves.push({ disk, from: p1, to: p2 });
  } else {
    const disk = peg2.pop();
    peg1.push(disk);
    moves.push({ disk, from: p2, to: p1 });
  }
}

/**
 * == 4-PEG ALGORITHMS ==
 */

const fsMemo = new Map();

export const getFrameStewartMoves = (n, m) => {
  if (n === 0) return 0;
  if (n === 1) return 1; // <--- FIX: Added base case for 1 disk
  if (m < 3) return Infinity; 
  if (m === 3) return 2 ** n - 1;

  const key = `${n},${m}`;
  if (fsMemo.has(key)) return fsMemo.get(key);

  let minMoves = Infinity;
  for (let k = 1; k < n; k++) {
    const moves = 2 * getFrameStewartMoves(k, m) + getFrameStewartMoves(n - k, m - 1);
    minMoves = Math.min(minMoves, moves);
  }
  
  fsMemo.set(key, minMoves);
  return minMoves;
};

export const solve4PegNaive = (n, source, dest, aux1, aux2) => {
  const moves = [];
  function recurse(n, source, dest, aux1, aux2) {
    if (n === 0) return;
    if (n === 1) {
      moves.push({ disk: n, from: source, to: dest });
      return;
    }
    
    recurse(n - 1, source, aux1, dest, aux2);
    moves.push({ disk: n, from: source, to: dest });
    recurse(n - 1, aux1, dest, source, aux2); 
  }
  recurse(n, source, dest, aux1, aux2);
  return moves;
}

/**
 * == WRAPPER ==
 */

export const runAndLogSolvers = async (n, m, source, dest, ...aux) => {
  const results = {};
  fsMemo.clear();

  try {
    if (m === 3) {
      results.recursive = timeAlgorithm(solve3PegRecursive, n, source, dest, aux[0]);
      results.iterative = timeAlgorithm(solve3PegIterative, n, source, dest, aux[0]);
      
      await logToSupabase(n, m, '3-Peg Recursive', results.recursive);
      await logToSupabase(n, m, '3-Peg Iterative', results.iterative);
    } 
    else if (m === 4) {
      const fsStartTime = performance.now();
      const fsMoves = getFrameStewartMoves(n, 4);
      const fsEndTime = performance.now();
      results.frameStewart = { 
        moves: fsMoves, 
        time: fsEndTime - fsStartTime 
      };

      results.naive = timeAlgorithm(solve4PegNaive, n, source, dest, aux[0], aux[1]);

      await logToSupabase(n, m, '4-Peg Frame-Stewart', results.frameStewart);
      await logToSupabase(n, m, '4-Peg Naive', results.naive);
    }
    return results;

  } catch (error) {
    console.error("Error running/logging algorithms:", error);
  }
};

function timeAlgorithm(fn, ...args) {
  const startTime = performance.now();
  const movesArray = fn(...args);
  const endTime = performance.now();
  return {
    moves: movesArray.length,
    time: endTime - startTime,
  };
}

async function logToSupabase(n, m, name, result) {
  const { error } = await supabase.from('algorithm_logs').insert({
    disks: n,
    pegs: m,
    algorithm_name: name,
    optimal_moves: result.moves,
    execution_time_ms: result.time,
  });
  if (error) {
    console.error(`Error logging ${name} to Supabase:`, error.message);
  }
}

export const getOptimalMoves = (n, m) => {
  if (m === 3) {
    return 2 ** n - 1;
  }
  if (m === 4) {
    fsMemo.clear(); 
    return getFrameStewartMoves(n, 4);
  }
  return 0; 
};