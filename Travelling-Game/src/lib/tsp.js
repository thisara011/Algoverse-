// src/lib/tsp.js - Three Algorithm Approaches for TSP

import { cityToIndex, indexToCity } from './utils';

// Helper function to calculate the total distance of a path
const calculatePathDistance = (path, matrix) => {
    if (!path || path.length < 2) return Infinity;

    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const fromIndex = path[i];
        const toIndex = path[i + 1];

        if (fromIndex < 0 || fromIndex >= matrix.length ||
            toIndex < 0 || toIndex >= matrix.length) {
            return Infinity;
        }

        const dist = matrix[fromIndex]?.[toIndex];
        if (dist === undefined || dist === null || isNaN(dist)) {
            return Infinity;
        }

        distance += dist;
    }
    return distance;
};

// Helper function to generate all permutations (recursive)
const generatePermutations = (array) => {
    if (!array || array.length === 0) return [];
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
 * Algorithm 1: Brute Force (Exhaustive Search)
 * Complexity: O(n!) where n is the number of cities to visit
 * Time Complexity: Exponential - checks all possible permutations
 * Space Complexity: O(n!) for storing all permutations
 * 
 * @param {Array<Array<number>>} matrix The distance matrix
 * @param {number} homeCityIndex The starting city index
 * @param {Array<number>} targetCityIndices Indices of cities to visit
 * @returns {{path: Array<string>, distance: number, timeTaken: number, complexity: string}}
 */
export const solveTSPBruteForce = (matrix, homeCityIndex, targetCityIndices) => {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
        throw new Error('Invalid distance matrix');
    }
    if (homeCityIndex < 0 || homeCityIndex >= matrix.length) {
        throw new Error('Invalid home city index');
    }
    if (!targetCityIndices || targetCityIndices.length === 0) {
        throw new Error('No target cities provided');
    }

    const startTime = performance.now();

    try {
        const allTargetPermutations = generatePermutations(targetCityIndices);

        if (allTargetPermutations.length === 0) {
            // If no targets, just return home -> home
            const endTime = performance.now();
            return {
                path: [indexToCity(homeCityIndex), indexToCity(homeCityIndex)],
                distance: 0,
                timeTaken: endTime - startTime,
                complexity: 'O(1)',
                algorithmName: 'Brute Force'
            };
        }

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
        const pathCities = bestPathIndices.map(indexToCity);

        return {
            path: pathCities,
            distance: shortestDistance,
            timeTaken: endTime - startTime,
            complexity: `O(n!) where n=${targetCityIndices.length}`,
            algorithmName: 'Brute Force',
            bigO: 'O(n!)'
        };
    } catch (error) {
        throw new Error(`Brute Force algorithm failed: ${error.message}`);
    }
};

/**
 * Algorithm 2: Nearest Neighbor (Greedy Heuristic)
 * Complexity: O(n²) where n is the number of cities to visit
 * Time Complexity: Polynomial - for each city, find nearest unvisited neighbor
 * Space Complexity: O(n) for visited array
 * 
 * @param {Array<Array<number>>} matrix The distance matrix
 * @param {number} homeCityIndex The starting city index
 * @param {Array<number>} targetCityIndices Indices of cities to visit
 * @returns {{path: Array<string>, distance: number, timeTaken: number, complexity: string}}
 */
export const solveTSPNearestNeighbor = (matrix, homeCityIndex, targetCityIndices) => {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
        throw new Error('Invalid distance matrix');
    }
    if (homeCityIndex < 0 || homeCityIndex >= matrix.length) {
        throw new Error('Invalid home city index');
    }
    if (!targetCityIndices || targetCityIndices.length === 0) {
        throw new Error('No target cities provided');
    }

    const startTime = performance.now();

    try {
        const path = [homeCityIndex];
        const unvisited = [...targetCityIndices];
        let currentCity = homeCityIndex;

        while (unvisited.length > 0) {
            let nearestCity = null;
            let nearestDistance = Infinity;

            // Find the nearest unvisited city
            for (const city of unvisited) {
                const dist = matrix[currentCity]?.[city];
                if (dist !== undefined && dist !== null && !isNaN(dist) && dist < nearestDistance) {
                    nearestDistance = dist;
                    nearestCity = city;
                }
            }

            if (nearestCity === null) {
                throw new Error('Cannot find nearest neighbor');
            }

            path.push(nearestCity);
            currentCity = nearestCity;
            unvisited.splice(unvisited.indexOf(nearestCity), 1);
        }

        // Return to home
        path.push(homeCityIndex);

        const totalDistance = calculatePathDistance(path, matrix);
        const endTime = performance.now();
        const pathCities = path.map(indexToCity);

        return {
            path: pathCities,
            distance: totalDistance,
            timeTaken: endTime - startTime,
            complexity: `O(n²) where n=${targetCityIndices.length}`,
            algorithmName: 'Nearest Neighbor',
            bigO: 'O(n²)'
        };
    } catch (error) {
        throw new Error(`Nearest Neighbor algorithm failed: ${error.message}`);
    }
};

/**
 * Algorithm 3: Dynamic Programming (Held-Karp Algorithm)
 * Complexity: O(n² * 2^n) where n is the number of cities to visit
 * Time Complexity: Exponential but better than brute force due to memoization
 * Space Complexity: O(n * 2^n) for memoization table
 * 
 * @param {Array<Array<number>>} matrix The distance matrix
 * @param {number} homeCityIndex The starting city index
 * @param {Array<number>} targetCityIndices Indices of cities to visit
 * @returns {{path: Array<string>, distance: number, timeTaken: number, complexity: string}}
 */
