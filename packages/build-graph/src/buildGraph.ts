import * as fs from "fs";
import { Graph, json } from "graphlib";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { csvParse } from "./csvParse";
import { populateSkyRoutes } from "./populateSkyRoutes";
import { populateGroundRoutes } from "./populateGroundRoutes";
import { AIRPORTS_SOURCE_PATH, ROUTES_SOURCE_PATH } from "./constants";
import { AirportRowData, RouteRowData } from "./types";

async function main(graphPath: string) {
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

    console.log("Populating graph with ground routes..");
    let groundRoutesProgress = 0;
    populateGroundRoutes(airports, graph, (i) => {
        const newProgress = Math.round((i / airports.length) * 100);
        if (newProgress !== groundRoutesProgress) {
            groundRoutesProgress = newProgress;
            process.stdout.write(`Progress: ${newProgress}%\r`);
        }
    });
    console.log("Ground routes added.");

    const jsonGraph = json.write(graph);
    fs.writeFileSync(graphPath, JSON.stringify(jsonGraph));
    console.log(`Finish! Graph saved to ${graphPath}`);
}

const argv = yargs(hideBin(process.argv))
    .option("output", {
        alias: "o",
        type: "string",
        description: "Output path for the generated graph",
        demandOption: true,
    })
    .parseSync();

main(argv.output)
    .then(() => "All done")
    .catch((e) => console.log(e));
