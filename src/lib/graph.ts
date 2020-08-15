class Edge<T> {
    public data: T;
    public from: number;
    public to: number;
    public next: number;
}

class Graph<T> {
    protected head: number[];
    protected edge: Edge<T>[];

    constructor() {
        this.clear();
    }

    public clear(): void {
        this.head = [];
        this.edge = [];
    }

    public addEdge(from: number, to: number, data: T): number {
        let cur: number = this.edge.length;
        let edge: Edge<T> = {
            data: data,
            from: from,
            to: to,
            next: this.head[from] === undefined ? -1 : this.head[from]
        };
        this.edge.push(edge);
        this.head[from] = cur;
        return cur;
    }

    public getEdgeId(from: number): number[] {
        let edge: number = this.head[from];
        let res: number[] = [];
        while (edge !== undefined && edge !== -1) {
            res.push(edge);
            edge = this.edge[edge].next;
        }
        return res;
    }

    public getEdgeTo(from: number): number[] {
        let edge: number = this.head[from];
        let res: number[] = [];
        while (edge !== undefined && edge !== -1) {
            res.push(this.edge[edge].to);
            edge = this.edge[edge].next;
        }
        return res;
    }

    public getEdgeData(from: number): T[] {
        let edge: number = this.head[from];
        let res: T[] = [];
        while (edge !== undefined && edge !== -1) {
            res.push(this.edge[edge].data);
            edge = this.edge[edge].next;
        }
        return res;
    }
}

export { Graph as default, Edge };
