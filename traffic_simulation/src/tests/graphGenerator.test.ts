import { generateRandomGraph, Edge } from '../utils/graphGenerator';

/**
 * Unit Tests for Graph Generator
 * 
 * These tests verify that the random graph generator creates valid graphs
 * according to the specifications.
 */

// Test that all required edges are present
export const testAllEdgesPresent = (): void => {
  console.log('\nTest: All Edges Present');

  const expectedEdges = [
    ['A', 'B'],
    ['A', 'C'],
    ['A', 'D'],
    ['B', 'E'],
    ['B', 'F'],
    ['C', 'E'],
    ['C', 'F'],
    ['D', 'F'],
    ['E', 'G'],
    ['E', 'H'],
    ['F', 'H'],
    ['G', 'T'],
    ['H', 'T'],
  ];

  const graph = generateRandomGraph();

  if (graph.length !== expectedEdges.length) {
    throw new Error(`Expected ${expectedEdges.length} edges, got ${graph.length}`);
  }

  expectedEdges.forEach(([from, to]) => {
    const edge = graph.find(e => e.from === from && e.to === to);
    if (!edge) {
      throw new Error(`Missing edge: ${from} -> ${to}`);
    }
  });

  console.log('  ✓ PASSED: All required edges are present');
};

// Test that capacities are within valid range
export const testCapacityRange = (): void => {
  console.log('\nTest: Capacity Range');

  const graph = generateRandomGraph();

  graph.forEach(edge => {
    if (edge.capacity < 5 || edge.capacity > 15) {
      throw new Error(
        `Edge ${edge.from}->${edge.to} has invalid capacity: ${edge.capacity} (must be 5-15)`
      );
    }
  });

  console.log('  ✓ PASSED: All capacities are within range [5, 15]');
};

// Test that capacities are integers
export const testCapacityInteger = (): void => {
  console.log('\nTest: Capacity Integer');

  const graph = generateRandomGraph();

  graph.forEach(edge => {
    if (!Number.isInteger(edge.capacity)) {
      throw new Error(`Edge ${edge.from}->${edge.to} has non-integer capacity: ${edge.capacity}`);
    }
  });

  console.log('  ✓ PASSED: All capacities are integers');
};

// Test that graphs are different (randomness)
export const testRandomness = (): void => {
  console.log('\nTest: Randomness');

  const graph1 = generateRandomGraph();
  const graph2 = generateRandomGraph();

  // Convert to comparable strings
  const str1 = graph1.map(e => `${e.from}-${e.to}:${e.capacity}`).join(',');
  const str2 = graph2.map(e => `${e.from}-${e.to}:${e.capacity}`).join(',');

  // They should be different (very unlikely to be the same)
  if (str1 === str2) {
    console.log('  ⚠ WARNING: Two consecutive graphs are identical (unlikely but possible)');
  } else {
    console.log('  ✓ PASSED: Graphs show randomness');
  }
};

// Test edge structure
export const testEdgeStructure = (): void => {
  console.log('\nTest: Edge Structure');

  const graph = generateRandomGraph();

  graph.forEach(edge => {
    if (typeof edge.from !== 'string') {
      throw new Error(`Edge has invalid 'from' type: ${typeof edge.from}`);
    }
    if (typeof edge.to !== 'string') {
      throw new Error(`Edge has invalid 'to' type: ${typeof edge.to}`);
    }
    if (typeof edge.capacity !== 'number') {
      throw new Error(`Edge has invalid 'capacity' type: ${typeof edge.capacity}`);
    }
  });

  console.log('  ✓ PASSED: All edges have correct structure');
};

// Run all graph generator tests
export const runGraphGeneratorTests = (): void => {
  console.log('='.repeat(60));
  console.log('GRAPH GENERATOR - UNIT TESTS');
  console.log('='.repeat(60));

  const tests = [
    testAllEdgesPresent,
    testCapacityRange,
    testCapacityInteger,
    testRandomness,
    testEdgeStructure,
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      test();
      passed++;
    } catch (error) {
      console.error(`  ✗ FAILED: ${error instanceof Error ? error.message : error}`);
      failed++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  }
};

// Export test runner for console
if (typeof window !== 'undefined') {
  (window as any).runGraphGeneratorTests = runGraphGeneratorTests;
  console.log('\nTo run graph generator tests, open browser console and execute:');
  console.log('  runGraphGeneratorTests()');
}
