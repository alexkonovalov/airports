import fs from "fs";
import { Graph, json } from "graphlib";
import { AirportRowData } from "./AirportRowData";
import {
    AIRPORTS_SOURCE_PATH,
    GRAPH_PATH,
    ROUTES_SOURCE_PATH,
} from "../constants";
import { RouteRowData } from "./RouteRowData";
import { populateSkyRoutes } from "./populateSkyRoutes";
import { csvParse } from "./csvParse";
import { populateGroundRoutes } from "./populateGroundRoutes";

async function main() {
    const graph = new Graph();

    const airports = (
        await csvParse<AirportRowData>(AIRPORTS_SOURCE_PATH, {
            mapHeaders: ({ header }) => header.trim(),
        })
    ).filter(({ IATA }) => IATA !== "\\N");
    console.log("Airports data parsed");

    const routes = await csvParse<RouteRowData>(ROUTES_SOURCE_PATH, {
        mapHeaders: ({ header }) => header.trim(),
    });
    console.log("Routes data parsed");

    console.log("Populating graph with sky routes..");
    populateSkyRoutes(routes, airports, graph);
    console.log("Sky routes added.");

    //todo add that we check that ground root already exists, then remove air route

    console.log("Populating graph with ground routes..");
    populateGroundRoutes(airports, graph);
    console.log("Ground routes added.");

    const jsonGraph = json.write(graph);
    fs.writeFileSync(GRAPH_PATH, JSON.stringify(jsonGraph));
    console.log(`Finish! Graph saved to ${GRAPH_PATH}`);
}

main()
    .then(() => "All done")
    .catch((e) => console.log(e));
