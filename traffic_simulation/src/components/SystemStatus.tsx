import { Activity } from 'lucide-react';

interface SystemStatusProps {
  status?: 'READY' | 'RUNNING' | 'COMPLETE' | 'ERROR';
  lastRun?: number;
  score?: number;
}

export function SystemStatus({ status = 'READY', lastRun = 0, score = 0 }: SystemStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'READY':
        return 'text-green-400';
      case 'RUNNING':
        return 'text-yellow-400';
      case 'COMPLETE':
        return 'text-blue-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="bg-black/90 border-2 border-cyan-500/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20 relative overflow-hidden">
      {/* Animated scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 animate-scan" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
        }}></div>
      </div>

      <div className="space-y-3 relative z-10">
        {/* System Status */}
        <div className="border-l-4 border-cyan-500 pl-3 bg-cyan-500/5 py-2">
          <div className="text-cyan-400/70 text-xs tracking-widest mb-1 font-mono">SYSTEM STATUS:</div>
          <div className={`text-lg tracking-wide font-mono ${getStatusColor()} drop-shadow-[0_0_8px_currentColor]`}>
            {status}
          </div>
        </div>

        {/* Last Run */}
        <div className="border-l-4 border-purple-500 pl-3 bg-purple-500/5 py-2">
          <div className="text-purple-400/70 text-xs tracking-widest mb-1 font-mono">LAST RUN:</div>
          <div className="text-white text-base font-mono">
            {lastRun > 0 ? `${lastRun.toFixed(2)}ms` : '0.00ms'}
          </div>
        </div>

        {/* Score */}
        <div className="border-l-4 border-pink-500 pl-3 bg-pink-500/5 py-2">
          <div className="text-pink-400/70 text-xs tracking-widest mb-1 font-mono">SCORE:</div>
          <div className="text-white text-base flex items-center gap-2 font-mono">
            {score}
            {score > 0 && <Activity className="w-4 h-4 text-green-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
          </div>
        </div>
      </div>
    </div>
  );
}