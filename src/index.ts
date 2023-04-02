import fs from "fs";
import csv from "csv-parser";
import { alg, Edge, Graph } from "graphlib";
import { dijkstra } from "./dijkstra";
import { getDistance, getPreciseDistance } from "geolib";
import { AirportRowData } from "./AirportRowData";

// create a new graph
const graph = new Graph();

interface RouteRowData {
    "source airport": string;
    "destination airport": string;
}

interface DijkstraResult {
    distances: { [key: string]: number };
    previous: { [key: string]: string | null };
}

const airports: Record<string, { latitude: string; longitude: string }> = {};
const airportsList: { IATA: string; latitude: string; longitude: string }[] =
    [];
const neighbors: Record<string, number> = {};

fs.createReadStream("airports.csv")
    .pipe(
        csv({
            //  separator: ";",
        })
    )
    .on(
        "data",
        ({
            IATA,
            Latitude: latitude,
            Longitude: longitude,
        }: AirportRowData) => {
            airports[IATA] = { latitude, longitude };
            airportsList.push({ IATA, latitude, longitude });
        }
    )
    .on("end", () => {
        console.log("prepare neighbours");
        airportsList.forEach((airport1, i) => {
            airportsList.forEach((airport2, j) => {
                if (i !== j) {
                    const distance = getDistance(
                        {
                            latitude: airport1.latitude,
                            longitude: airport1.longitude,
                        },
                        {
                            latitude: airport2.latitude,
                            longitude: airport2.longitude,
                        }
                    );

                    if (distance / 1000 <= 100) {
                        const hash =
                            airport1.IATA < airport2.IATA
                                ? `${airport1.IATA}.${airport2.IATA}`
                                : `${airport2.IATA}.${airport1.IATA}`;

                        neighbors.hash === undefined &&
                            (neighbors[hash] = distance);
                    }
                }
            });
        });

        console.log({ neighbors });

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
                graph.setEdge(source, destination, {
                    distance,
                    isAir: true,
                });
            })
            .on("end", () => {
                // compute the shortest path from KZN to TLL using the custom Dijkstra's algorithm with a maximum of 3 hops
                const maxHops = 2;
                function weight(e: Edge) {
                    console.log({ wieghte: e });
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

                // print the shortest distance between KZN and TLL airports
                console.log(
                    `Shortest distance (limited to ${maxHops} hops):`,
                    results["PEK"]
                );

                // console.log(airports["TLL"]);
            });
    });
