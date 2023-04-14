import { Graph, Edge } from "graphlib";
import { dijkstra, DijkstraArgs } from "./dijkstra";

describe("Given Custom Dijkstra Algorithm", () => {
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

    describe("When running with graph with negative edges", () => {
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

    describe("When not provided a weight function", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
            };
        });

        it("should return the correct shortest path from A to E considering all weights as 1", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "E",
            });

            expect(distance).toEqual(2);
            expect(path).toMatchObject([
                {
                    distance: 1,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 1,
                    from: "C",
                    isDeep: true,
                    to: "E",
                },
            ]);
        });

        it("should return the correct shortest path from A to D considering all weights as 1", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "D",
            });

            expect(distance).toEqual(2);
            expect(path).toMatchObject([
                {
                    distance: 1,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 1,
                    from: "C",
                    isDeep: true,
                    to: "D",
                },
            ]);
        });

        it("should return the correct shortest path from A to C considering all weights as 1", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "C",
            });

            expect(distance).toEqual(1);
            expect(path).toMatchObject([
                {
                    distance: 1,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
            ]);
        });

        it("should return zero path from A to itself", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "A",
            });
            expect(distance).toEqual(0);
            expect(path).toEqual([]);
        });
    });

    describe("When running to infinite depth", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
                weightFn: (edge: Edge) => graph.edge(edge),
            };
        });

        it("should return the correct shortest path from A to E", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "E",
            });

            expect(distance).toEqual(7);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 2,
                    from: "C",
                    isDeep: true,
                    to: "E",
                },
            ]);
        });

        it("should return the correct shortest path from A to D", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "D",
            });

            expect(distance).toEqual(9);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 3,
                    from: "C",
                    isDeep: true,
                    to: "B",
                },
                {
                    distance: 1,
                    from: "B",
                    isDeep: true,
                    to: "D",
                },
            ]);
        });

        it("should return the correct shortest path from A to C", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "C",
            });

            expect(distance).toEqual(5);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
            ]);
        });

        it("should return the correct shortest path from A to B", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "B",
            });

            expect(distance).toEqual(8);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 3,
                    from: "C",
                    isDeep: true,
                    to: "B",
                },
            ]);
        });

        it("should return zero path from A to itself", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "A",
            });
            expect(distance).toEqual(0);
            expect(path).toEqual([]);
        });
    });

    describe("When running to the depth of 2 edges", () => {
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
            const { distance, path } = dijkstra({
                ...args,
                target: "E",
            });

            expect(distance).toEqual(7);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 2,
                    from: "C",
                    isDeep: true,
                    to: "E",
                },
            ]);
        });

        it("should return the correct shortest path from A to D", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "D",
            });

            expect(distance).toEqual(14);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 9,
                    from: "C",
                    isDeep: true,
                    to: "D",
                },
            ]);
        });

        it("should return the correct shortest path from A to C", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "C",
            });

            expect(distance).toEqual(5);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
            ]);
        });

        it("should return the correct shortest paths from A to B", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "B",
            });

            expect(distance).toEqual(8);
            expect(path).toMatchObject([
                {
                    distance: 5,
                    from: "A",
                    isDeep: true,
                    to: "C",
                },
                {
                    distance: 3,
                    from: "C",
                    isDeep: true,
                    to: "B",
                },
            ]);
        });

        it("should return zero path from A to itself", () => {
            const { distance, path } = dijkstra({
                ...args,
                target: "A",
            });
            expect(distance).toEqual(0);
            expect(path).toEqual([]);
        });
    });

    describe("When running to the depth of 1 edge ", () => {
        let args: Omit<DijkstraArgs, "target">;

        beforeEach(() => {
            args = {
                g: graph,
                source: "A",
                weightFn: (edge: Edge) => graph.edge(edge),
                maxDepth: 1,
            };
        });

        describe("and ignoring the depth of C->E edge", () => {
            beforeEach(() => {
                args = {
                    ...args,
                    isDeepEdgeFn: (edge: Edge) =>
                        edge.v !== "C" || edge.w !== "E",
                };
            });

            it("should return the correct shortest path including final shallow edge from A to E", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "E",
                });

                expect(distance).toEqual(7);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: true,
                        to: "C",
                    },
                    {
                        distance: 2,
                        from: "C",
                        isDeep: false,
                        to: "E",
                    },
                ]);
            });

            it("should return the infinity from A to D", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "D",
                });
                expect(distance).toEqual(Number.POSITIVE_INFINITY);
                expect(path).toMatchObject([]);
            });

            it("should return the correct shortest path from A to C", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "C",
                });

                expect(distance).toEqual(5);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: true,
                        to: "C",
                    },
                ]);
            });

            it("should return the correct shortest path from A to B", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "B",
                });

                expect(distance).toEqual(10);
                expect(path).toMatchObject([
                    {
                        distance: 10,
                        from: "A",
                        isDeep: true,
                        to: "B",
                    },
                ]);
            });

            it("should return zero path from A to itself", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "A",
                });
                expect(distance).toEqual(0);
                expect(path).toEqual([]);
            });
        });

        describe("and ignoring the depth of A->C edge", () => {
            beforeEach(() => {
                args = {
                    ...args,
                    isDeepEdgeFn: (edge: Edge) =>
                        !(edge.v === "A" && edge.w === "C"),
                };
            });

            it("should return the correct shortest path including opening shallow edge from A to C", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "E",
                });

                expect(distance).toEqual(7);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: false,
                        to: "C",
                    },
                    {
                        distance: 2,
                        from: "C",
                        isDeep: true,
                        to: "E",
                    },
                ]);
            });

            it("should return the correct shortest path including opening shallow edge from A to B", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "B",
                });

                expect(distance).toEqual(8);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: false,
                        to: "C",
                    },
                    {
                        distance: 3,
                        from: "C",
                        isDeep: true,
                        to: "B",
                    },
                ]);
            });

            it("should return the correct shortest path including opening shallow edge from A to D", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "D",
                });

                expect(distance).toEqual(14);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: false,
                        to: "C",
                    },
                    {
                        distance: 9,
                        from: "C",
                        isDeep: true,
                        to: "D",
                    },
                ]);
            });

            it("should return the correct shortest path including opening shallow edge from A to E", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "E",
                });

                expect(distance).toEqual(7);
                expect(path).toMatchObject([
                    {
                        distance: 5,
                        from: "A",
                        isDeep: false,
                        to: "C",
                    },
                    {
                        distance: 2,
                        from: "C",
                        isDeep: true,
                        to: "E",
                    },
                ]);
            });

            it("should return zero path from A to itself", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "A",
                });
                expect(distance).toEqual(0);
                expect(path).toEqual([]);
            });
        });

        describe("and ignoring subsequent shallow edges A->C, C->E", () => {
            beforeEach(() => {
                args = {
                    ...args,
                    isDeepEdgeFn: (edge: Edge) =>
                        !(edge.v === "A" && edge.w === "C") &&
                        !(edge.v === "C" && edge.w === "E"),
                };
            });

            it("should return Infinity from A to E", () => {
                const { distance, path } = dijkstra({
                    ...args,
                    target: "E",
                });

                expect(distance).toEqual(Number.POSITIVE_INFINITY);
                expect(path).toMatchObject([]);
            });
        });
    });
});
