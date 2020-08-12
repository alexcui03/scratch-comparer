import Graph from './graph';

class FlowData {
    public weight: number;
    public cost: number;
}

class Flow extends Graph<FlowData> {
    private dis: number[] = [];
    private pre: number[] = [];
    private flow: number[] = [];
    private cost: number = 0;

    public getCost() {
        return this.cost;
    }

    public addFlowEdge(u: number, v: number, w: number, c: number): void {
        this.addEdge(u, v, {
            weight: w,
            cost: c
        });
        this.addEdge(v, u, {
            weight: 0,
            cost: -c
        });
    }

    private spfa(s: number, t: number): number {
        let queue: number[] = [];
        let vis: boolean[] = [];
        this.dis = [];
        this.dis[s] = 0;
        this.dis[t] = -1;
        this.pre[s] = -1;
        this.flow[s] = this.edge.length + 100;
        queue.push(s);
        while (queue.length > 0) {
            let d = queue.shift();
            vis[d] = false;
            //console.log('SPFA1', d, this.getEdgeId(d));
            for (let id of this.getEdgeId(d)) {
                const to = this.edge[id].to;
                if (this.edge[id].data.weight > 0
                    && (this.dis[to] === undefined
                    || this.dis[to] < this.dis[d] + this.edge[id].data.cost)
                ) {
                    if (vis[to] !== true) {
                        queue.push(to);
                        vis[to] = true;
                    }
                    this.pre[to] = id;
                    this.dis[to] = this.dis[d] + this.edge[id].data.cost;
                    this.flow[to] = Math.min(this.flow[d], this.edge[id].data.weight);
                    //console.log('SPFA', d, this.edge[id].from, this.edge[id].to, this.dis[to], this.flow[to]);
                    if (to === t) {
                        break;
                    }
                }
            }
        }
        return this.dis[t];
    }

    public mcmf(s: number, t: number) {
        this.cost = 0;
        let res = 0;
        while (this.spfa(s, t) !== -1) {
            for (let e = this.pre[t]; e !== -1; e = this.pre[this.edge[e].from]) {
                this.cost += this.flow[t] * this.edge[e].data.cost;
                this.edge[e].data.weight -= this.flow[t];
                this.edge[e ^ 1].data.weight += this.flow[t];
            }
            res += this.flow[t];
            //console.log('MCMF', res, this.cost);
        }
        return res;
    }
}

export { Flow as default };

