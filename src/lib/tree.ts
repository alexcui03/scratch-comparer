import Graph, { Edge } from './graph';

class Tree<T> extends Graph<number> {
    protected nodeNext: number;
    protected data: T[];

    constructor() {
        super();
        this.nodeNext = 1;
    }

    public clear(): void {
        this.head = [];
        this.edge = [];
        this.data = [];
        this.nodeNext = 1;
    }

    public addChild(parent: number, data: T): number {
        let cur: number = this.nodeNext;
        this.addEdge(parent, cur, 1);
        this.data[cur] = data;
        this.nodeNext++;
        return cur;
    }

    public merge(parent: number, tree: Tree<number>): void {
        let queue = [];
        queue.push(1);
        queue.push(parent);
        while (queue.length > 0) {
            let nodeId = queue.shift();
            let parentId = queue.shift();
            let fa = this.addChild(parentId, this.getDataById(parentId));
            let childs = this.getChildId(nodeId);
            for (let id of childs) {
                queue.push(id);
                queue.push(fa);
            }
        }
    }

    public getChildId(parent: number): number[] {
        return this.getEdgeTo(parent);
    }

    public getDataById(id: number): T {
        return this.data[id];
    }

    public orderDLR(): T[] {
        let res = [];
        let stack = [];
        stack.push(0);
        while (stack.length > 0) {
            let cur = stack.pop();

            if (cur !== 0) {
                res.push(this.getDataById(cur));
            }

            let childs = this.getChildId(cur);
            for (let i = 0; i < childs.length; ++i) {
                stack.push(childs[i]);
            }
        }
        return res;
    }
}

export { Tree as default };
