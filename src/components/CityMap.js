// src/components/CityMap.js

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import Edge from './Edge';

// Responsive CityMap: computes positions based on container size
const CityMap = ({ cities = [], distanceMatrix = [[]], homeCity, targetCities = [], algorithmResults }) => {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 600, height: 520 });

    useEffect(() => {
        function updateSize() {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
            }
        }

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const { width, height } = size;
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.max(80, Math.min(width, height) / 2 - 80);

    // Generate coordinates for each city in circular layout
    const cityCoords = useMemo(() => {
        return cities.reduce((acc, city, i) => {
            const angle = (i / Math.max(1, cities.length)) * 2 * Math.PI - Math.PI / 2;
            acc[city] = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle),
            };
            return acc;
        }, {});
    }, [cities, center.x, center.y, radius]);

    const optimalPath = algorithmResults?.bruteForce?.path || [];
    const pathCityNames = optimalPath.map(index => cities[index]);

    const renderEdges = () => {
        const edges = [];
        for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
                const cityA = cities[i];
                const cityB = cities[j];
                const dist = (distanceMatrix?.[i]?.[j] ?? 0);

                let isOptimal = false;
                for (let k = 0; k < pathCityNames.length - 1; k++) {
                    const from = pathCityNames[k];
                    const to = pathCityNames[k + 1];
                    if ((from === cityA && to === cityB) || (from === cityB && to === cityA)) {
                        isOptimal = true;
                        break;
                    }
                }

                edges.push(
                    <Edge
                        key={`${cityA}-${cityB}`}
                        start={cityCoords[cityA]}
                        end={cityCoords[cityB]}
                        distance={dist}
                        isOptimal={isOptimal}
                    />
                );
            }
        }
        return edges;
    };

    const renderNodes = () => {
        return cities.map(city => {
            const coord = cityCoords[city] || { x: 0, y: 0 };
            const isHome = city === homeCity;
            const isTarget = targetCities.includes(city);

            let fillColor = '#7f8c8d';
            if (isHome) fillColor = '#e74c3c';
            else if (isTarget) fillColor = '#3498db';

            return (
                <React.Fragment key={city}>
                    <Circle
                        x={coord.x}
                        y={coord.y}
                        radius={14}
                        fill={fillColor}
                        stroke="#111"
                        strokeWidth={1}
                    />
                    <Text
                        x={coord.x}
                        y={coord.y}
                        text={city}
                        fontSize={12}
                        fill="white"
                        fontStyle="bold"
                        offsetX={-6}
                        offsetY={-6}
                    />
                </React.Fragment>
            );
        });
    };

    return (
        <div ref={containerRef} className="map-container">
            <Stage width={width} height={height}>
                <Layer>
                    {renderEdges()}
                    {renderNodes()}
                </Layer>
            </Stage>
        </div>
    );
};

export default CityMap;