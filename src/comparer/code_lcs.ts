import Comparer, { CompareResult } from './comparer';
import Tree from '../lib/tree';
import Flow from '../lib/flow';
import Block from '../lib/block';

class LcsCodeComparer extends Comparer {
    public compare(): CompareResult {
        let srcTrees = this.srcLoader.getSyntaxTrees();
        let dstTrees = this.dstLoader.getSyntaxTrees();

        let flow = new Flow();
        let s = 1, t = 2;
        for (let i = 0; i < srcTrees.length; ++i) {
            flow.addFlowEdge(s, i + 10, 1, 0);
            flow.addFlowEdge(i + 10 + srcTrees.length, t, 1, 0);
            let srcDLR = srcTrees[i].orderDLR();
            for (let j = 0; j < dstTrees.length; ++j) {
                let dstDLR = dstTrees[j].orderDLR();
                let sim = this.lcs<Block>(srcDLR, dstDLR, (a: Block, b: Block): boolean => {
                    if (a.opcode === b.opcode) {
                        if (a.opcode === '#' || a.opcode === '%') {
                            return a.data === b.data;
                        }
                        return true;
                    }
                    return false;
                });
                //console.log(i, j, sim / srcDLR.length, sim / dstDLR.length);
                flow.addFlowEdge(i + 10, j + 10 + srcTrees.length, 1, sim / dstDLR.length);
            }
        }
        
        let c = flow.mcmf(s, t);

        let res = new CompareResult();
        res.similarity = flow.getCost() / c;
        return res;
    }

    private lcs<T>(src: T[], dst: T[], cmp: (a: T, b: T) => boolean): number {
        let dp = [[], []];
        for (let i = 0; i <= src.length; ++i) {
            for (let j = 0; j <= dst.length; ++j) {
                if (i === 0 || j === 0) {
                    dp[i % 2][j] = 0;
                }
                else if (cmp(src[i - 1], dst[j - 1])) {
                    dp[i % 2][j] = dp[(i + 1) % 2][j - 1] + 1;
                }
                else {
                    dp[i % 2][j] = Math.max(dp[i % 2][j - 1], dp[(i + 1) % 2][j]);
                }
            }
        }
        return dp[src.length % 2][dst.length];
    }
}

export { LcsCodeComparer as default };
