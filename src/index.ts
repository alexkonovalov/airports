import { readFileSync } from "fs";
import { Edge, json, alg } from "graphlib";
import { dijkstra } from "./dijkstra";
import { GRAPH_PATH } from "./constants";

const graphObj = JSON.parse(readFileSync(GRAPH_PATH).toString());
const graph = json.read(graphObj);
const maxLegs = 4;

function weight(e: Edge) {
    const edge = graph.edge(e);
    return edge.distance;
}
const startTime = performance.now();
const result = dijkstra({
    g: graph,
    source: "TLL",
    target: "PEK",
    weightFn: weight,
    edgeFn: undefined,
    isDeepEdgeFn: (e) => {
        const edge = graph.edge(e);
        return edge.isAir;
    },
    maxDepth: maxLegs,
});

const endTime = performance.now();
const executionTime = endTime - startTime;

console.log(`Execution time: ${executionTime} milliseconds`);

console.log(`Shortest distance (limited to ${maxLegs} legs):`, result);
