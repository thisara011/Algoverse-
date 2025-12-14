// src/components/PathBuilder.js - User Interface for Building Path

import React, { useState, useEffect } from 'react';
import { cityToIndex } from '../lib/utils';

const PathBuilder = ({ 
    cities, 
    homeCity, 
    selectedCities, 
    onPathChange,
    distanceMatrix,
    disabled = false 
}) => {
    const [currentPath, setCurrentPath] = useState([homeCity]);
    const [availableNextCities, setAvailableNextCities] = useState([]);
    
    useEffect(() => {
        // Reset path when home city or selected cities change
        setCurrentPath([homeCity]);
        updateAvailableCities([homeCity]);
    }, [homeCity, selectedCities.join(',')]);
    
    const updateAvailableCities = (path) => {
        if (path.length === 1) {
            // At start, can go to any selected city
            setAvailableNextCities(selectedCities);
        } else if (path.length <= selectedCities.length) {
            // Can go to any unvisited selected city, or back to home if all visited
            const visited = path.slice(1); // Exclude initial home
            const unvisited = selectedCities.filter(c => !visited.includes(c));
            
            if (unvisited.length === 0) {
                // All cities visited, can only return to home
                setAvailableNextCities([homeCity]);
            } else {
                setAvailableNextCities(unvisited);
            }
        } else {
            setAvailableNextCities([]);
        }
    };
    
    const addCityToPath = (city) => {
        if (disabled) return;
        
        const newPath = [...currentPath, city];
        setCurrentPath(newPath);
        updateAvailableCities(newPath);
        onPathChange(newPath);
        
        // If returned to home, path is complete
        if (city === homeCity && newPath.length > 2) {
            // Path complete
        }
    };
    
    const removeLastCity = () => {
        if (disabled || currentPath.length <= 1) return;
        
        const newPath = currentPath.slice(0, -1);
        setCurrentPath(newPath);
        updateAvailableCities(newPath);
        onPathChange(newPath);
    };
    
    const resetPath = () => {
        if (disabled) return;
        
        setCurrentPath([homeCity]);
        updateAvailableCities([homeCity]);
        onPathChange([homeCity]);
    };
    
    const calculatePathDistance = () => {
        if (currentPath.length < 2) return 0;
        
        let distance = 0;
        
        for (let i = 0; i < currentPath.length - 1; i++) {
            const fromIdx = cityToIndex(currentPath[i]);
            const toIdx = cityToIndex(currentPath[i + 1]);
            distance += distanceMatrix[fromIdx]?.[toIdx] || 0;
        }
        
        return distance;
    };
    
    const isPathComplete = currentPath.length > 2 && 
                          currentPath[currentPath.length - 1] === homeCity &&
                          currentPath.slice(1, -1).length === selectedCities.length;
    
    return (
        <div className="path-builder">
            <h3>Your Route</h3>
            
            {/* Current Path Display */}
            <div className="current-path-display">
                <div className="path-visualization">
                    {currentPath.map((city, idx) => (
                        <React.Fragment key={idx}>
                            <span className={`path-city ${city === homeCity ? 'home-city' : ''}`}>
                                {city}
                            </span>
                            {idx < currentPath.length - 1 && <span className="path-arrow">→</span>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="path-stats">
                    <div className="stat-item">
                        <span className="stat-label">Distance:</span>
                        <span className="stat-value">{calculatePathDistance().toFixed(2)} km</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Progress:</span>
                        <span className="stat-value">{currentPath.slice(1, -1).length} / {selectedCities.length}</span>
                    </div>
                    {isPathComplete && (
                        <div className="path-complete">✓ Ready to Submit!</div>
                    )}
                </div>
            </div>
            
            {/* Available Next Cities */}
            {availableNextCities.length > 0 && !isPathComplete && (
                <div className="available-cities">
                    <p className="next-city-label">Next:</p>
                    <div className="city-options">
                        {availableNextCities.map(city => (
                            <button
                                key={city}
                                className={`city-option ${city === homeCity ? 'home-option' : ''}`}
                                onClick={() => addCityToPath(city)}
                                disabled={disabled}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Path Controls */}
            <div className="path-controls">
                <button 
                    onClick={removeLastCity} 
                    disabled={disabled || currentPath.length <= 1}
                    className="control-button"
                >
                    ← Undo
                </button>
                <button 
                    onClick={resetPath} 
                    disabled={disabled || currentPath.length <= 1}
                    className="control-button"
                >
                    ↻ Reset
                </button>
            </div>
        </div>
    );
};

export default PathBuilder;

