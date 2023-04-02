declare module "ml-knn" {
    export class BallTree {
        constructor(
            points: number[][],
            distance: (a: number[], b: number[]) => number
        );
        search(
            queryPoint: number[],
            numNeighbours: number,
            maxDistance: number
        ): [number[], number[]];
    }
}
