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
    edgeFn: EdgeFunction = (v) => g.outEdges(v) || [],
    isHopFn: (e: Edge) => boolean = () => true,
    maxHops: number = Number.POSITIVE_INFINITY
): Record<string, Result> {
    return runDijkstra(g, String(source), weightFn, edgeFn, isHopFn, maxHops);
}

function runDijkstra(
    g: Graph,
    source: string,
    weightFn: WeightFunction,
    edgeFn: EdgeFunction,
    isHopFn: (e: Edge) => boolean,
    maxHops: number
): Record<string, Result> {
    const results: Record<string, Result> = {};
    const hops: Record<string, number> = {};
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
        results[v] = { distance };

        pq.add(v, distance);
    });

    hops[source] = 0;
    while (pq.size() > 0) {
        v = pq.removeMin();
        vEntry = results[v];
        const hop = hops[v];
        if (hop + 1 > maxHops) {
            continue;
        }

        if (vEntry.distance === Number.POSITIVE_INFINITY) {
            break;
        }

        const edges = edgeFn(v);

        edges.forEach(updateNeighbors);
        edges.forEach((edge) => {
            if (!isHopFn(edge)) {
                return;
            }
            const w = edge.v !== v ? edge.v : edge.w;
            hops[w] = hop + 1;
        });
    }

    return results;
}
