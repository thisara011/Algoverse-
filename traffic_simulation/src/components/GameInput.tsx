import { useState } from 'react';
import { Send } from 'lucide-react';

interface GameInputProps {
  onSubmit: (answer: number) => void;
}

export function GameInput({ onSubmit }: GameInputProps) {
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState<{
    answer?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate answer
    const numAnswer = parseInt(answer, 10);

    if (answer.trim() === '' || isNaN(numAnswer)) {
      setErrors({ answer: 'Please enter a valid number' });
      return;
    }

    if (numAnswer < 0) {
      setErrors({ answer: 'Maximum flow cannot be negative' });
      return;
    }

    onSubmit(numAnswer);
  };

  return (
    <div className="bg-black/90 backdrop-blur-lg rounded-xl p-8 shadow-lg border-2 border-cyan-500/50 shadow-cyan-500/20 relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
        }}></div>
      </div>

      <h2 className="text-cyan-400 mb-6 tracking-wider border-l-4 border-cyan-400 pl-4 relative z-10">
        &gt;&gt; INPUT TERMINAL
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label htmlFor="maxFlow" className="block text-cyan-300 mb-2 font-mono text-sm tracking-wide">
            [ MAXIMUM FLOW ] (vehicles/minute)
          </label>
          <input
            id="maxFlow"
            type="text"
            value={answer}
            onChange={e => {
              setAnswer(e.target.value);
              if (errors.answer) {
                setErrors({ ...errors, answer: undefined });
              }
            }}
            className={`w-full px-4 py-3 bg-black border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-cyan-400 font-mono text-lg shadow-inner ${
              errors.answer ? 'border-red-500 shadow-red-500/50' : 'border-cyan-500/50 shadow-cyan-500/20'
            }`}
            placeholder="Enter maximum flow..."
          />
          {errors.answer && (
            <p className="text-red-400 text-sm mt-1 font-mono flex items-center gap-2">
              <span>⚠</span> {errors.answer}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-4 px-6 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 flex items-center justify-center gap-2 border-2 border-cyan-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Send className="w-5 h-5 relative z-10" />
          <span className="relative z-10 tracking-wider">[ SUBMIT ANSWER ]</span>
        </button>
      </form>

      <div className="mt-8 p-4 bg-purple-900/20 rounded-lg border-2 border-purple-500/50 relative z-10">
        <h3 className="text-purple-400 mb-3 flex items-center gap-2 font-mono tracking-wide">
          <span className="text-cyan-400">▶</span>
          HOW TO PLAY
        </h3>
        <ul className="text-gray-400 text-sm space-y-2 font-mono">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">◆</span>
            <span>Analyze the traffic network graph from source <strong className="text-cyan-400">A</strong> to sink <strong className="text-pink-400">T</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">◆</span>
            <span>Each edge shows the maximum vehicle capacity per minute</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">◆</span>
            <span>Calculate the maximum flow using network algorithms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">◆</span>
            <span>Enter your answer and submit to see if you&apos;re correct!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}