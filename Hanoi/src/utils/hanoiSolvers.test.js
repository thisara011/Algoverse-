// src/utils/hanoiSolvers.test.js

import { jest, describe, it, expect } from '@jest/globals';

// We need to mock Supabase for tests
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        error: null
      }))
    }))
  }
}));

// Import the functions to test
import { 
  solve3PegRecursive, 
  solve3PegIterative,
  getFrameStewartMoves,
  getOptimalMoves
} from './hanoiSolvers';

describe('Tower of Hanoi Solvers', () => {

  // --- 3-Peg Algorithms ---
  
  describe('solve3PegRecursive', () => {
    it('should solve N=1', () => {
      const moves = solve3PegRecursive(1, 'A', 'D', 'B');
      expect(moves.length).toBe(1);
      expect(moves).toEqual([{ disk: 1, from: 'A', to: 'D' }]);
    });

    it('should solve N=3', () => {
      const moves = solve3PegRecursive(3, 'A', 'D', 'B');
      expect(moves.length).toBe(7); // 2^3 - 1
      expect(moves[0]).toEqual({ disk: 1, from: 'A', to: 'D' });
      expect(moves[1]).toEqual({ disk: 2, from: 'A', to: 'B' });
      expect(moves[6]).toEqual({ disk: 1, from: 'B', to: 'D' });
    });
  });

  describe('solve3PegIterative', () => {
    it('should solve N=3 and match recursive count', () => {
      const recursiveMoves = solve3PegRecursive(3, 'A', 'D', 'B');
      const iterativeMoves = solve3PegIterative(3, 'A', 'D', 'B');
      expect(iterativeMoves.length).toBe(recursiveMoves.length);
      expect(iterativeMoves.length).toBe(7);
    });
    
    it('should solve N=10 and match count', () => {
      const n = 10;
      const expectedMoves = 2 ** n - 1;
      // We only test iterative for N=10 as it's faster
      const iterativeMoves = solve3PegIterative(n, 'A', 'D', 'B');
      expect(iterativeMoves.length).toBe(expectedMoves);
    });
  });

  // --- 4-Peg Algorithms ---

  describe('getFrameStewartMoves (4 Pegs)', () => {
    it('should solve N=1, M=4', () => {
      expect(getFrameStewartMoves(1, 4)).toBe(1);
    });
    
    it('should solve N=5, M=4', () => {
      expect(getFrameStewartMoves(5, 4)).toBe(13);
    });

    it('should solve N=10, M=4', () => {
      expect(getFrameStewartMoves(10, 4)).toBe(49);
    });
  });

  // --- Optimal Move Quiz Calculator ---

  describe('getOptimalMoves', () => {
    it('should get correct moves for 3 pegs', () => {
      expect(getOptimalMoves(5, 3)).toBe(31); // 2^5 - 1
      expect(getOptimalMoves(10, 3)).toBe(1023); // 2^10 - 1
    });

    it('should get correct moves for 4 pegs', () => {
      expect(getOptimalMoves(5, 4)).toBe(13); // Frame-Stewart
      expect(getOptimalMoves(10, 4)).toBe(49); // Frame-Stewart
    });
  });

});