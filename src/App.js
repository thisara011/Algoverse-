// src/App.js (FINAL FIXED VERSION)

import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; 
import { supabase } from './lib/supabaseClient'; 
import { generateDistanceMatrix, indexToCity, cityToIndex } from './lib/utils';
import { solveTSPBruteForce } from './lib/tsp';

// ⭐ UNIVERSAL DEEP CLEANER (Fixes Supabase \u0000 null-byte error)
function deepClean(value) {
    if (Array.isArray(value)) {
        return value
            .filter(v => v !== undefined && v !== null)
            .map(v => deepClean(v));
    }

    if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, deepClean(v)])
        );
    }

    if (typeof value === 'string') {
        return value.replace(/\u0000/g, '');
    }

    return value;
}

const NUM_CITIES = 10;
const CITIES = Array.from({ length: NUM_CITIES }, (_, i) => indexToCity(i));

function App() {
    const [distanceMatrix, setDistanceMatrix] = useState(null);
    const [homeCity, setHomeCity] = useState(CITIES[0]);
    const [targetCities, setTargetCities] = useState([]);
    const [playerPath, setPlayerPath] = useState([]);
    const [gameRound, setGameRound] = useState(1);
    const [algorithmResults, setAlgorithmResults] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // ⭐ SAVE GAME RESULT TO SUPABASE
    const saveGameResult = useCallback(async (results) => {
        setIsSaving(true);
        
        if (!distanceMatrix || !results.bruteForce) {
            console.error("Cannot save: Missing required game data.");
            setIsSaving(false);
            return;
        }

        // Clean distance matrix
        const cleanedDistanceMatrix = distanceMatrix.map(row =>
            row.map(val => (val === null || val === undefined || isNaN(val)) ? 0 : val)
        );

        // Clean optimal path
        const cleanedOptimalPath = results.bruteForce?.path
            ?.filter(v => v !== null && v !== undefined)
            .map(indexToCity) || [];

        // 📦 Build payload
        const rawPayload = {
            home_city: homeCity,
            target_cities: targetCities.join(", "),
            optimal_distance: results.bruteForce?.distance ?? null,

            game_data: {
                distanceMatrix: cleanedDistanceMatrix,
                algorithmResults: {
                    bruteForceTime: results.bruteForce.timeTaken.toFixed(4),
                    optimalPath: cleanedOptimalPath
                },
                // ⭐ Clean playerPath
                playerPath: playerPath.filter(v => v !== null && v !== undefined)
            }
        };

        // ⭐ Apply deep clean to ENTIRE payload
        const finalPayload = deepClean(rawPayload);

        // 📤 Insert into Supabase
        const { data, error } = await supabase
            .from('traveling_salesman_table')
            .insert([finalPayload])
            .select();

        setIsSaving(false);

        if (error) {
            console.error("Supabase Error:", error);
            alert("Failed to save results (check console).");
        } else {
            console.log("Game saved successfully:", data[0].id);
        }

    }, [homeCity, targetCities, distanceMatrix, playerPath]);

    // ⭐ Run the algorithms
    const runAlgorithms = useCallback(() => {
        if (!distanceMatrix || targetCities.length === 0) return;

        const homeIndex = cityToIndex(homeCity);
        const targetIndices = targetCities.map(cityToIndex);

        // Brute Force execution
        const start = performance.now();
        const bruteForceResult = solveTSPBruteForce(distanceMatrix, homeIndex, targetIndices);
        const end = performance.now();

        bruteForceResult.timeTaken = end - start;

        const results = { bruteForce: bruteForceResult };

        setAlgorithmResults(results);
        saveGameResult(results);

    }, [distanceMatrix, homeCity, targetCities, saveGameResult]);

    // ⭐ Start new game
    const startNewGame = useCallback(() => {
        const newMatrix = generateDistanceMatrix(NUM_CITIES);
        setDistanceMatrix(newMatrix);

        const randomHome = Math.floor(Math.random() * NUM_CITIES);
        setHomeCity(indexToCity(randomHome));

        let potentialTargets = CITIES.filter(c => c !== indexToCity(randomHome));
        potentialTargets = potentialTargets.sort(() => 0.5 - Math.random());
        const numTargets = Math.floor(Math.random() * 3) + 3;

        setTargetCities(potentialTargets.slice(0, numTargets));
        setPlayerPath([]);
        setAlgorithmResults(null);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame, gameRound]);

    if (!distanceMatrix) {
        return <div className="loading-container">Loading New Game...</div>;
    }

    return (
        <div className="app-layout">
            <header className="header">
                <h1>TSP Algorithm Performance Analyzer</h1>
            </header>

            <div className="main-content">
                <div className="main-visualization-panel">
                    <h2>City Network Visualization</h2>
                    <div className="map-placeholder">
                        <p>Visual map rendering area</p>
                    </div>

                    <div className="card matrix-display">
                        <h3>Current Distance Matrix</h3>
                        <p>Matrix Size: {NUM_CITIES} x {NUM_CITIES}</p>
                    </div>
                </div>

                <div className="sidebar-controls">
                    <div className="card game-state">
                        <h3>Current Game State</h3>
                        <p><strong>Home City:</strong> {homeCity}</p>
                        <p><strong>Target Cities:</strong> {targetCities.join(", ")}</p>
                    </div>

                    <div className="card actions-panel">
                        <h3>Actions</h3>
                        <button onClick={runAlgorithms} disabled={isSaving} className="primary-button">
                            {isSaving ? "Saving..." : "Run Algorithms & Save"}
                        </button>

                        <button 
                            className="secondary-button" 
                            onClick={() => setGameRound(g => g + 1)}
                            disabled={isSaving}
                        >
                            Start New Game ({gameRound + 1})
                        </button>
                    </div>

                    {algorithmResults && algorithmResults.bruteForce && (
                        <div className="card results-panel">
                            <h3>Optimization Results</h3>
                            <p><strong>Optimal Distance:</strong> {algorithmResults.bruteForce.distance}</p>
                            <p><strong>Optimal Path:</strong> 
                                {algorithmResults.bruteForce.path.map(indexToCity).join(" → ")}
                            </p>
                            <p>Runtime: {algorithmResults.bruteForce.timeTaken.toFixed(4)} ms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
