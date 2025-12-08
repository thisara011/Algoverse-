import { fordFulkerson, edmondsKarp } from '../utils/maxFlowAlgorithms';
import { Edge } from '../utils/graphGenerator';

/**
 * Unit Tests for Maximum Flow Algorithms
 * 
 * These tests verify the correctness of the Ford-Fulkerson and Edmonds-Karp algorithms
 * by testing them against known graph configurations.
 */

// Test helper to run a test case
const runTest = (testName: string, edges: Edge[], expectedMaxFlow: number): void => {
  console.log(`\nRunning test: ${testName}`);
  
  try {
    const ff_result = fordFulkerson(edges);
    const ek_result = edmondsKarp(edges);

    console.log(`  Ford-Fulkerson result: ${ff_result}`);
    console.log(`  Edmonds-Karp result: ${ek_result}`);
    console.log(`  Expected: ${expectedMaxFlow}`);

    // Verify both algorithms produce same result
    if (ff_result !== ek_result) {
      throw new Error(`Algorithm mismatch! FF: ${ff_result}, EK: ${ek_result}`);
    }

    // Verify result matches expected
    if (ff_result !== expectedMaxFlow) {
      throw new Error(`Result mismatch! Got: ${ff_result}, Expected: ${expectedMaxFlow}`);
    }

    console.log(`  ✓ PASSED`);
  } catch (error) {
    console.error(`  ✗ FAILED: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
};

// Test 1: Simple linear graph
export const testSimpleLinear = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 10 },
    { from: 'B', to: 'T', capacity: 5 },
  ];
  runTest('Simple Linear Graph', edges, 5);
};

// Test 2: Graph with multiple paths
export const testMultiplePaths = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 10 },
    { from: 'A', to: 'C', capacity: 10 },
    { from: 'B', to: 'T', capacity: 5 },
    { from: 'C', to: 'T', capacity: 8 },
  ];
  runTest('Multiple Paths Graph', edges, 13);
};

// Test 3: Graph with bottleneck
export const testBottleneck = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 100 },
    { from: 'B', to: 'C', capacity: 5 },
    { from: 'C', to: 'T', capacity: 100 },
  ];
  runTest('Bottleneck Graph', edges, 5);
};

// Test 4: Complex graph with multiple intermediate nodes
export const testComplexGraph = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 10 },
    { from: 'A', to: 'C', capacity: 10 },
    { from: 'B', to: 'D', capacity: 4 },
    { from: 'B', to: 'E', capacity: 8 },
    { from: 'C', to: 'D', capacity: 9 },
    { from: 'D', to: 'T', capacity: 10 },
    { from: 'E', to: 'T', capacity: 10 },
  ];
  runTest('Complex Graph', edges, 19);
};

// Test 5: Single edge graph
export const testSingleEdge = (): void => {
  const edges: Edge[] = [{ from: 'A', to: 'T', capacity: 15 }];
  runTest('Single Edge Graph', edges, 15);
};

// Test 6: Disconnected graph (no path from A to T)
export const testDisconnected = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 10 },
    { from: 'C', to: 'T', capacity: 10 },
  ];
  runTest('Disconnected Graph', edges, 0);
};

// Test 7: Zero capacity edges
export const testZeroCapacity = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 0 },
    { from: 'B', to: 'T', capacity: 10 },
  ];
  runTest('Zero Capacity Graph', edges, 0);
};

// Test 8: Full traffic network (similar to game structure)
export const testTrafficNetwork = (): void => {
  const edges: Edge[] = [
    { from: 'A', to: 'B', capacity: 10 },
    { from: 'A', to: 'C', capacity: 8 },
    { from: 'A', to: 'D', capacity: 7 },
    { from: 'B', to: 'E', capacity: 9 },
    { from: 'B', to: 'F', capacity: 6 },
    { from: 'C', to: 'E', capacity: 5 },
    { from: 'C', to: 'F', capacity: 8 },
    { from: 'D', to: 'F', capacity: 7 },
    { from: 'E', to: 'G', capacity: 10 },
    { from: 'E', to: 'H', capacity: 8 },
    { from: 'F', to: 'H', capacity: 12 },
    { from: 'G', to: 'T', capacity: 15 },
    { from: 'H', to: 'T', capacity: 15 },
  ];
  runTest('Full Traffic Network', edges, 25);
};

// Run all tests
export const runAllTests = (): void => {
  console.log('='.repeat(60));
  console.log('MAXIMUM FLOW ALGORITHMS - UNIT TESTS');
  console.log('='.repeat(60));

  const tests = [
    testSimpleLinear,
    testMultiplePaths,
    testBottleneck,
    testComplexGraph,
    testSingleEdge,
    testDisconnected,
    testZeroCapacity,
    testTrafficNetwork,
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      test();
      passed++;
    } catch (error) {
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

// Performance benchmark
export const runPerformanceBenchmark = (): void => {
  console.log('\n' + '='.repeat(60));
  console.log('PERFORMANCE BENCHMARK');
  console.log('='.repeat(60));

  // Generate a larger graph for performance testing
  const largeEdges: Edge[] = [
    { from: 'A', to: 'B', capacity: 15 },
    { from: 'A', to: 'C', capacity: 12 },
    { from: 'A', to: 'D', capacity: 10 },
    { from: 'B', to: 'E', capacity: 14 },
    { from: 'B', to: 'F', capacity: 11 },
    { from: 'C', to: 'E', capacity: 13 },
    { from: 'C', to: 'F', capacity: 9 },
    { from: 'D', to: 'F', capacity: 15 },
    { from: 'E', to: 'G', capacity: 12 },
    { from: 'E', to: 'H', capacity: 14 },
    { from: 'F', to: 'H', capacity: 13 },
    { from: 'G', to: 'T', capacity: 15 },
    { from: 'H', to: 'T', capacity: 15 },
  ];

  const iterations = 100;

  // Benchmark Ford-Fulkerson
  const ffStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    fordFulkerson(largeEdges);
  }
  const ffEnd = performance.now();
  const ffAvg = (ffEnd - ffStart) / iterations;

  // Benchmark Edmonds-Karp
  const ekStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    edmondsKarp(largeEdges);
  }
  const ekEnd = performance.now();
  const ekAvg = (ekEnd - ekStart) / iterations;

  console.log(`\nIterations: ${iterations}`);
  console.log(`Ford-Fulkerson average: ${ffAvg.toFixed(3)} ms`);
  console.log(`Edmonds-Karp average: ${ekAvg.toFixed(3)} ms`);
  console.log('='.repeat(60));
};

// Export test runner for console
if (typeof window !== 'undefined') {
  (window as any).runMaxFlowTests = runAllTests;
  (window as any).runPerformanceBenchmark = runPerformanceBenchmark;
  console.log('\nTo run tests, open browser console and execute:');
  console.log('  runMaxFlowTests()');
  console.log('  runPerformanceBenchmark()');
}
