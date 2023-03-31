import fs from "fs";
import csv from "csv-parser";
import { alg, Edge, Graph } from "graphlib";
import { dijkstra } from "./dijkstra";
// create a new graph
const graph = new Graph();

interface RowData {
    "source airport": string;
    "destination airport": string;
}

interface DijkstraResult {
    distances: { [key: string]: number };
    previous: { [key: string]: string | null };
}

// read the CSV file and add nodes and edges to the graph
fs.createReadStream("routes.csv")
    .pipe(
        csv({
            mapHeaders: ({ header }) => header.trim(),
        })
    )
    .on("data", (row: RowData) => {
        const source = row["source airport"];
        const destination = row["destination airport"];

        // add source and destination airports as nodes, if not already present
        if (!graph.hasNode(source)) {
            graph.setNode(source);
        }
        if (!graph.hasNode(destination)) {
            graph.setNode(destination);
        }

        const dist =
            [source, destination].includes("KZN") &&
            [source, destination].includes("IST")
                ? 9999
                : 1;

        console.log({ source, destination, dist });
        // add edge with weight equal to 1
        graph.setEdge(source, destination, dist);
    })
    .on("end", () => {
        // compute the shortest path from KZN to TLL using the custom Dijkstra's algorithm with a maximum of 3 hops
        const maxHops = 3;
        function weight(e: Edge) {
            return graph.edge(e);
        }
        const results = dijkstra(graph, "KZN", weight, undefined, maxHops);

        // print the shortest distance between KZN and TLL airports
        console.log(
            `Shortest distance from KZN to TLL (limited to ${maxHops} hops):`,
            results["IST"]
        );
    });
