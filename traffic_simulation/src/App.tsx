import { useEffect, useState } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { BinaryTreeGame } from './components/BinaryTreeGame';
import { GameIframe } from './components/GameIframe';
import { GraphColoringGame } from './components/GraphColoringGame';
import { MainMenu } from './components/MainMenu';
import { PathfindingMazeGame } from './components/PathfindingMazeGame';
import { SortingRaceGame } from './components/SortingRaceGame';
import { TrafficSimulationGame } from './components/TrafficSimulationGame';
import { UserAuth } from './components/UserAuth';
import { UserProfile } from './components/UserProfile';

type GameType = 'menu' | 'traffic' | 'Snake' | 'Traveling' | 'Tower' | 'queens' | 'sorting' | 'pathfinding' | 'binarytree' | 'graphcoloring';

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('algoverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: { id: string; username: string }) => {
    setUser(userData);
    localStorage.setItem('algoverse_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('algoverse_user');
    setCurrentGame('menu');
    setShowProfile(false);
  };

  const handleSelectGame = (gameId: string) => {
    // All games now render inline (internal games directly, external games via iframe)
    setCurrentGame(gameId as GameType);
  };

  const renderGame = () => {
    if (showProfile && user) {
      return (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      );
    }

    switch (currentGame) {
      case 'traffic':
        return <TrafficSimulationGame onBackToMenu={() => setCurrentGame('menu')} user={user} />;
      case 'sorting':
        return <SortingRaceGame onBackToMenu={() => setCurrentGame('menu')} user={user} />;
      case 'pathfinding':
        return <PathfindingMazeGame onBackToMenu={() => setCurrentGame('menu')} user={user} />;
      case 'binarytree':
        return <BinaryTreeGame onBackToMenu={() => setCurrentGame('menu')} user={user} />;
      case 'graphcoloring':
        return <GraphColoringGame onBackToMenu={() => setCurrentGame('menu')} user={user} />;
      case 'Snake':
      case 'Traveling':
      case 'Tower':
      case 'queens':
        // External games embedded via iframe
        return <GameIframe gameId={currentGame} onBackToMenu={() => setCurrentGame('menu')} />;
      default:
        return (
          <MainMenu
            onSelectGame={handleSelectGame}
            user={user}
            onShowProfile={() => setShowProfile(true)}
          />
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        <AnimatedBackground />
        <UserAuth onLogin={handleLogin} />
      </div>
    );
  }

  // Don't show background/padding for iframe games (they need full screen)
  const isIframeGame = currentGame === 'Snake' || currentGame === 'Traveling' ||
    currentGame === 'Tower' || currentGame === 'queens';

  if (isIframeGame) {
    return renderGame();
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {renderGame()}
      </div>
    </div>
  );
}