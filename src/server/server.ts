import fs from "fs";
import express, { Request, Response } from "express";
import { Edge, json as graphlibJson } from "graphlib";
import { dijkstra } from "../dijkstra/dijkstra";
import { GRAPH_PATH, TravelMeansEnum } from "../constants";

const MAX_LEGS = 4;
const IATA_REGEX = /^[A-Z]{3}$/;

const graphObj = JSON.parse(fs.readFileSync(GRAPH_PATH).toString());
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

        const result = {
            start: source,
            finish: target,
            distance,
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
