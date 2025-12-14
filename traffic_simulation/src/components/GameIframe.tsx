import { useState, useEffect } from 'react';
import { getGameConfig } from '../utils/gameLauncher';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

interface GameIframeProps {
  gameId: string;
  onBackToMenu: () => void;
}

export function GameIframe({ gameId, onBackToMenu }: GameIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const config = getGameConfig(gameId);

  useEffect(() => {
    // Reset loading state when game changes
    setIsLoading(true);
    setHasError(false);
  }, [gameId]);

  if (!config || !config.url) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Game Not Found</h2>
          <p className="text-gray-400 mb-4">The game configuration is missing.</p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </button>
          <h2 className="text-xl font-semibold text-white">{config.name}</h2>
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            setHasError(false);
            const iframe = document.getElementById(`game-iframe-${gameId}`) as HTMLIFrameElement;
            if (iframe) {
              iframe.src = iframe.src; // Reload iframe
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          title="Reload Game"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading {config.name}...</p>
            <p className="text-gray-400 text-sm mt-2">
              Make sure the game is running on port {config.port}
            </p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Game Not Available</h3>
            <p className="text-gray-400 mb-4">
              {config.name} is not running or not accessible.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Make sure the game is running on <code className="bg-gray-800 px-2 py-1 rounded">http://localhost:{config.port}</code>
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  const iframe = document.getElementById(`game-iframe-${gameId}`) as HTMLIFrameElement;
                  if (iframe) {
                    iframe.src = iframe.src;
                  }
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
              >
                Retry
              </button>
              <button
                onClick={onBackToMenu}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Iframe */}
      <iframe
        id={`game-iframe-${gameId}`}
        src={config.url}
        className="w-full h-full border-0"
        style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}
        onLoad={handleLoad}
        onError={handleError}
        title={config.name}
        allow="fullscreen"
      />
    </div>
  );
}

