import { Graph } from "graphlib";
import { getDistance } from "geolib";
import { RouteRowData } from "./RouteRowData";
import { AirportRowData } from "./AirportRowData";

export function populateSkyRoutes(
    routeRows: RouteRowData[],
    airportRows: AirportRowData[],
    graph: Graph
) {
    const airports = airportRows.reduce<
        Record<string, { latitude: string; longitude: string }>
    >(
        (
            acc,
            { IATA, Latitude: latitude, Longitude: longitude }: AirportRowData
        ) => {
            acc[IATA] = { latitude, longitude };
            return acc;
        },
        {}
    );
    routeRows.forEach((row: RouteRowData) => {
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

        if (!from || !to) {
            return;
        }
        const distance = getDistance(from, to);

        // add edge with weight equal to 1
        graph.setEdge(source, destination, {
            distance,
            isAir: true,
        });
    });
}
