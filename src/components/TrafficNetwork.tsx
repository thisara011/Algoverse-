import type { Edge } from "../utils/graphGenerator";

// Node positions on the canvas
const nodePositions: Record<string, { x: number; y: number }> =
  {
    A: { x: 100, y: 250 },
    B: { x: 250, y: 100 },
    C: { x: 250, y: 250 },
    D: { x: 250, y: 400 },
    E: { x: 400, y: 100 },
    F: { x: 400, y: 300 },
    G: { x: 550, y: 100 },
    H: { x: 550, y: 300 },
    T: { x: 700, y: 200 },
  };

interface TrafficNetworkProps {
  edges: Edge[];
}

export function TrafficNetwork({ edges }: TrafficNetworkProps) {
  return (
    <div className="bg-black/90 rounded-xl p-8 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 relative overflow-hidden">
      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <svg
        width="100%"
        height="500"
        viewBox="0 0 800 500"
        className="relative z-10"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur
              stdDeviation="4"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arrow marker - Cyan */}
          <marker
            id="arrowhead-cyan"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#06b6d4" />
          </marker>
        </defs>

        {/* Draw edges with cyberpunk glow and animated particles */}
        {edges.map((edge, index) => {
          const fromPos = nodePositions[edge.from];
          const toPos = nodePositions[edge.to];
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;

          // Calculate edge length for animation
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          return (
            <g key={index}>
              {/* Glow line */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#06b6d4"
                strokeWidth="4"
                opacity="0.3"
                filter="url(#glow)"
              />
              {/* Main line */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#06b6d4"
                strokeWidth="2"
                markerEnd="url(#arrowhead-cyan)"
              />

              {/* Animated flowing particles */}
              <circle r="4" fill="#06b6d4" filter="url(#glow)">
                <animateMotion
                  dur={`${length / 50}s`}
                  repeatCount="indefinite"
                  path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                />
              </circle>

              {/* Second particle with delay */}
              <circle r="3" fill="#a855f7" filter="url(#glow)">
                <animateMotion
                  dur={`${length / 50}s`}
                  repeatCount="indefinite"
                  path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                  begin={`${length / 100}s`}
                />
              </circle>

              {/* Capacity label with cyberpunk styling */}
              <g>
                <rect
                  x={midX - 20}
                  y={midY - 15}
                  width="40"
                  height="30"
                  fill="#0c0c0c"
                  stroke="#a855f7"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={midX}
                  y={midY + 5}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="16"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {edge.capacity}
                </text>
              </g>
            </g>
          );
        })}

        {/* Draw nodes with neon glow */}
        {Object.entries(nodePositions).map(([node, pos]) => {
          const isSource = node === "A";
          const isSink = node === "T";
          const nodeColor = isSource
            ? "#06b6d4"
            : isSink
              ? "#ec4899"
              : "#a855f7";
          const glowColor = isSource
            ? "#06b6d4"
            : isSink
              ? "#ec4899"
              : "#a855f7";

          return (
            <g key={node}>
              {/* Outer glow - pulsing */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="35"
                fill={glowColor}
                opacity="0.2"
                filter="url(#glow)"
              >
                <animate
                  attributeName="r"
                  values="35;40;35"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.4;0.2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill="#000"
                stroke={nodeColor}
                strokeWidth="3"
              />
              {/* Inner glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill={nodeColor}
                opacity="0.1"
              />
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fill={nodeColor}
                fontSize="20"
                fontFamily="monospace"
                fontWeight="bold"
                className="select-none"
              >
                {node}
              </text>
              {/* Labels for source and sink */}
              {isSource && (
                <text
                  x={pos.x}
                  y={pos.y - 45}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="11"
                  fontFamily="monospace"
                  className="select-none"
                >
                  [SOURCE]
                </text>
              )}
              {isSink && (
                <text
                  x={pos.x}
                  y={pos.y - 45}
                  textAnchor="middle"
                  fill="#ec4899"
                  fontSize="11"
                  fontFamily="monospace"
                  className="select-none"
                >
                  [SINK]
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}