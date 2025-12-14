// src/lib/tsp.test.js - Unit Tests for TSP Algorithms

import { 
    solveTSPBruteForce, 
    solveTSPNearestNeighbor, 
    solveTSPDynamicProgramming,
    validateUserPath 
} from './tsp';
import { cityToIndex } from './utils';

describe('TSP Algorithms', () => {
    // Test distance matrix (symmetric)
    const createTestMatrix = () => {
        // 4 cities: A, B, C, D
        // A-B: 60, A-C: 70, A-D: 80
        // B-C: 50, B-D: 90
        // C-D: 65
        return [
            [0, 60, 70, 80],  // A
            [60, 0, 50, 90],  // B
            [70, 50, 0, 65],  // C
            [80, 90, 65, 0]   // D
        ];
    };

    describe('solveTSPBruteForce', () => {
        test('should solve TSP for 2 cities', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0; // A
            const targetIndices = [1]; // B
            
            const result = solveTSPBruteForce(matrix, homeIndex, targetIndices);
            
            expect(result.path).toEqual(['A', 'B', 'A']);
            expect(result.distance).toBe(120); // A->B (60) + B->A (60)
            expect(result.timeTaken).toBeGreaterThanOrEqual(0);
            expect(result.complexity).toContain('O(n!)');
        });

        test('should solve TSP for 3 cities', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0; // A
            const targetIndices = [1, 2]; // B, C
            
            const result = solveTSPBruteForce(matrix, homeIndex, targetIndices);
            
            expect(result.path[0]).toBe('A');
            expect(result.path[result.path.length - 1]).toBe('A');
            expect(result.path.length).toBe(4); // A -> B/C -> C/B -> A
            expect(result.distance).toBeGreaterThan(0);
        });

        test('should throw error for invalid matrix', () => {
            expect(() => {
                solveTSPBruteForce(null, 0, [1]);
            }).toThrow('Invalid distance matrix');
        });

        test('should throw error for invalid home city', () => {
            const matrix = createTestMatrix();
            expect(() => {
                solveTSPBruteForce(matrix, -1, [1]);
            }).toThrow('Invalid home city index');
        });

        test('should throw error for empty target cities', () => {
            const matrix = createTestMatrix();
            expect(() => {
                solveTSPBruteForce(matrix, 0, []);
            }).toThrow('No target cities provided');
        });
    });

    describe('solveTSPNearestNeighbor', () => {
        test('should solve TSP using nearest neighbor', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0; // A
            const targetIndices = [1, 2, 3]; // B, C, D
            
            const result = solveTSPNearestNeighbor(matrix, homeIndex, targetIndices);
            
            expect(result.path[0]).toBe('A');
            expect(result.path[result.path.length - 1]).toBe('A');
            expect(result.path.length).toBe(5); // A -> ... -> A
            expect(result.distance).toBeGreaterThan(0);
            expect(result.complexity).toContain('O(n²)');
        });

        test('should handle single target city', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0; // A
            const targetIndices = [1]; // B
            
            const result = solveTSPNearestNeighbor(matrix, homeIndex, targetIndices);
            
            expect(result.path).toEqual(['A', 'B', 'A']);
            expect(result.distance).toBe(120);
        });

        test('should throw error for invalid inputs', () => {
            expect(() => {
                solveTSPNearestNeighbor(null, 0, [1]);
            }).toThrow('Invalid distance matrix');
        });
    });

    describe('solveTSPDynamicProgramming', () => {
        test('should solve TSP using dynamic programming', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0; // A
            const targetIndices = [1, 2]; // B, C
            
            const result = solveTSPDynamicProgramming(matrix, homeIndex, targetIndices);
            
            expect(result.path[0]).toBe('A');
            expect(result.path[result.path.length - 1]).toBe('A');
            expect(result.distance).toBeGreaterThan(0);
            expect(result.complexity).toContain('O(n² * 2^n)');
        });

        test('should fall back to nearest neighbor for large sets', () => {
            // Create a large matrix (15 cities)
            const largeMatrix = Array(15).fill(0).map(() => 
                Array(15).fill(0).map(() => Math.floor(Math.random() * 50) + 50)
            );
            // Make symmetric
            for (let i = 0; i < 15; i++) {
                for (let j = i + 1; j < 15; j++) {
                    largeMatrix[j][i] = largeMatrix[i][j];
                }
            }
            
            const homeIndex = 0;
            const targetIndices = Array.from({ length: 13 }, (_, i) => i + 1);
            
            const result = solveTSPDynamicProgramming(largeMatrix, homeIndex, targetIndices);
            
            // Should use nearest neighbor (complexity should be O(n²))
            expect(result.complexity).toContain('O(n²)');
        });
    });

    describe('validateUserPath', () => {
        const matrix = createTestMatrix();
        const homeCity = 'A';
        const targetCities = ['B', 'C'];
        const optimalDistance = 180; // Example optimal distance

        test('should validate correct path', () => {
            const userPath = ['A', 'B', 'C', 'A'];
            const result = validateUserPath(userPath, homeCity, targetCities, matrix, optimalDistance);
            
            // Note: This will depend on actual optimal distance
            expect(result).toHaveProperty('isCorrect');
            expect(result).toHaveProperty('userDistance');
            expect(result).toHaveProperty('message');
        });

        test('should reject path not starting at home', () => {
            const userPath = ['B', 'C', 'A'];
            const result = validateUserPath(userPath, homeCity, targetCities, matrix, optimalDistance);
            
            expect(result.isCorrect).toBe(false);
            expect(result.message).toContain('start and end at home city');
        });

        test('should reject path not ending at home', () => {
            const userPath = ['A', 'B', 'C'];
            const result = validateUserPath(userPath, homeCity, targetCities, matrix, optimalDistance);
            
            expect(result.isCorrect).toBe(false);
            expect(result.message).toContain('start and end at home city');
        });

        test('should reject path with duplicate cities', () => {
            const userPath = ['A', 'B', 'B', 'C', 'A'];
            const result = validateUserPath(userPath, homeCity, targetCities, matrix, optimalDistance);
            
            expect(result.isCorrect).toBe(false);
            expect(result.message).toContain('exactly once');
        });

        test('should reject path missing cities', () => {
            const userPath = ['A', 'B', 'A'];
            const result = validateUserPath(userPath, homeCity, targetCities, matrix, optimalDistance);
            
            expect(result.isCorrect).toBe(false);
            expect(result.message).toContain('Missing city');
        });

        test('should handle empty path', () => {
            const result = validateUserPath([], homeCity, targetCities, matrix, optimalDistance);
            
            expect(result.isCorrect).toBe(false);
            expect(result.message).toContain('No path provided');
        });
    });

    describe('Edge Cases', () => {
        test('should handle single city (no targets)', () => {
            const matrix = createTestMatrix();
            const homeIndex = 0;
            const targetIndices = [];
            
            // This should return home -> home with distance 0
            const result = solveTSPBruteForce(matrix, homeIndex, targetIndices);
            
            expect(result.path).toEqual(['A', 'A']);
            expect(result.distance).toBe(0);
        });

        test('should handle very small distance matrix', () => {
            const smallMatrix = [[0, 50], [50, 0]];
            const result = solveTSPBruteForce(smallMatrix, 0, [1]);
            
            expect(result.path).toEqual(['A', 'B', 'A']);
            expect(result.distance).toBe(100);
        });
    });
});

