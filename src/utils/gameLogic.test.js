import { generateBoard, minThrowsBFS, minThrowsDP } from './gameLogic';

describe('Snake and Ladder Game Logic', () => {

  // Test 1: Check if the Board generates correctly
  test('generateBoard creates a valid board with snakes and ladders', () => {
    const N = 10; // 10x10 board
    const { total, snakes, ladders } = generateBoard(N);

    // Board size should be 10*10 = 100
    expect(total).toBe(100);
    
    // There should be N-2 snakes and ladders (10-2 = 8)
    expect(snakes.length).toBe(8);
    expect(ladders.length).toBe(8);
  });

  // Test 2: Check BFS Algorithm (The "Shortest Path" solver)
  test('BFS calculates correct minimum throws for a simple case', () => {
    const total = 20;
    // Ladder from 2 to 15 implies: 
    // Roll 1 -> Land on 2 -> Climb to 15. 
    // Roll 5 -> Land on 20 (Finish).
    // Total moves needed = 2
    const ladders = [{ start: 2, end: 15 }];
    const snakes = [];
    
    const result = minThrowsBFS(total, ladders, snakes);
    expect(result.throws).toBe(2);
  });

  // Test 3: Check Performance Tracking
  test('Algorithms should record execution time', () => {
    const { total, snakes, ladders } = generateBoard(8);
    
    const bfs = minThrowsBFS(total, ladders, snakes);
    const dp = minThrowsDP(total, ladders, snakes);

    // Time should be a number greater than or equal to 0
    expect(bfs.time).toBeGreaterThanOrEqual(0);
    expect(dp.time).toBeGreaterThanOrEqual(0);
  });

});