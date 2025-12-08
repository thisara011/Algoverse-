// src/App.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css'; // Add basic styling later

import { generateDistanceMatrix, indexToCity, cityToIndex } from './lib/utils';
import { solveTSPBruteForce } from './lib/tsp';

const NUM_CITIES = 10; // Cities A through J
const CITIES = Array.from({ length: NUM_CITIES }, (_, i) => indexToCity(i));

function App() {
    // Game State
    const [distanceMatrix, setDistanceMatrix] = useState(null);
    const [homeCity, setHomeCity] = useState(CITIES[0]); // Default to City A
    const [targetCities, setTargetCities] = useState([]); // Cities the player must visit
    const [playerPath, setPlayerPath] = useState([]);
    const [gameRound, setGameRound] = useState(1);
    
    // Algorithm Result State
    const [algorithmResults, setAlgorithmResults] = useState(null);

    // 1. Initialize a new game round
    const startNewGame = useCallback(() => {
        // Randomly generate the distance matrix
        const newMatrix = generateDistanceMatrix(NUM_CITIES);
        setDistanceMatrix(newMatrix);

        // Choose a random home city
        const randomHomeIndex = Math.floor(Math.random() * NUM_CITIES);
        setHomeCity(indexToCity(randomHomeIndex));

        // Randomly select 3-5 target cities (excluding the home city)
        let potentialTargets = CITIES.filter(city => city !== indexToCity(randomHomeIndex));
        let shuffledTargets = potentialTargets.sort(() => 0.5 - Math.random());
        const numTargets = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // 3 to 5 targets
        setTargetCities(shuffledTargets.slice(0, numTargets));
        
        // Reset player state
        setPlayerPath([]);
        setAlgorithmResults(null);
    }, []);

    useEffect(() => {
        startNewGame();
    }, [startNewGame, gameRound]); // Runs on component mount and new round start

    // Function to run the algorithms
    const runAlgorithms = () => {
        if (!distanceMatrix || targetCities.length === 0) return;

        const homeIndex = cityToIndex(homeCity);
        const targetIndices = targetCities.map(cityToIndex);

        const bruteForceResult = solveTSPBruteForce(
            distanceMatrix,
            homeIndex,
            targetIndices
        );

        // In a full implementation, you'd call Dynamic Programming and Heuristic here too.
        setAlgorithmResults({
            bruteForce: bruteForceResult,
            // dp: solveTSPDP(...),
            // heuristic: solveTSPHeuristic(...),
        });
        
        // After running the algorithms, you would save this data to a database.
        // (This would require a backend setup, which is out of scope for a simple React frontend.)
    };

    // Placeholder for the player making a guess
    const handleSubmitGuess = () => {
        // In the real game, you would calculate the playerPath distance here
        // and compare it to the bruteForceResult.distance.
        // For simplicity, we'll just run the algorithms when the player submits.
        runAlgorithms();
    };

    if (!distanceMatrix) {
        return <div className="loading">Loading New Game...</div>;
    }

    return (
        <div className="app-container">
            <header>
                <h1>🗺️ Traveling Salesman Game - Round {gameRound}</h1>
            </header>
            
            <section className="game-info">
                <p>
                    **Home City:** **{homeCity}** | **Cities to Visit (Exactly Once):** **{targetCities.join(', ')}**
                </p>
                <p className="task-description">
                    *Task:* Find the shortest route that starts at **{homeCity}**, visits all cities: **{targetCities.join(', ')}**, and returns to **{homeCity}**.
                </p>
                <button onClick={runAlgorithms} disabled={algorithmResults !== null}>
                    Show Shortest Route (Run Algorithms)
                </button>
            </section>

            <hr />

            <section className="map-view">
                ## 📍 Distance Matrix (The Map)
                <p>The distances are randomly assigned between 50 and 100 km.</p>
                {/*  */}
                
                {/* Display the Distance Matrix for the game */}
                <table className="distance-table">
                    <thead>
                        <tr>
                            <th>City</th>
                            {CITIES.map(c => <th key={c}>{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {CITIES.map((rowCity, i) => (
                            <tr key={i}>
                                <td>**{rowCity}**</td>
                                {CITIES.map((colCity, j) => (
                                    <td key={j}>
                                        {i === j ? '---' : distanceMatrix[i][j]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            <hr />
            
            {algorithmResults && (
                <section className="results">
                    ## 📊 Algorithmic Comparison
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Algorithm</th>
                                <th>Shortest Route</th>
                                <th>Distance (km)</th>
                                <th>Time Taken (ms)</th>
                                <th>Complexity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>**Brute Force**</td>
                                <td>{algorithmResults.bruteForce.path.join(' -> ')}</td>
                                <td>**{algorithmResults.bruteForce.distance}**</td>
                                <td>{algorithmResults.bruteForce.timeTaken.toFixed(4)}</td>
                                <td>$O(n!)$</td>
                            </tr>
                            {/* You would add DP and Heuristic results here */}
                            <tr>
                                <td>Dynamic Programming</td>
                                <td>*Implementation pending*</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>$O(n^2 2^n)$</td>
                            </tr>
                            <tr>
                                <td>Nearest Neighbor (Heuristic)</td>
                                <td>*Implementation pending*</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>$O(n^2)$</td>
                            </tr>
                        </tbody>
                    </table>

                    <button onClick={() => setGameRound(r => r + 1)}>
                        Start Next Round
                    </button>
                </section>
            )}
            
            <hr />

            <section className="player-interface">
                ## 🎮 Player's Guess
                <p>
                    *Current Path (Click cities on the map component to select them):* **{playerPath.length > 0 ? playerPath.join(' -> ') : 'Not started'}**
                </p>
                <button onClick={handleSubmitGuess} disabled={algorithmResults !== null}>
                    Submit Route & Compare
                </button>
                <p className="note">*(Player selection logic is simplified for this demo)*</p>
            </section>
        </div>
    );
}

export default App;