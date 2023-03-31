import fs from "fs";
import csv from "csv-parser";
import { alg, Edge, Graph } from "graphlib";
import { dijkstra } from "./dijkstra";
import { getDistance, getPreciseDistance } from "geolib";
// create a new graph
const graph = new Graph();

interface RouteRowData {
    "source airport": string;
    "destination airport": string;
}

interface AirportRowData {
    IATA: string;
    Latitude: string;
    Longitude: string;
}

interface DijkstraResult {
    distances: { [key: string]: number };
    previous: { [key: string]: string | null };
}

const airports: Record<string, { latitude: string; longitude: string }> = {};

fs.createReadStream("airports.csv")
    .pipe(
        csv({
            //  separator: ";",
        })
    )
    .on("data", ({ IATA, Latitude, Longitude }: AirportRowData) => {
        airports[IATA] = { latitude: Latitude, longitude: Longitude };
    })
    .on("end", () => {
        // read the CSV file and add nodes and edges to the graph
        fs.createReadStream("routes.csv")
            .pipe(
                csv({
                    mapHeaders: ({ header }) => header.trim(),
                })
            )
            .on("data", (row: RouteRowData) => {
                const source = row["source airport"];
                const destination = row["destination airport"];

                // add source and destination airports as nodes, if not already present
                if (!graph.hasNode(source)) {
                    graph.setNode(source);
                }
                if (!graph.hasNode(destination)) {
                    graph.setNode(destination);
                }

                const from = airports[source];
                const to = airports[destination];

                const distance =
                    from && to
                        ? getPreciseDistance(from, to)
                        : Number.POSITIVE_INFINITY;

                // const dist =
                //     [source, destination].includes("KZN") &&
                //     [source, destination].includes("IST")
                //         ? 9999
                //         : 1;

                // console.log({ source, destination, dd });
                // add edge with weight equal to 1
                graph.setEdge(source, destination, distance);
            })
            .on("end", () => {
                // compute the shortest path from KZN to TLL using the custom Dijkstra's algorithm with a maximum of 3 hops
                const maxHops = 2;
                function weight(e: Edge) {
                    return graph.edge(e);
                }

                const results = dijkstra(
                    graph,
                    "TLL",
                    weight,
                    undefined,
                    maxHops
                );

                // print the shortest distance between KZN and TLL airports
                console.log(
                    `Shortest distance (limited to ${maxHops} hops):`,
                    results["PEK"]
                );

                // console.log(airports["TLL"]);
            });
    });
