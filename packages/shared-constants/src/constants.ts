const DATA_FOLDER = "./../../data";

export const AIRPORTS_SOURCE_PATH = `${DATA_FOLDER}/airports.csv`;
export const ROUTES_SOURCE_PATH = `${DATA_FOLDER}/routes.csv`;

export const GRAPH_PATH = `${DATA_FOLDER}/derived/graph.json`;

export enum TravelMeansEnum {
    Air = "AIR",
    Ground = "GROUND",
}