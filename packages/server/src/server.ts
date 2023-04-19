import fs from "fs";
import express, { Request, Response } from "express";
import { Edge, json as graphlibJson } from "graphlib";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { dijkstra } from "./dijkstra/dijkstra";
import { IATA_REGEX, MAX_LEGS, TravelMeansEnum } from "./constants";

const argv = yargs(hideBin(process.argv))
    .option("graph", {
        alias: "g",
        type: "string",
        description: "Path for the input graph",
        demandOption: true,
    })
    .parseSync();

const graphObj = JSON.parse(fs.readFileSync(argv.graph).toString());
const graph = graphlibJson.read(graphObj);

function weightFn(e: Edge) {
    const edge = graph.edge(e);
    return edge.distance;
}

function isDeepEdgeFn(e: Edge) {
    const edge = graph.edge(e);
    return edge.isAir;
}

const app = express();
const port = process.env.PORT || 3000;

console.log({ legs: MAX_LEGS });

app.get(
    "/calculate",
    (
        { query }: Request<{}, {}, {}, { source?: string; target?: string }>,
        res: Response
    ) => {
        if (!query.source || !query.target) {
            res.status(400).send("Missing source or target airport IATA");
            return;
        }

        const { source, target } = {
            source: query.source.toUpperCase(),
            target: query.target.toUpperCase(),
        };

        if (!IATA_REGEX.test(source) || !graph.hasNode(source)) {
            res.status(403).send("Invalid source airport IATA");
            return;
        }

        if (!IATA_REGEX.test(target) || !graph.hasNode(target)) {
            res.status(403).send("Invalid target airport IATA");
            return;
        }

        const { distance, path } = dijkstra({
            g: graph,
            source,
            target,
            weightFn,
            isDeepEdgeFn,
            maxDepth: MAX_LEGS,
        });

        console.log({ distance, path });
        const result = {
            start: source,
            finish: target,
            distance:
                distance === Number.POSITIVE_INFINITY ? "Infinity" : distance,
            path: path.map(({ isDeep, ...x }) => ({
                ...x,
                means: isDeep ? TravelMeansEnum.Air : TravelMeansEnum.Ground,
            })),
        };

        res.json(result);
    }
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
