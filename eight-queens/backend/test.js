/**
 * Unit Tests for Eight Queens backend
 */

const request = require('supertest');
const QueenSolver = require('./queensolver');
const app = require('./server');

// A known valid solution
const VALID_BOARD = JSON.stringify([0, 4, 7, 5, 2, 6, 1, 3]);

describe('QueenSolver validation', () => {
  test('isValidSolution accepts a correct board', () => {
    expect(QueenSolver.isValidSolution(VALID_BOARD)).toBe(true);
  });

  test('isValidSolution rejects invalid format', () => {
    expect(QueenSolver.isValidSolution('invalid')).toBe(false);
  });

  test('isValidSolution rejects duplicate columns', () => {
    const invalid = JSON.stringify([0, 0, 7, 5, 2, 6, 1, 3]);
    expect(QueenSolver.isValidSolution(invalid)).toBe(false);
  });
});

describe('Solvers', () => {
  test('sequential finds 92 solutions', async () => {
    const result = await QueenSolver.solveSequential();
    expect(result.count).toBe(92);
    expect(result.solutions.length).toBe(92);
    expect(result.time).toBeGreaterThan(0);
  }, 30000);

  test('threaded returns solutions and time', async () => {
    const result = await QueenSolver.solveThreaded(4);
    expect(result.count).toBeGreaterThan(0);
    expect(result.time).toBeGreaterThan(0);
  }, 30000);
});

describe('API endpoints', () => {
  test('health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('solve sequential endpoint', async () => {
    const res = await request(app).post('/solve/sequential');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.mode).toBe('sequential');
  }, 30000);

  test('solve threaded endpoint', async () => {
    const res = await request(app).post('/solve/threaded');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.mode).toBe('threaded');
  }, 30000);

  test('submit rejects missing name', async () => {
    const res = await request(app)
      .post('/submit')
      .send({ board: VALID_BOARD });
    expect(res.status).toBe(400);
  });

  test('submit rejects invalid board', async () => {
    const res = await request(app)
      .post('/submit')
      .send({ playerName: 'Test', board: 'invalid' });
    expect(res.status).toBe(400);
  });
});
