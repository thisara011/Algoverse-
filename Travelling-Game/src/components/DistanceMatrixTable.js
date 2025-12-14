// src/components/DistanceMatrixTable.js - Cyberpunk Distance Matrix Table

import React from 'react';

const DistanceMatrixTable = ({ cities = [], distanceMatrix = [[]], homeCity, targetCities = [], algorithmResults }) => {
    if (!distanceMatrix || distanceMatrix.length === 0 || cities.length === 0) {
        return (
            <div className="cyberpunk-table-container">
                <p className="cyberpunk-text">Loading distance matrix...</p>
            </div>
        );
    }

    const optimalPath = algorithmResults?.bruteForce?.path || [];

    const getCellClass = (rowCity, colCity) => {
        let classes = 'cyberpunk-cell';

        // Highlight home city row/column
        if (rowCity === homeCity || colCity === homeCity) {
            classes += ' home-city-cell';
        }

        // Highlight target cities
        if (targetCities.includes(rowCity) || targetCities.includes(colCity)) {
            classes += ' target-city-cell';
        }

        // Highlight optimal path edges
        if (optimalPath && optimalPath.length > 0) {
            for (let i = 0; i < optimalPath.length - 1; i++) {
                const from = optimalPath[i];
                const to = optimalPath[i + 1];
                if ((rowCity === from && colCity === to) || (rowCity === to && colCity === from)) {
                    classes += ' optimal-path-cell';
                    break;
                }
            }
        }

        return classes;
    };

    return (
        <div className="cyberpunk-table-container">
            <div className="cyberpunk-table-header">
                <span className="cyberpunk-icon">⚡</span>
                <h3>Distance Matrix (km)</h3>
                <span className="cyberpunk-icon">⚡</span>
            </div>

            <div className="cyberpunk-table-wrapper">
                <table className="cyberpunk-table">
                    <thead>
                        <tr>
                            <th className="cyberpunk-th corner-cell">
                                <span className="cyberpunk-icon-small">📍</span>
                            </th>
                            {cities.map(city => (
                                <th
                                    key={city}
                                    className={`cyberpunk-th ${city === homeCity ? 'home-header' : targetCities.includes(city) ? 'target-header' : ''}`}
                                >
                                    {city === homeCity && <span className="cyberpunk-icon-small">🏠</span>}
                                    {city}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((rowCity, rowIndex) => (
                            <tr key={rowCity}>
                                <td className={`cyberpunk-th row-header ${rowCity === homeCity ? 'home-header' : targetCities.includes(rowCity) ? 'target-header' : ''}`}>
                                    {rowCity === homeCity && <span className="cyberpunk-icon-small">🏠</span>}
                                    {rowCity}
                                </td>
                                {cities.map((colCity, colIndex) => {
                                    const distance = rowIndex === colIndex ? 0 : (distanceMatrix[rowIndex]?.[colIndex] ?? '-');
                                    return (
                                        <td
                                            key={colCity}
                                            className={getCellClass(rowCity, colCity)}
                                        >
                                            {distance}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="cyberpunk-legend">
                <div className="legend-item">
                    <span className="legend-color home-legend"></span>
                    <span>Home City</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color target-legend"></span>
                    <span>Target Cities</span>
                </div>
                {optimalPath.length > 0 && (
                    <div className="legend-item">
                        <span className="legend-color optimal-legend"></span>
                        <span>Optimal Path</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistanceMatrixTable;

