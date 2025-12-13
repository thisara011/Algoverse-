import { CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';

interface GameResultProps {
  playerAnswer: number;
  correctAnswer: number;
  result: 'win' | 'lose';
  algorithm1Time: number;
  algorithm2Time: number;
  playerName: string;
  onPlayAgain: () => void;
}

export function GameResult({
  result,
  playerAnswer,
  correctAnswer,
  algorithm1Time,
  algorithm2Time,
  playerName,
  onPlayAgain,
}: GameResultProps) {
  const isCorrect = result === 'win';

  return (
    <div
      className={`backdrop-blur-lg rounded-xl p-8 shadow-lg border-2 relative overflow-hidden ${
        isCorrect
          ? 'bg-green-900/20 border-green-500 shadow-green-500/50'
          : 'bg-red-900/20 border-red-500 shadow-red-500/50'
      }`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            isCorrect ? 'bg-green-500/5' : 'bg-red-500/5'
          } animate-pulse`}
        ></div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${
              isCorrect ? '#10b981' : '#ef4444'
            } 2px, ${isCorrect ? '#10b981' : '#ef4444'} 4px)`,
          }}
        ></div>
      </div>

      <div className="text-center relative z-10">
        {isCorrect ? (
          <>
            <CheckCircle
              className="w-20 h-20 text-green-400 mx-auto mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]"
            />
            <h2
              className="text-green-400 mb-4 tracking-wider text-3xl font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            >
              &gt;&gt; ACCESS GRANTED &lt;&lt;
            </h2>
            <p className="text-green-300 mb-6 font-mono text-sm">
              [ CORRECT CALCULATION ] User: <span className="text-cyan-400">{playerName}</span>
            </p>
          </>
        ) : (
          <>
            <XCircle
              className="w-20 h-20 text-red-400 mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            />
            <h2
              className="text-red-400 mb-4 tracking-wider text-3xl font-mono drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            >
              &gt;&gt; ACCESS DENIED &lt;&lt;
            </h2>
            <p className="text-red-300 mb-6 font-mono text-sm">
              [ INCORRECT CALCULATION ] Try again!
            </p>
          </>
        )}

        <div className="bg-black/60 rounded-lg p-6 mb-6 space-y-3 border border-cyan-500/30">
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2">
            <span className="text-gray-400 font-mono text-sm">YOUR ANSWER:</span>
            <span
              className={`text-xl font-mono ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {playerAnswer}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2">
            <span className="text-gray-400 font-mono text-sm">CORRECT ANSWER:</span>
            <span className="text-cyan-400 text-xl font-mono">{correctAnswer}</span>
          </div>
          <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2">
            <span className="text-gray-400 font-mono text-sm">FORD-FULKERSON:</span>
            <span className="text-purple-400 font-mono">
              {algorithm1Time.toFixed(3)}ms
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-mono text-sm">EDMONDS-KARP:</span>
            <span className="text-purple-400 font-mono">
              {algorithm2Time.toFixed(3)}ms
            </span>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 flex items-center justify-center gap-2 border-2 border-purple-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <RotateCcw className="w-5 h-5 relative z-10" />
          <span className="relative z-10 tracking-wider font-mono">[ GENERATE NEW NETWORK ]</span>
        </button>
      </div>
    </div>
  );
}