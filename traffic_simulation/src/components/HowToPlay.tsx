export function HowToPlay() {
  return (
    <div className="bg-black/90 backdrop-blur-lg rounded-lg p-5 shadow-lg border-2 border-purple-500/50 shadow-purple-500/20 relative overflow-hidden h-full">
      <h3 className="text-purple-400 mb-3 flex items-center gap-2 font-mono tracking-wide text-sm">
        <span className="text-purple-400">▶</span>
        <span>HOW TO PLAY</span>
      </h3>
      <ul className="text-gray-400 text-xs space-y-1.5 font-mono">
        <li className="flex items-start gap-2">
          <span className="text-cyan-400 mt-0.5">◆</span>
          <span>Analyze the traffic network graph from source <strong className="text-cyan-400">A</strong> to sink <strong className="text-pink-400">T</strong></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400 mt-0.5">◆</span>
          <span>Each edge shows the maximum vehicle capacity per minute</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400 mt-0.5">◆</span>
          <span>Calculate the maximum flow using network algorithms</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400 mt-0.5">◆</span>
          <span>Enter your answer and submit to see if you&apos;re correct!</span>
        </li>
      </ul>
    </div>
  );
}

