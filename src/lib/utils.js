// src/lib/utils.js

/**
 * Generates a symmetric distance matrix for N cities (A, B, C...)
 * with distances between 50 and 100 km.
 * @param {number} numCities The number of cities (e.g., 10 for A-J).
 * @returns {Array<Array<number>>} The distance matrix.
 */
export const generateDistanceMatrix = (numCities = 10) => {
    const matrix = Array(numCities).fill(0).map(() => Array(numCities).fill(0));

    for (let i = 0; i < numCities; i++) {
        for (let j = i + 1; j < numCities; j++) {
            // Generate a random distance between 50 and 100
            const distance = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
            
            // Ensure symmetry
            matrix[i][j] = distance;
            matrix[j][i] = distance;
        }
    }
    return matrix;
};

/**
 * Converts a city index (0-9) to a city letter (A-J).
 * @param {number} index
 * @returns {string}
 */
export const indexToCity = (index) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
};

/**
 * Converts a city letter (A-J) to a city index (0-9).
 * @param {string} city
 * @returns {number}
 */
export const cityToIndex = (city) => {
    return city.charCodeAt(0) - 65;
};