# Unit Tests for Traffic Simulation Game

This directory contains comprehensive unit tests for the Traffic Simulation Game.

## Test Files

### 1. maxFlowAlgorithms.test.ts
Tests for the Ford-Fulkerson and Edmonds-Karp maximum flow algorithms.

**Test Cases:**
- Simple Linear Graph - Tests basic flow through linear path
- Multiple Paths Graph - Tests flow distribution across parallel paths
- Bottleneck Graph - Tests capacity constraints
- Complex Graph - Tests multiple intermediate nodes
- Single Edge Graph - Tests minimal graph
- Disconnected Graph - Tests handling of unreachable sink
- Zero Capacity Graph - Tests zero capacity edges
- Full Traffic Network - Tests complete game-like structure

**Performance Benchmark:**
- Runs both algorithms 100 times and compares average execution times

### 2. graphGenerator.test.ts
Tests for the random graph generation functionality.

**Test Cases:**
- All Edges Present - Verifies all 13 required edges are generated
- Capacity Range - Ensures all capacities are between 5 and 15
- Capacity Integer - Validates all capacities are integers
- Randomness - Confirms different graphs are generated
- Edge Structure - Checks proper edge object structure

## Running Tests

### In Browser Console

The tests are automatically loaded with the application. To run them:

1. Open the browser developer console (F12)
2. Execute the following commands:

```javascript
// Run maximum flow algorithm tests
runMaxFlowTests()

// Run performance benchmark
runPerformanceBenchmark()

// Run graph generator tests
runGraphGeneratorTests()
```

### Expected Output

Tests will output:
- ✓ for passed tests
- ✗ for failed tests
- Test summary with pass/fail counts
- Performance metrics for benchmarks

## Test Coverage

The tests cover:
- **Algorithm Correctness**: Both algorithms produce identical results
- **Edge Cases**: Empty graphs, disconnected graphs, zero capacity
- **Validation**: Input validation and error handling
- **Performance**: Execution time measurement and comparison
- **Graph Generation**: Valid structure and randomness

## Validation & Exception Handling

All tests include:
- Input validation (type checking, range validation)
- Exception handling with descriptive error messages
- Edge case handling (disconnected graphs, zero capacity)
- Iteration limits to prevent infinite loops
- Detailed error logging

## Adding New Tests

To add a new test:

1. Create a test function that throws an error if the test fails
2. Add the test to the appropriate test array
3. Update this README with the new test description

Example:
```typescript
export const testNewFeature = (): void => {
  console.log('\nTest: New Feature');
  
  // Test logic here
  if (condition) {
    throw new Error('Test failed: reason');
  }
  
  console.log('  ✓ PASSED');
};
```
