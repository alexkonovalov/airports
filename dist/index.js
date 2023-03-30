"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const graphlib_1 = require("graphlib");
const graphlib = __importStar(require("graphlib"));
// create a new graph
const graph = new graphlib_1.Graph();
// read the CSV file and add nodes and edges to the graph
fs_1.default.createReadStream("routes.csv")
    .pipe((0, csv_parser_1.default)({
    mapHeaders: ({ header }) => header.trim(),
}))
    .on("data", (row) => {
    // console.log("row", row);
    const source = row["source airport"];
    const destination = row["destination airport"];
    // console.log({ source, destination });
    // add source and destination airports as nodes, if not already present
    if (!graph.hasNode(source)) {
        graph.setNode(source);
    }
    if (!graph.hasNode(destination)) {
        graph.setNode(destination);
    }
    // add edge with weight equal to 1
    graph.setEdge(source, destination, 1);
})
    .on("end", () => {
    // compute the shortest path from TLL to SVO using Dijkstra's algorithm
    const dijkstra = graphlib.alg.dijkstra(graph, "KZN", undefined);
    // print the shortest distance between TLL and SVO airports
    console.log(`Shortest distance from AER`, dijkstra["TLL"]);
});
