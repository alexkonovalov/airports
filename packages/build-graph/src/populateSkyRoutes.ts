import { Graph } from "graphlib";
import { getDistance } from "geolib";
import { AirportRowData, RouteRowData } from "./types";

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

        graph.setEdge(source, destination, {
            distance,
            isAir: true,
        });
    });
}
