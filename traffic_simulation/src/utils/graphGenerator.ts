export interface Edge {
  from: string;
  to: string;
  capacity: number;
}

// Generate random capacity between 5 and 15
const randomCapacity = (): number => {
  return Math.floor(Math.random() * 11) + 5; // 5 to 15 inclusive
};

export const generateRandomGraph = (): Edge[] => {
  // Define all edges according to the specification
  const edgeDefinitions: Array<[string, string]> = [
    ['A', 'B'],
    ['A', 'C'],
    ['A', 'D'],
    ['B', 'E'],
    ['B', 'F'],
    ['C', 'E'],
    ['C', 'F'],
    ['D', 'F'],
    ['E', 'G'],
    ['E', 'H'],
    ['F', 'H'],
    ['G', 'T'],
    ['H', 'T'],
  ];

  // Generate edges with random capacities
  const edges: Edge[] = edgeDefinitions.map(([from, to]) => ({
    from,
    to,
    capacity: randomCapacity(),
  }));

  return edges;
};
