import { Graph } from "graphlib";
import PriorityQueue from "./priority-queue.js";

const DEFAULT_WEIGHT_FUNC = () => 1;

interface Edge {
    v: string;
    w: string;
}

type WeightFunction = (edge: Edge) => number;
type EdgeFunction = (v: string) => Edge[];

interface Result {
    distance: number;
    depth: number;
    predecessor?: string;
}

export type DijkstraArgs = {
    g: Graph;
    source: string;
    target: string;
    weightFn?: WeightFunction;
    edgeFn?: EdgeFunction;
    isDeepEdgeFn?: (e: Edge) => boolean;
    maxDepth?: number;
};

export function dijkstra({
    g,
    source,
    target,
    weightFn = DEFAULT_WEIGHT_FUNC,
    edgeFn = (v) => g.outEdges(v) || [],
    isDeepEdgeFn = () => true,
    maxDepth = Number.POSITIVE_INFINITY,
}: DijkstraArgs): number {
    const results: Record<string, Result> = {};
    const pq = new PriorityQueue();
    let v: string, vEntry: Result;

    const updateNeighbors = (edge: Edge): void => {
        const w = edge.v !== v ? edge.v : edge.w;
        const wEntry = results[w];
        const weight = weightFn(edge);
        const distance = vEntry.distance + weight;

        if (weight < 0) {
            throw new Error(
                "dijkstra does not allow negative edge weights. " +
                    `Bad edge: ${edge.v} -> ${edge.w}. Weight: ${weight}`
            );
        }

        if (distance < wEntry.distance) {
            const depth = vEntry.depth + (isDeepEdgeFn(edge) ? 1 : 0);

            if (depth <= maxDepth) {
                wEntry.distance = distance;
                wEntry.depth = depth;
                wEntry.predecessor = v;
                pq.decrease(w, distance);
            }
        }
    };

    g.nodes().forEach((v) => {
        const { distance, depth } =
            v === source
                ? { distance: 0, depth: 0 }
                : { distance: Number.POSITIVE_INFINITY, depth: 0 };

        results[v] = { distance, depth };

        pq.add(v, distance);
    });

    while (pq.size() > 0) {
        v = pq.removeMin();
        vEntry = results[v];

        if (v === target || vEntry.distance === Number.POSITIVE_INFINITY) {
            break;
        }

        const edges = edgeFn(v);

        edges.forEach(updateNeighbors);
    }

    return results[target].distance;
}
