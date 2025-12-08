// src/lib/tsp.js

import { indexToCity } from './utils';

// Helper function to calculate the total distance of a path
const calculatePathDistance = (path, matrix) => {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const fromIndex = path[i];
        const toIndex = path[i + 1];
        distance += matrix[fromIndex][toIndex];
    }
    return distance;
};

// Helper function to generate all permutations (recursive)
const generatePermutations = (array) => {
    if (array.length === 1) return [array];
    const result = [];

    for (let i = 0; i < array.length; i++) {
        const head = array[i];
        const rest = array.slice(0, i).concat(array.slice(i + 1));
        const restPermutations = generatePermutations(rest);

        for (const p of restPermutations) {
            result.push([head, ...p]);
        }
    }
    return result;
};

/**
 * Solves the TSP using Brute Force (checking all possible paths).
 * @param {Array<Array<number>>} matrix The distance matrix.
 * @param {number} homeCityIndex The starting city index.
 * @param {Array<number>} targetCityIndices Indices of cities to visit.
 * @returns {{path: Array<string>, distance: number, timeTaken: number}}
 */
export const solveTSPBruteForce = (matrix, homeCityIndex, targetCityIndices) => {
    const startTime = performance.now();
    
    // The path must visit the target cities and return to the home city.
    // The cities to permute are all target cities.
    // The path is: Home -> Permutation of Targets -> Home
    
    const allTargetPermutations = generatePermutations(targetCityIndices);
    
    let shortestDistance = Infinity;
    let bestPathIndices = [];

    for (const permutation of allTargetPermutations) {
        // Full path: Home -> Targets -> Home
        const fullPath = [homeCityIndex, ...permutation, homeCityIndex];
        
        const currentDistance = calculatePathDistance(fullPath, matrix);

        if (currentDistance < shortestDistance) {
            shortestDistance = currentDistance;
            bestPathIndices = fullPath;
        }
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    // Convert indices to city letters for the final output
    const pathCities = bestPathIndices.map(indexToCity);

    return {
        path: pathCities,
        distance: shortestDistance,
        timeTaken: timeTaken,
        complexity: "O(n!)" // n is the number of cities to visit
    };
};