import { Graph, Edge } from "graphlib";
import { dijkstra, DijkstraArgs } from ".";

describe("Dijkstra Algorithm", () => {
    let graph: Graph;

    beforeEach(() => {
        graph = new Graph({ directed: true });
        graph.setNode("A", "A");
        graph.setNode("B", "B");
        graph.setNode("C", "C");
        graph.setNode("D", "D");
        graph.setNode("E", "E");

        graph.setEdge("A", "B", 10);
        graph.setEdge("A", "C", 5);
        graph.setEdge("B", "D", 1);
        graph.setEdge("C", "E", 2);
        graph.setEdge("E", "A", 2);
        graph.setEdge("E", "D", 6);
        graph.setEdge("C", "D", 9);
        graph.setEdge("C", "B", 3);
    });

    describe("when running with graph with negative edges", () => {
        it("should throw Error", () => {
            graph.setEdge("A", "D", -1);
            expect(() => {
                dijkstra({
                    g: graph,
                    weightFn: (edge: Edge) => graph.edge(edge),
                    source: "A",
                    target: "E",
                });
            }).toThrow(
                "dijkstra does not allow negative edge weights. Bad edge: A -> D. Weight: -1"
            );
        });
    });

    describe("when not provided a weight function", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
            };
        });

        it("should return the correct shortest path from A to E considering all weights as 1", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "E",
                }).distance
            ).toEqual(2);
        });

        it("should return the correct shortest path from A to D considering all weights as 1", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "D",
                }).distance
            ).toEqual(2);
        });

        it("should return the correct shortes path from A to C considering all weights as 1", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "C",
                }).distance
            ).toEqual(1);
        });

        it("should return the correct shortest path from A to B considering all weights as 1", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "B",
                }).distance
            ).toEqual(1);
        });

        it("should return zero path from A to itself", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "A",
                }).distance
            ).toEqual(0);
        });
    });

    describe("when running to infinite depth", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
                weightFn: (edge: Edge) => graph.edge(edge),
            };
        });

        it("should return the correct shortest path from A to E", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "E",
                }).distance
            ).toEqual(7);
        });

        it("should return the correct shortest path from A to D", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "D",
                }).distance
            ).toEqual(9);
        });

        it("should return the correct shortes path from A to C", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "C",
                }).distance
            ).toEqual(5);
        });

        it("should return the correct shortest path from A to B", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "B",
                }).distance
            ).toEqual(8);
        });

        it("should return zero path from A to itself", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "A",
                }).distance
            ).toEqual(0);
        });
    });

    describe("when running to the depth of 2 edges", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
                weightFn: (edge: Edge) => graph.edge(edge),
                maxDepth: 2,
            };
        });

        it("should return the correct shortest path from A to E", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "E",
                }).distance
            ).toEqual(7);
        });

        it("should return the correct reachable path from A to D", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "D",
                }).distance
            ).toEqual(14);
        });

        it("should return the correct shortes path from A to C", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "C",
                }).distance
            ).toEqual(5);
        });

        it("should return the correct shortest paths from A to B", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "B",
                }).distance
            ).toEqual(8);
        });

        it("should return zero path from A to itself", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "A",
                }).distance
            ).toEqual(0);
        });
    });

    describe("when running to the depth of 1 edge but ignoring the depth of A->E edge", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
                weightFn: (edge: Edge) => graph.edge(edge),
                isDeepEdgeFn: (edge: Edge) => edge.v !== "C" || edge.w !== "E",
                maxDepth: 1,
            };
        });

        it("should return the correct shortest path from A to E", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "E",
                }).distance
            ).toEqual(7);
        });

        it("should return the correct reachable path from A to D", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "D",
                }).distance
            ).toEqual(Number.POSITIVE_INFINITY);
        });

        it("should return the correct shortes path from A to C", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "C",
                }).distance
            ).toEqual(5);
        });

        it("should return the correct reachable path from A to B", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "B",
                }).distance
            ).toEqual(10);
        });

        it("should return zero path from A to itself", () => {
            expect(
                dijkstra({
                    ...args,
                    target: "A",
                }).distance
            ).toEqual(0);
        });
    });
});
