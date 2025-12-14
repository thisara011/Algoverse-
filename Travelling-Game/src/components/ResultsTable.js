// src/components/ResultsTable.js - Display Algorithm Results and Complexity Analysis

import React from 'react';

const ResultsTable = ({ results, validationResult }) => {
    if (!results) return null;

    const algorithms = [
        { key: 'bruteForce', name: 'Brute Force', color: '#e74c3c' },
        { key: 'nearestNeighbor', name: 'Nearest Neighbor', color: '#3498db' },
        { key: 'dynamicProgramming', name: 'Dynamic Programming', color: '#2ecc71' }
    ];

    // Find optimal distance
    const optimalDistance = results.bruteForce?.distance ??
        Math.min(
            results.nearestNeighbor?.distance ?? Infinity,
            results.dynamicProgramming?.distance ?? Infinity
        );

    return (
        <div className="results-table">
            <h3>Algorithm Results</h3>

            <div className="algorithms-grid">
                {algorithms.map(alg => {
                    const result = results[alg.key];
                    if (!result || result.error) {
                        return (
                            <div key={alg.key} className="algorithm-card error">
                                <h4 style={{ color: alg.color }}>{alg.name}</h4>
                                <p className="error-text">Error</p>
                            </div>
                        );
                    }

                    const isOptimal = Math.abs(result.distance - optimalDistance) < 0.01;

                    return (
                        <div key={alg.key} className={`algorithm-card ${isOptimal ? 'optimal-card' : ''}`}>
                            <h4 style={{ color: alg.color }}>
                                {alg.name}
                                {isOptimal && <span className="optimal-badge">★</span>}
                            </h4>

                            <div className="result-details">
                                <div className="result-item">
                                    <span className="label">Distance:</span>
                                    <span className="value highlight">{result.distance?.toFixed(2)} km</span>
                                </div>

                                <div className="result-item">
                                    <span className="label">Time:</span>
                                    <span className="value">{result.timeTaken?.toFixed(2)} ms</span>
                                </div>

                                <div className="result-item path-item">
                                    <span className="label">Route:</span>
                                    <span className="value path">
                                        {result.path?.join(' → ') || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Comparison */}
            {results.bruteForce && !results.bruteForce.error &&
                results.nearestNeighbor && !results.nearestNeighbor.error &&
                results.dynamicProgramming && !results.dynamicProgramming.error && (
                    <div className="quick-comparison">
                        <h4>Best Result</h4>
                        <div className="best-result">
                            <span className="best-distance">{optimalDistance.toFixed(2)} km</span>
                            <span className="best-label">Shortest Distance</span>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default ResultsTable;

