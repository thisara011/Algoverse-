import { Clock, LogOut, Target, Trophy, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserProfileProps {
  user: { id: string; username: string; email?: string };
  onClose: () => void;
  onLogout: () => void;
}

interface UserStats {
  totalGames: number;
  totalWins: number;
  totalTime: number;
  gameStats: {
    traffic: { played: number; won: number };
    Snake: { played: number; won: number };
    Traveling: { played: number; won: number };
    Tower: { played: number; won: number };
    queens: { played: number; won: number };
  };
}

export function UserProfile({ user, onClose, onLogout }: UserProfileProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2f7c4d80/user-stats?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const winRate = stats && stats.totalGames > 0
    ? ((stats.totalWins / stats.totalGames) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Player Profile
          </h1>
          <button
            onClick={onClose}
            className="bg-gray-700 text-gray-300 p-2 rounded-lg hover:bg-gray-600 transition-colors"
            aria-label="Close profile"
            title="Close profile"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white mb-1">{user.username}</h2>
            <p className="text-gray-400">Algoverse Explorer</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stats...</p>
          </div>
        ) : (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <Target className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-white mb-1">{stats?.totalGames || 0}</div>
                <p className="text-gray-400 text-sm">Games Played</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="text-white mb-1">{stats?.totalWins || 0}</div>
                <p className="text-gray-400 text-sm">Wins</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-white mb-1">{winRate}%</div>
                <p className="text-gray-400 text-sm">Win Rate</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <Clock className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-white mb-1">{Math.round((stats?.totalTime || 0) / 1000)}s</div>
                <p className="text-gray-400 text-sm">Total Time</p>
              </div>
            </div>

            {/* Game-specific Stats */}
            <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
              <h3 className="text-white mb-4">Game Statistics</h3>
              <div className="space-y-3">
                {[
                  { key: 'traffic', name: 'Traffic Simulation', color: 'blue' },
                  { key: 'Snake', name: 'Snake and Ladder', color: 'purple' },
                  { key: 'Traveling', name: 'Traveling Salesman', color: 'green' },
                  { key: 'Tower', name: 'Tower of Hanoi', color: 'orange' },
                  { key: 'queens', name: 'Eight Queens Puzzle', color: 'yellow' },
                ].map(game => {
                  const gameStats = stats?.gameStats[game.key as keyof typeof stats.gameStats];
                  const played = gameStats?.played || 0;
                  const won = gameStats?.won || 0;
                  const rate = played > 0 ? ((won / played) * 100).toFixed(0) : '0';

                  // Color classes for Tailwind
                  const colorClasses = {
                    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    green: 'bg-green-500/20 text-green-400 border-green-500/30',
                    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                  };

                  return (
                    <div key={game.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">{game.name}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Played: <span className="text-white">{played}</span></span>
                        <span className="text-gray-400">Won: <span className="text-green-400">{won}</span></span>
                        <span className={`px-3 py-1 rounded-full border ${colorClasses[game.color as keyof typeof colorClasses]}`}>
                          {rate}% win rate
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}