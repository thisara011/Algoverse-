import { ArrowLeft } from 'lucide-react';

interface SortingRaceGameProps {
  onBackToMenu: () => void;
  user: { id: string; username: string } | null;
}

export function SortingRaceGame({ onBackToMenu }: SortingRaceGameProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Sorting Race
          </h1>
          <button
            onClick={onBackToMenu}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Algoverse
          </button>
        </div>

        <div className="text-center py-20">
          <div className="bg-purple-900/30 backdrop-blur-lg rounded-xl p-12 border-2 border-purple-500">
            <h2 className="text-white mb-4">Coming Soon!</h2>
            <p className="text-gray-300 mb-6">
              Race against different sorting algorithms including Bubble Sort, Quick Sort, Merge Sort, and more!
            </p>
            <div className="text-6xl mb-4">🏁</div>
            <p className="text-gray-400">
              This game is under development. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}