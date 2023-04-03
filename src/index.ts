import { readFileSync } from "fs";
import { Edge, json, alg } from "graphlib";
import { dijkstra } from "./dijkstra";
import { GRAPH_PATH } from "./constants";

const graphObj = JSON.parse(readFileSync(GRAPH_PATH).toString());
const graph = json.read(graphObj);

const maxHops = 2;
function weight(e: Edge) {
    const edge = graph.edge(e);
    console.log({ edge });
    return edge.distance;
}

const results = dijkstra(
    graph,
    "TLL",
    weight,
    undefined,
    (e) => {
        const edge = graph.edge(e);
        return edge.isAir;
    },
    maxHops
);

console.log(`Shortest distance (limited to ${maxHops} hops):`, results["PEK"]);
