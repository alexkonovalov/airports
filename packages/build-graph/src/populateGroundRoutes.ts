import { Graph } from "graphlib";
import { AirportRowData } from "./AirportRowData";
import { getDistance } from "geolib";

export function populateGroundRoutes(
    airportRows: AirportRowData[],
    graph: Graph
) {
    airportRows.forEach((airport1, i) => {
        airportRows.forEach((airport2, j) => {
            if (i !== j) {
                const distance = getDistance(
                    {
                        latitude: airport1.Latitude,
                        longitude: airport1.Longitude,
                    },
                    {
                        latitude: airport2.Latitude,
                        longitude: airport2.Longitude,
                    }
                );

                if (distance / 1000 <= 100) {
                    graph.setEdge(airport1.IATA, airport2.IATA, {
                        distance,
                        isAir: false,
                    });
                }
            }
        });
    });
}
