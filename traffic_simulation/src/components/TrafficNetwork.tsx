import type { Edge } from "../utils/graphGenerator";

// Node positions on the canvas - MUCH LARGER SCALE
const nodePositions: Record<string, { x: number; y: number }> =
{
  A: { x: 150, y: 400 },
  B: { x: 400, y: 150 },
  C: { x: 400, y: 400 },
  D: { x: 400, y: 650 },
  E: { x: 700, y: 150 },
  F: { x: 700, y: 500 },
  G: { x: 1000, y: 150 },
  H: { x: 1000, y: 500 },
  T: { x: 1250, y: 325 },
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
        height="800"
        viewBox="0 0 1400 800"
        className="relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur
              stdDeviation="6"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arrow marker - Cyan - LARGER */}
          <marker
            id="arrowhead-cyan"
            markerWidth="18"
            markerHeight="18"
            refX="16"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 18 5, 0 10" fill="#06b6d4" />
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
              {/* Glow line - THICKER */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#06b6d4"
                strokeWidth="12"
                opacity="0.3"
                filter="url(#glow)"
              />
              {/* Main line - THICKER */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#06b6d4"
                strokeWidth="6"
                markerEnd="url(#arrowhead-cyan)"
              />

              {/* Animated flowing particles - LARGER */}
              <circle r="8" fill="#06b6d4" filter="url(#glow)">
                <animateMotion
                  dur={`${length / 50}s`}
                  repeatCount="indefinite"
                  path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                />
              </circle>

              {/* Second particle with delay - LARGER */}
              <circle r="6" fill="#a855f7" filter="url(#glow)">
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
                  x={midX - 40}
                  y={midY - 28}
                  width="80"
                  height="56"
                  fill="#0c0c0c"
                  stroke="#a855f7"
                  strokeWidth="3"
                  rx="6"
                />
                <text
                  x={midX}
                  y={midY + 10}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="28"
                  fontFamily="monospace"
                  fontWeight="bold"
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
                r="65"
                fill={glowColor}
                opacity="0.2"
                filter="url(#glow)"
              >
                <animate
                  attributeName="r"
                  values="65;72;65"
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
                r="50"
                fill="#000"
                stroke={nodeColor}
                strokeWidth="4"
              />
              {/* Inner glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="42"
                fill={nodeColor}
                opacity="0.1"
              />
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y + 12}
                textAnchor="middle"
                fill={nodeColor}
                fontSize="38"
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
                  y={pos.y - 75}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="16"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="select-none"
                >
                  [SOURCE]
                </text>
              )}
              {isSink && (
                <text
                  x={pos.x}
                  y={pos.y - 75}
                  textAnchor="middle"
                  fill="#ec4899"
                  fontSize="16"
                  fontFamily="monospace"
                  fontWeight="bold"
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
