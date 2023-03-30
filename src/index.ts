import fs from "fs";
import csv from "csv-parser";
import { Graph } from "graphlib";
import * as graphlib from "graphlib";

// create a new graph
const graph = new Graph();

interface RowData {
    "source airport": string;
    "destination airport": string;
}

// read the CSV file and add nodes and edges to the graph
fs.createReadStream("routes.csv")
    .pipe(
        csv({
            mapHeaders: ({ header }) => header.trim(),
        })
    )
    .on("data", (row: RowData) => {
        // console.log("row", row);
        const source = row["source airport"];
        const destination = row["destination airport"];
        // console.log({ source, destination });
        // add source and destination airports as nodes, if not already present
        if (!graph.hasNode(source)) {
            graph.setNode(source);
        }
        if (!graph.hasNode(destination)) {
            graph.setNode(destination);
        }

        // add edge with weight equal to 1
        graph.setEdge(source, destination, 1);
    })
    .on("end", () => {
        // compute the shortest path from TLL to SVO using Dijkstra's algorithm
        const dijkstra = graphlib.alg.dijkstra(graph, "KZN", undefined);

        // print the shortest distance between TLL and SVO airports
        console.log(`Shortest distance from AER`, dijkstra["TLL"]);
    });
