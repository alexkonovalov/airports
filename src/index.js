"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var csv_parser_1 = require("csv-parser");
var graphlib_1 = require("graphlib");
// create a new directed graph
var graph = new graphlib_1["default"].Graph({ directed: true });
// read the CSV file and add nodes and edges to the graph
fs_1["default"].createReadStream("./routes.csv")
    .pipe((0, csv_parser_1["default"])())
    .on("data", function (row) {
    console.log({ row: row }); //
    // add source and destination airports as nodes
    graph.setNode(row["Source airport"]);
    graph.setNode(row["Destination airport"]);
    // add edge with weight equal to 1
    graph.setEdge(row["Source airport"], row["Destination airport"], {
        weight: 1
    });
})
    .on("end", function () {
    // print the number of nodes and edges in the graph
    console.log("Number of nodes: ".concat(graph.nodeCount()));
    console.log("Number of edges: ".concat(graph.edgeCount()));
});
