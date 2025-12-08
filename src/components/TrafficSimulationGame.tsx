import { useState, useEffect } from 'react';
import { TrafficNetwork } from './TrafficNetwork';
import { GameInput } from './GameInput';
import { GameResult } from './GameResult';
import { Leaderboard } from './Leaderboard';
import { SystemStatus } from './SystemStatus';
import { fordFulkerson, edmondsKarp } from '../utils/maxFlowAlgorithms';
import { generateRandomGraph } from '../utils/graphGenerator';
import type { Edge } from '../utils/graphGenerator';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface GameState {
  edges: Edge[];
  phase: 'input' | 'running' | 'result';
  playerAnswer: number | undefined;
  correctAnswer: number | undefined;
  result: 'win' | 'lose' | undefined;
  algorithm1Time: number;
  algorithm2Time: number;
  playerName: string;
}

interface TrafficSimulationGameProps {
  onBackToMenu: () => void;
  user: { id: string; username: string } | null;
}

export function TrafficSimulationGame({ onBackToMenu, user }: TrafficSimulationGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    edges: generateRandomGraph(),
    phase: 'input',
    playerAnswer: undefined,
    correctAnswer: undefined,
    result: undefined,
    algorithm1Time: 0,
    algorithm2Time: 0,
    playerName: '',
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
  const [systemStatus, setSystemStatus] = useState<{
    status: 'READY' | 'RUNNING' | 'COMPLETE' | 'ERROR';
    lastRun: number;
    score: number;
  }>({
    status: 'READY',
    lastRun: 0,
    score: 0,
  });

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newEdges = generateRandomGraph();
    setGameState({
      edges: newEdges,
      phase: 'input',
      playerAnswer: undefined,
      correctAnswer: undefined,
      result: undefined,
      algorithm1Time: 0,
      algorithm2Time: 0,
      playerName: '',
    });
    setSystemStatus({
      status: 'READY',
      lastRun: 0,
      score: 0,
    });
  };

  const handleSubmitAnswer = async (answer: number) => {
    try {
      // Validate input
      if (answer < 0) {
        throw new Error('Maximum flow cannot be negative');
      }

      // Set status to running
      setSystemStatus({ status: 'RUNNING', lastRun: 0, score: systemStatus.score });

      // Run both algorithms and measure time
      const start1 = performance.now();
      const result1 = fordFulkerson(gameState.edges);
      const end1 = performance.now();
      const time1 = end1 - start1;

      const start2 = performance.now();
      const result2 = edmondsKarp(gameState.edges);
      const end2 = performance.now();
      const time2 = end2 - start2;

      // Verify both algorithms give same result
      if (result1 !== result2) {
        console.error('Algorithm mismatch!', { result1, result2 });
      }

      const correctAnswer = result1;
      const isCorrect = answer === correctAnswer;
      const totalTime = time1 + time2;

      // Update system status
      setSystemStatus({
        status: isCorrect ? 'COMPLETE' : 'ERROR',
        lastRun: totalTime,
        score: isCorrect ? systemStatus.score + 100 : systemStatus.score,
      });

      // Save to database if correct
      if (isCorrect && user) {
        await saveGameResult(user.username, correctAnswer, time1, time2);
      }

      // Update user stats
      if (user) {
        await updateUserStats(user.id, isCorrect, totalTime);
      }

      setGameState({
        ...gameState,
        phase: 'result',
        playerAnswer: answer,
        correctAnswer,
        result: isCorrect ? 'win' : 'lose',
        algorithm1Time: time1,
        algorithm2Time: time2,
        playerName: user?.username || 'Player',
      });

      if (isCorrect) {
        setRefreshLeaderboard(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setSystemStatus({ ...systemStatus, status: 'ERROR' });
      alert(error instanceof Error ? error.message : 'An error occurred while submitting your answer');
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      edges: generateRandomGraph(),
      phase: 'input',
      playerAnswer: undefined,
      correctAnswer: undefined,
      result: undefined,
      algorithm1Time: 0,
      algorithm2Time: 0,
      playerName: '',
    });
    setSystemStatus({ status: 'READY', lastRun: systemStatus.lastRun, score: systemStatus.score });
  };

  const saveGameResult = async (
    playerName: string,
    maxFlow: number,
    algo1Time: number,
    algo2Time: number
  ) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2f7c4d80/save-game`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            playerName,
            maxFlow,
            fordFulkersonTime: algo1Time,
            edmondsKarpTime: algo2Time,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save game result: ${errorText}`);
      }

      console.log('Game result saved successfully');
    } catch (error) {
      console.error('Error saving game result to database:', error);
      // Don't throw - allow game to continue even if save fails
    }
  };

  const updateUserStats = async (userId: string, won: boolean, timeTaken: number) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2f7c4d80/update-stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId,
            gameType: 'traffic',
            won,
            timeTaken,
          }),
        }
      );
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-cyan-500/50 p-8 shadow-cyan-500/20">
        {/* Tech corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400"></div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
            TRAFFIC SIMULATION // MAX FLOW PROTOCOL
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-2 rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/50 hover:shadow-green-400/70 border border-green-300"
            >
              <span className="relative z-10">{showLeaderboard ? '[ HIDE LEADERBOARD ]' : '[ SHOW LEADERBOARD ]'}</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 border border-purple-400"
            >
              <span className="relative z-10">&lt;&lt; BACK TO ALGOVERSE</span>
            </button>
          </div>
        </div>

        {showLeaderboard && (
          <div className="mb-8">
            <Leaderboard key={refreshLeaderboard} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-cyan-400 mb-4 tracking-wider border-l-4 border-cyan-400 pl-4 text-2xl">
              &gt;&gt; TRAFFIC NETWORK
            </h2>
            <p className="text-gray-400 mb-6 font-mono text-sm">
              [ OBJECTIVE ] Calculate maximum flow of vehicles per minute from source{' '}
              <span className="text-cyan-400 font-bold">A</span> to sink{' '}
              <span className="text-pink-400 font-bold">T</span>
            </p>
            <TrafficNetwork edges={gameState.edges} />
          </div>

          <div className="space-y-6">
            {/* System Status Panel */}
            <SystemStatus
              status={systemStatus.status}
              lastRun={systemStatus.lastRun}
              score={systemStatus.score}
            />

            {gameState.phase === 'input' && (
              <GameInput onSubmit={handleSubmitAnswer} />
            )}

            {gameState.phase === 'result' && (
              <GameResult
                result={gameState.result!}
                playerAnswer={gameState.playerAnswer!}
                correctAnswer={gameState.correctAnswer!}
                algorithm1Time={gameState.algorithm1Time}
                algorithm2Time={gameState.algorithm2Time}
                playerName={gameState.playerName}
                onPlayAgain={handlePlayAgain}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}