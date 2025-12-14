import { Edge } from './graphGenerator';

// Build adjacency list representation
const buildGraph = (edges: Edge[]): Map<string, Map<string, number>> => {
  const graph = new Map<string, Map<string, number>>();

  edges.forEach(edge => {
    if (!graph.has(edge.from)) {
      graph.set(edge.from, new Map());
    }
    graph.get(edge.from)!.set(edge.to, edge.capacity);

    // Add reverse edge with 0 capacity for residual graph
    if (!graph.has(edge.to)) {
      graph.set(edge.to, new Map());
    }
    if (!graph.get(edge.to)!.has(edge.from)) {
      graph.get(edge.to)!.set(edge.from, 0);
    }
  });

  return graph;
};

// Ford-Fulkerson algorithm using DFS
export const fordFulkerson = (edges: Edge[]): number => {
  const graph = buildGraph(edges);
  const source = 'A';
  const sink = 'T';

  // DFS to find augmenting path
  const dfs = (
    node: string,
    visited: Set<string>,
    path: string[],
    minCapacity: number
  ): { found: boolean; bottleneck: number; path: string[] } => {
    if (node === sink) {
      return { found: true, bottleneck: minCapacity, path: [...path, node] };
    }

    visited.add(node);
    const neighbors = graph.get(node);

    if (neighbors) {
      for (const [neighbor, capacity] of neighbors.entries()) {
        if (!visited.has(neighbor) && capacity > 0) {
          const result = dfs(
            neighbor,
            visited,
            [...path, node],
            Math.min(minCapacity, capacity)
          );

          if (result.found) {
            return result;
          }
        }
      }
    }

    return { found: false, bottleneck: 0, path: [] };
  };

  let maxFlow = 0;
  let iterations = 0;
  const maxIterations = 1000; // Prevent infinite loops

  // Keep finding augmenting paths
  while (iterations < maxIterations) {
    const visited = new Set<string>();
    const result = dfs(source, visited, [], Infinity);

    if (!result.found || result.bottleneck === 0) {
      break;
    }

    // Update residual capacities
    for (let i = 0; i < result.path.length - 1; i++) {
      const from = result.path[i];
      const to = result.path[i + 1];

      const currentCapacity = graph.get(from)!.get(to)!;
      graph.get(from)!.set(to, currentCapacity - result.bottleneck);

      const reverseCapacity = graph.get(to)!.get(from) || 0;
      graph.get(to)!.set(from, reverseCapacity + result.bottleneck);
    }

    maxFlow += result.bottleneck;
    iterations++;
  }

  if (iterations >= maxIterations) {
    console.warn('Ford-Fulkerson: Max iterations reached');
  }

  return maxFlow;
};

// Edmonds-Karp algorithm using BFS
export const edmondsKarp = (edges: Edge[]): number => {
  const graph = buildGraph(edges);
  const source = 'A';
  const sink = 'T';

  // BFS to find shortest augmenting path
  const bfs = (): { found: boolean; parent: Map<string, string>; bottleneck: number } => {
    const visited = new Set<string>([source]);
    const queue: Array<{ node: string; capacity: number }> = [{ node: source, capacity: Infinity }];
    const parent = new Map<string, string>();
    let bottleneck = 0;

    while (queue.length > 0) {
      const { node, capacity } = queue.shift()!;

      if (node === sink) {
        bottleneck = capacity;
        return { found: true, parent, bottleneck };
      }

      const neighbors = graph.get(node);
      if (neighbors) {
        for (const [neighbor, edgeCapacity] of neighbors.entries()) {
          if (!visited.has(neighbor) && edgeCapacity > 0) {
            visited.add(neighbor);
            parent.set(neighbor, node);
            queue.push({
              node: neighbor,
              capacity: Math.min(capacity, edgeCapacity),
            });
          }
        }
      }
    }

    return { found: false, parent, bottleneck: 0 };
  };

  let maxFlow = 0;
  let iterations = 0;
  const maxIterations = 1000; // Prevent infinite loops

  // Keep finding augmenting paths
  while (iterations < maxIterations) {
    const result = bfs();

    if (!result.found || result.bottleneck === 0) {
      break;
    }

    // Reconstruct path and update residual capacities
    let current = sink;
    while (current !== source) {
      const prev = result.parent.get(current)!;

      const currentCapacity = graph.get(prev)!.get(current)!;
      graph.get(prev)!.set(current, currentCapacity - result.bottleneck);

      const reverseCapacity = graph.get(current)!.get(prev) || 0;
      graph.get(current)!.set(prev, reverseCapacity + result.bottleneck);

      current = prev;
    }

    maxFlow += result.bottleneck;
    iterations++;
  }

  if (iterations >= maxIterations) {
    console.warn('Edmonds-Karp: Max iterations reached');
  }

  return maxFlow;
};
