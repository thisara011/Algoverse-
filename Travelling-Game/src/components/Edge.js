// src/components/Edge.js

import React from 'react';
import { Line, Text } from 'react-konva';

const Edge = ({ start, end, distance, isOptimal }) => {
    const linePoints = [start.x, start.y, end.x, end.y];

    // Calculate midpoint for distance label
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
        <React.Fragment>
            {/* Draw the main line/edge */}
            <Line
                points={linePoints}
                stroke={isOptimal ? 'green' : '#ccc'}
                strokeWidth={isOptimal ? 4 : 1}
                // Dotted line for non-optimal edges
                dash={isOptimal ? [0] : [5, 5]} 
                lineCap="round"
                lineJoin="round"
                opacity={0.7}
            />
            {/* Draw the distance label */}
            <Text
                x={midX}
                y={midY}
                text={distance.toString()}
                fontSize={12}
                fill={isOptimal ? 'darkgreen' : '#333'}
                fontStyle="bold"
                offsetX={-5}
                offsetY={-15}
            />
        </React.Fragment>
    );
};

export default Edge;