export const solveTSPDynamicProgramming = (matrix, homeCityIndex, targetCityIndices) => {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
        throw new Error('Invalid distance matrix');
    }
    if (homeCityIndex < 0 || homeCityIndex >= matrix.length) {
        throw new Error('Invalid home city index');
    }
    if (!targetCityIndices || targetCityIndices.length === 0) {
        throw new Error('No target cities provided');
    }

    // For large sets, fall back to nearest neighbor to avoid memory issues
    if (targetCityIndices.length > 12) {
        console.warn('Too many cities for DP, using Nearest Neighbor instead');
        return solveTSPNearestNeighbor(matrix, homeCityIndex, targetCityIndices);
    }

    const startTime = performance.now();

    try {
        const n = targetCityIndices.length;
        const allCities = [homeCityIndex, ...targetCityIndices];
        const numCities = allCities.length;

        // Memoization table: dp[mask][last] = minimum cost to visit cities in mask ending at last
        const dp = {};
        const parent = {};

        // Initialize: starting from home city
        const homeMask = 1 << 0; // Home is at position 0
        dp[`${homeMask},0`] = 0;

        // Convert city indices to positions in allCities array
        const cityToPos = {};
        allCities.forEach((city, idx) => {
            cityToPos[city] = idx;
        });

        // DP: try all subsets
        for (let mask = 1; mask < (1 << numCities); mask++) {
            for (let last = 0; last < numCities; last++) {
                if (!(mask & (1 << last))) continue;

                const key = `${mask},${last}`;
                if (dp[key] === undefined) continue;

                // Try to extend path to unvisited cities
                for (let next = 0; next < numCities; next++) {
                    if (mask & (1 << next)) continue; // Already visited

                    const nextMask = mask | (1 << next);
                    const nextKey = `${nextMask},${next}`;

                    const fromCity = allCities[last];
                    const toCity = allCities[next];
                    const cost = matrix[fromCity]?.[toCity] ?? Infinity;

                    const newCost = dp[key] + cost;

                    if (dp[nextKey] === undefined || newCost < dp[nextKey]) {
                        dp[nextKey] = newCost;
                        parent[nextKey] = { mask, last };
                    }
                }
            }
        }

        // Find minimum cost path ending back at home
        const finalMask = (1 << numCities) - 1;
        let bestCost = Infinity;
        let bestLast = -1;

        for (let last = 0; last < numCities; last++) {
            const key = `${finalMask},${last}`;
            if (dp[key] !== undefined) {
                const fromCity = allCities[last];
                const toHome = matrix[fromCity]?.[homeCityIndex] ?? Infinity;
                const totalCost = dp[key] + toHome;

                if (totalCost < bestCost) {
                    bestCost = totalCost;
                    bestLast = last;
                }
            }
        }

        // Reconstruct path
        const path = [];
        let currentMask = finalMask;
        let currentLast = bestLast;

        while (currentMask !== undefined && currentLast !== undefined) {
            path.unshift(allCities[currentLast]);
            const key = `${currentMask},${currentLast}`;
            const p = parent[key];
            if (!p) break;
            currentMask = p.mask;
            currentLast = p.last;
        }

        path.push(homeCityIndex); // Return to home

        const endTime = performance.now();
        const pathCities = path.map(indexToCity);

        return {
            path: pathCities,
            distance: bestCost,
            timeTaken: endTime - startTime,
            complexity: `O(n² * 2^n) where n=${targetCityIndices.length}`,
            algorithmName: 'Dynamic Programming',
            bigO: 'O(n² * 2^n)'
        };
    } catch (error) {
        throw new Error(`Dynamic Programming algorithm failed: ${error.message}`);
    }
};

/**
 * Validates if a user's path is correct
 * @param {Array<string>} userPath User's selected path
 * @param {string} homeCity Home city
 * @param {Array<string>} targetCities Cities that must be visited
 * @param {Array<Array<number>>} matrix Distance matrix
 * @param {number} optimalDistance Optimal distance from algorithms
 * @returns {{isCorrect: boolean, userDistance: number, message: string}}
 */
export const validateUserPath = (userPath, homeCity, targetCities, matrix, optimalDistance) => {
    if (!userPath || userPath.length === 0) {
        return {
            isCorrect: false,
            userDistance: Infinity,
            message: 'No path provided'
        };
    }

    if (userPath[0] !== homeCity || userPath[userPath.length - 1] !== homeCity) {
        return {
            isCorrect: false,
            userDistance: Infinity,
            message: 'Path must start and end at home city'
        };
    }

    // Check if all target cities are visited exactly once
    const visitedCities = userPath.slice(1, -1); // Exclude home cities at start/end
    const targetSet = new Set(targetCities);
    const visitedSet = new Set(visitedCities);

    if (visitedSet.size !== visitedCities.length) {
        return {
            isCorrect: false,
            userDistance: Infinity,
            message: 'Cities must be visited exactly once (no duplicates)'
        };
    }

    for (const city of targetCities) {
        if (!visitedSet.has(city)) {
            return {
                isCorrect: false,
                userDistance: Infinity,
                message: `Missing city: ${city}`
            };
        }
    }

    // Calculate user's distance
    const pathIndices = userPath.map(cityToIndex);
    const userDistance = calculatePathDistance(pathIndices, matrix);

    // Check if distance matches optimal (with small tolerance for floating point)
    const isCorrect = Math.abs(userDistance - optimalDistance) < 0.01;

    return {
        isCorrect,
        userDistance,
        message: isCorrect
            ? 'Correct! You found the shortest path!'
            : `Your distance: ${userDistance.toFixed(2)} km, Optimal: ${optimalDistance.toFixed(2)} km`
    };
};
