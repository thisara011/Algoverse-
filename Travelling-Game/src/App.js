// src/App.js - Traveling Salesman Problem Game (Complete Implementation)

import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import CitySelector from './components/CitySelector';
import DistanceMatrixTable from './components/DistanceMatrixTable';
import PathBuilder from './components/PathBuilder';
import ResultsTable from './components/ResultsTable';
import { supabase } from './lib/supabaseClient';
import {
    solveTSPBruteForce,
    solveTSPDynamicProgramming,
    solveTSPNearestNeighbor,
    validateUserPath
} from './lib/tsp';
import { cityToIndex, generateDistanceMatrix, indexToCity } from './lib/utils';
import { updatePlayerStats } from './utils/updateStats';

const NUM_CITIES = 10;
const CITIES = Array.from({ length: NUM_CITIES }, (_, i) => indexToCity(i));

function App() {
    // Game State
    const [distanceMatrix, setDistanceMatrix] = useState(null);
    const [homeCity, setHomeCity] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerPath, setPlayerPath] = useState([]);
    const [gameRound, setGameRound] = useState(1);

    // Algorithm Results
    const [algorithmResults, setAlgorithmResults] = useState(null);
    const [isRunningAlgorithms, setIsRunningAlgorithms] = useState(false);

    // Validation
    const [validationResult, setValidationResult] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [gameSaved, setGameSaved] = useState(false);

    // Error Handling
    const [error, setError] = useState(null);

    // ⭐ Start New Game Round
    const startNewGame = useCallback(() => {
        try {
            setError(null);
            setValidationResult(null);
            setGameSaved(false);

            // Generate new distance matrix (50-100 km)
            const newMatrix = generateDistanceMatrix(NUM_CITIES);
            setDistanceMatrix(newMatrix);

            // Random home city
            const randomHomeIndex = Math.floor(Math.random() * NUM_CITIES);
            const newHomeCity = indexToCity(randomHomeIndex);
            setHomeCity(newHomeCity);

            // Reset selections
            setSelectedCities([]);
            setPlayerPath([newHomeCity]);
            setAlgorithmResults(null);

        } catch (err) {
            setError(`Failed to start new game: ${err.message}`);
            console.error('Start game error:', err);
        }
    }, []);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, [gameRound, startNewGame]);

    // ⭐ Toggle City Selection
    const handleCityToggle = (city) => {
        if (city === homeCity) return; // Cannot select home city

        setSelectedCities(prev => {
            if (prev.includes(city)) {
                // Deselect
                const newSelection = prev.filter(c => c !== city);
                // Reset path if city was removed
                if (playerPath.includes(city)) {
                    setPlayerPath([homeCity]);
                }
                return newSelection;
            } else {
                // Select (max 9 cities)
                if (prev.length >= 9) {
                    setError('Maximum 9 cities can be selected');
                    return prev;
                }
                return [...prev, city];
            }
        });
        setError(null);
    };

    // ⭐ Update Player Path
    const handlePathChange = (newPath) => {
        setPlayerPath(newPath);
        setValidationResult(null); // Clear previous validation
    };

    // ⭐ Run All Three Algorithms
    const runAlgorithms = useCallback(() => {
        if (!distanceMatrix || !homeCity || selectedCities.length === 0) {
            setError('Select at least one city!');
            return;
        }

        if (!playerName.trim()) {
            setError('Enter your name to play!');
            return;
        }

        setIsRunningAlgorithms(true);
        setError(null);
        setValidationResult(null);
        setGameSaved(false);

        try {
            const homeIndex = cityToIndex(homeCity);
            const targetIndices = selectedCities.map(cityToIndex);

            // Validate inputs
            if (homeIndex < 0 || homeIndex >= NUM_CITIES) {
                throw new Error('Invalid home city');
            }
            if (targetIndices.some(idx => idx < 0 || idx >= NUM_CITIES)) {
                throw new Error('Invalid target cities');
            }

            const results = {};

            // Algorithm 1: Brute Force
            try {
                const bruteForceResult = solveTSPBruteForce(distanceMatrix, homeIndex, targetIndices);
                results.bruteForce = bruteForceResult;
            } catch (err) {
                console.error('Brute Force error:', err);
                results.bruteForce = { error: err.message };
            }

            // Algorithm 2: Nearest Neighbor
            try {
                const nearestNeighborResult = solveTSPNearestNeighbor(distanceMatrix, homeIndex, targetIndices);
                results.nearestNeighbor = nearestNeighborResult;
            } catch (err) {
                console.error('Nearest Neighbor error:', err);
                results.nearestNeighbor = { error: err.message };
            }

            // Algorithm 3: Dynamic Programming
            try {
                const dpResult = solveTSPDynamicProgramming(distanceMatrix, homeIndex, targetIndices);
                results.dynamicProgramming = dpResult;
            } catch (err) {
                console.error('Dynamic Programming error:', err);
                results.dynamicProgramming = { error: err.message };
            }

            setAlgorithmResults(results);

            // Get optimal distance (use brute force if available, otherwise best of others)
            const optimalDistance = results.bruteForce?.distance ??
                Math.min(
                    results.nearestNeighbor?.distance ?? Infinity,
                    results.dynamicProgramming?.distance ?? Infinity
                );

            // Validate user's path if provided
            if (playerPath.length > 1) {
                const validation = validateUserPath(
                    playerPath,
                    homeCity,
                    selectedCities,
                    distanceMatrix,
                    optimalDistance
                );
                setValidationResult(validation);

                // Save to database only if correct
                if (validation.isCorrect) {
                    saveGameResult(results, optimalDistance);
                    // Update player stats in main hub
                    const totalTime = (results.bruteForce?.timeTaken || 0) +
                        (results.nearestNeighbor?.timeTaken || 0) +
                        (results.dynamicProgramming?.timeTaken || 0);
                    updatePlayerStats(playerName, true, totalTime);
                } else {
                    // Still update stats for played game (even if lost)
                    const totalTime = (results.bruteForce?.timeTaken || 0) +
                        (results.nearestNeighbor?.timeTaken || 0) +
                        (results.dynamicProgramming?.timeTaken || 0);
                    updatePlayerStats(playerName, false, totalTime);
                }
            }

        } catch (err) {
            setError(`Algorithm execution failed: ${err.message}`);
            console.error('Run algorithms error:', err);
        } finally {
            setIsRunningAlgorithms(false);
        }
    }, [distanceMatrix, homeCity, selectedCities, playerPath, playerName]);

    // ⭐ Save Game Result to Database (Only when correct)
    const saveGameResult = async (results, optimalDistance) => {
        if (gameSaved) return; // Prevent duplicate saves

        setIsSaving(true);
        setError(null);

        try {
            if (!distanceMatrix || !results) {
                throw new Error('Missing required game data');
            }

            // Clean distance matrix
            const cleanedDistanceMatrix = distanceMatrix.map(row =>
                row.map(val => (val === null || val === undefined || isNaN(val)) ? 0 : val)
            );

            // Get optimal path (prefer brute force)
            const optimalPath = results.bruteForce?.path ||
                results.dynamicProgramming?.path ||
                results.nearestNeighbor?.path || [];

            // Build payload
            const payload = {
                player_name: playerName.trim(),
                home_city: homeCity,
                selected_cities: selectedCities.join(', '),
                optimal_distance: optimalDistance,
                player_path: playerPath.join(' → '),
                player_distance: validationResult?.userDistance || 0,
                is_correct: true,

                algorithm_results: {
                    bruteForce: {
                        distance: results.bruteForce?.distance || null,
                        timeTaken: results.bruteForce?.timeTaken || null,
                        complexity: results.bruteForce?.complexity || null,
                        path: results.bruteForce?.path || []
                    },
                    nearestNeighbor: {
                        distance: results.nearestNeighbor?.distance || null,
                        timeTaken: results.nearestNeighbor?.timeTaken || null,
                        complexity: results.nearestNeighbor?.complexity || null,
                        path: results.nearestNeighbor?.path || []
                    },
                    dynamicProgramming: {
                        distance: results.dynamicProgramming?.distance || null,
                        timeTaken: results.dynamicProgramming?.timeTaken || null,
                        complexity: results.dynamicProgramming?.complexity || null,
                        path: results.dynamicProgramming?.path || []
                    }
                },

                distance_matrix: cleanedDistanceMatrix,
                game_round: gameRound
            };

            // Insert into Supabase
            const { data, error: dbError } = await supabase
                .from('traveling_salesman_table')
                .insert([payload])
                .select();

            if (dbError) {
                throw new Error(`Database error: ${dbError.message}`);
            }

            setGameSaved(true);
            console.log('Game saved successfully:', data[0]?.id);

        } catch (err) {
            setError(`Failed to save game: ${err.message}`);
            console.error('Save game error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // ⭐ Check Answer Button Handler
    const handleCheckAnswer = () => {
        if (playerPath.length < 3) {
            setError('Complete your route first!');
            return;
        }
        runAlgorithms();
    };

    if (!distanceMatrix || !homeCity) {
        return <div className="loading-container">Loading New Game...</div>;
    }

    return (
        <div className="app-layout">
            <header className="header" style={{ position: 'relative', zIndex: 10 }}>
                <h1>Traveling Salesman Challenge</h1>
                <p className="subtitle">Find the shortest route and beat the algorithms!</p>
            </header>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {gameSaved && (
                <div className="success-message">
                    ✓ Game saved successfully to database!
                </div>
            )}

            <div className="main-content">
                {/* Left Panel: Game Controls */}
                <div className="left-panel">
                    {/* Player Name Input */}
                    <div className="card">
                        <h3>Player</h3>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="player-name-input"
                            disabled={isRunningAlgorithms || gameSaved}
                        />
                    </div>

                    {/* City Selection */}
                    <div className="card">
                        <CitySelector
                            cities={CITIES}
                            homeCity={homeCity}
                            selectedCities={selectedCities}
                            onCityToggle={handleCityToggle}
                            disabled={isRunningAlgorithms || gameSaved}
                        />
                    </div>

                    {/* Path Builder */}
                    {selectedCities.length > 0 && (
                        <div className="card">
                            <PathBuilder
                                cities={CITIES}
                                homeCity={homeCity}
                                selectedCities={selectedCities}
                                onPathChange={handlePathChange}
                                distanceMatrix={distanceMatrix}
                                disabled={isRunningAlgorithms || gameSaved}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="card actions-panel">
                        <button
                            onClick={handleCheckAnswer}
                            disabled={isRunningAlgorithms || gameSaved || selectedCities.length === 0 || playerPath.length < 3}
                            className="primary-button"
                        >
                            {isRunningAlgorithms ? 'Calculating...' : 'Submit Answer'}
                        </button>

                        <button
                            onClick={() => setGameRound(g => g + 1)}
                            disabled={isRunningAlgorithms || isSaving}
                            className="secondary-button"
                        >
                            New Round
                        </button>
                    </div>

                    {/* Validation Result */}
                    {validationResult && (
                        <div className={`card validation-result ${validationResult.isCorrect ? 'correct' : 'incorrect'}`}>
                            {validationResult.isCorrect ? (
                                <>
                                    <div className="result-icon">🎉</div>
                                    <h3>Perfect!</h3>
                                    <p className="success-text">You found the shortest path!</p>
                                    <p className="result-distance">Distance: {validationResult.userDistance.toFixed(2)} km</p>
                                </>
                            ) : (
                                <>
                                    <div className="result-icon">❌</div>
                                    <h3>Not Optimal</h3>
                                    <p className="error-text">Your distance: {validationResult.userDistance.toFixed(2)} km</p>
                                    <p className="hint-text">Try a different route!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Visualization and Results */}
                <div className="right-panel">
                    {/* Distance Matrix Table */}
                    <div className="card cyberpunk-card">
                        <DistanceMatrixTable
                            cities={CITIES}
                            distanceMatrix={distanceMatrix}
                            homeCity={homeCity}
                            targetCities={selectedCities}
                            algorithmResults={algorithmResults}
                        />
                    </div>

                    {/* Algorithm Results */}
                    {algorithmResults && (
                        <div className="card">
                            <ResultsTable
                                results={algorithmResults}
                                validationResult={validationResult}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
