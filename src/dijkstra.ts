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
    predecessor?: string;
}

export function dijkstra(
    g: Graph,
    source: string,
    weightFn: WeightFunction = DEFAULT_WEIGHT_FUNC,
    edgeFn: EdgeFunction = (v) => g.outEdges(v) || []
): Record<string, Result> {
    return runDijkstra(g, String(source), weightFn, edgeFn);
}

function runDijkstra(
    g: Graph,
    source: string,
    weightFn: WeightFunction,
    edgeFn: EdgeFunction
): Record<string, Result> {
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
                    "Bad edge: " +
                    edge +
                    " Weight: " +
                    weight
            );
        }

        if (distance < wEntry.distance) {
            wEntry.distance = distance;
            wEntry.predecessor = v;
            pq.decrease(w, distance);
        }
    };

    g.nodes().forEach((v) => {
        const distance = v === source ? 0 : Number.POSITIVE_INFINITY;
        results[v] = { distance: distance };
        pq.add(v, distance);
    });

    while (pq.size() > 0) {
        v = pq.removeMin();
        vEntry = results[v];
        if (vEntry.distance === Number.POSITIVE_INFINITY) {
            break;
        }

        edgeFn(v).forEach(updateNeighbors);
    }

    return results;
}
