import { useState, useEffect } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LeaderboardEntry {
  playerName: string;
  maxFlow: number;
  fordFulkersonTime: number;
  edmondsKarpTime: number;
  timestamp: string;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2f7c4d80/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch leaderboard: ${errorText}`);
      }

      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h2>
        <p className="text-gray-400 text-center py-8">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Leaderboard
        </h2>
        <p className="text-red-400 text-center py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Leaderboard - Recent Winners
      </h2>

      {entries.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No winners yet. Be the first!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="text-left py-3 px-2 text-gray-300">#</th>
                <th className="text-left py-3 px-2 text-gray-300">Player</th>
                <th className="text-left py-3 px-2 text-gray-300">Max Flow</th>
                <th className="text-left py-3 px-2 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Ford-Fulkerson
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Edmonds-Karp
                  </div>
                </th>
                <th className="text-left py-3 px-2 text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 ${
                    index < 3 ? 'bg-yellow-900/20' : 'hover:bg-gray-700/30'
                  }`}
                >
                  <td className="py-3 px-2">
                    {index === 0 && <span className="text-yellow-400">🥇</span>}
                    {index === 1 && <span className="text-gray-400">🥈</span>}
                    {index === 2 && <span className="text-orange-400">🥉</span>}
                    {index > 2 && <span className="text-gray-500">{index + 1}</span>}
                  </td>
                  <td className="py-3 px-2 text-white">{entry.playerName}</td>
                  <td className="py-3 px-2 text-white">{entry.maxFlow}</td>
                  <td className="py-3 px-2 text-gray-400">
                    {entry.fordFulkersonTime.toFixed(3)} ms
                  </td>
                  <td className="py-3 px-2 text-gray-400">
                    {entry.edmondsKarpTime.toFixed(3)} ms
                  </td>
                  <td className="py-3 px-2 text-gray-400">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}