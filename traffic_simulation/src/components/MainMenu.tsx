import { Network, ArrowUpDown, MapPin, Binary, Palette, User } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (game: string) => void;
  user: { id: string; username: string; email?: string } | null;
  onShowProfile: () => void;
}

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

export function MainMenu({ onSelectGame, user, onShowProfile }: MainMenuProps) {
  const games: GameCard[] = [
    {
      id: 'traffic',
      title: 'Traffic Simulation',
      description: 'Master maximum flow algorithms through traffic networks',
      icon: <Network className="w-12 h-12" />,
      color: 'from-blue-500 to-cyan-500',
      glowColor: 'shadow-blue-500/50',
    },

    {
      id: 'Snake',
      title: 'Snake and Ladder',
      description: 'Compete with sorting algorithms in real-time visualization',
      icon: <ArrowUpDown className="w-12 h-12" />,
      color: 'from-purple-500 to-pink-500',
      glowColor: 'shadow-purple-500/50',
    },
    {  
      id: 'Traveling',
      title: 'Traveling Salesman',
      description: 'Navigate through mazes using A* and Dijkstra algorithms',
      icon: <MapPin className="w-12 h-12" />,
      color: 'from-green-500 to-emerald-500',
      glowColor: 'shadow-green-500/50',
    },
    {
      id: 'Tower',
      title: 'Tower of Hanoi',
      description: 'Build and balance binary search trees with operations',
      icon: <Binary className="w-12 h-12" />,
      color: 'from-orange-500 to-red-500',
      glowColor: 'shadow-orange-500/50',
    },
    {
      id: 'queens',
      title: 'Eight queens puzzle',
      description: 'Solve graph coloring problems with minimum colors',
      icon: <Palette className="w-12 h-12" />,
      color: 'from-yellow-500 to-amber-500',
      glowColor: 'shadow-yellow-500/50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with User Info */}
      <div className="flex justify-between items-center mb-8">
        <div className="animate-float">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            ALGOVERSE
          </h1>
          <p className="text-gray-400 text-xl">
            Master algorithms through interactive gaming
          </p>
        </div>
        {user && (
          <button
            onClick={onShowProfile}
            className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-lg px-6 py-3 rounded-xl border border-gray-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm">{user.username}</p>
              <p className="text-gray-400 text-xs">View Profile</p>
            </div>
          </button>
        )}
      </div>

      <div className="mb-8 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="group relative"
            style={{
              animation: `float 3s ease-in-out infinite ${index * 0.2}s`,
            }}
          >
            <div
              className={`bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${game.glowColor} h-full`}
            >
              {/* Icon Container */}
              <div
                className={`w-20 h-20 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 mx-auto`}
              >
                {game.icon}
              </div>

              {/* Title */}
              <h3 className="text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {game.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {game.description}
              </p>

              {/* Play Button */}
              <div className="mt-4">
                <span
                  className={`inline-block bg-gradient-to-r ${game.color} text-white px-6 py-2 rounded-lg group-hover:shadow-lg transition-all duration-300`}
                >
                  Launch Game
                </span>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
              ></div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-12 bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-blue-400 mb-1">5</div>
            <p className="text-gray-400">Algorithm Challenges</p>
          </div>
          <div>
            <div className="text-purple-400 mb-1">∞</div>
            <p className="text-gray-400">Learning Opportunities</p>
          </div>
          <div>
            <div className="text-pink-400 mb-1">🎮</div>
            <p className="text-gray-400">Interactive Gaming</p>
          </div>
        </div>
      </div>
    </div>
  );
}