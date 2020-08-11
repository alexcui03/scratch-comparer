import * as Fs from 'fs';
import * as Path from 'path';

import Tree from '../lib/tree';
import Block from '../lib/block';
import { rmdirSync } from '../lib/util';

abstract class Loader {
    private _filePath: string;
    public get filePath(): string { return this._filePath };

    private _tempPath: string;
    public get tempPath(): string { return this._tempPath };

    protected syntaxTrees: Tree<Block>[];
    protected image: string[];
    protected audio: string[];

    constructor(filePath: string, tempPath?: string) {
        this._filePath = filePath;
        this._tempPath = tempPath || './temp';
        this.loadFile();
    }

    protected prepareTempDir(): void {
        const baseName: string = Path.basename(this.filePath);
        const extractPath: string = Path.join(this.tempPath, baseName);
        if (Fs.existsSync(extractPath)) {
            rmdirSync(extractPath);
        }
        else {
            Fs.mkdirSync(extractPath, { recursive: true });
        }
    }

    protected abstract loadFile(): void;

    public getSyntaxTrees(): Tree<Block>[] {
        return this.syntaxTrees;
    }

    public getSyntaxTree(id: number): Tree<Block> {
        return this.syntaxTrees[id];
    }

    public printSyntaxTrees(): void {
        const trees = this.getSyntaxTrees();
        for (let i = 0; i < trees.length; ++i) {
            this.printSyntaxTree(i);
            console.log('====================');
        }
    }

    public printSyntaxTree(id: number): void {
        const tree = this.getSyntaxTree(id);
        let stack = [];
        stack.push(0);
        stack.push(0);
        while (stack.length > 0) {
            let lv = stack.pop();
            let cur = stack.pop();

            let str = '';
            for (let i = 0; i < lv; ++i) {
                str += '  '
            }
            if (cur === 0) {
                console.log('root');
            }
            else {
                let data = tree.getDataById(cur);
                if (data.data !== undefined) {
                    console.log(str + data.opcode + '[' + data.data + '](' + cur.toString() + ')');
                }
                else {
                    console.log(str + data.opcode + '(' + cur.toString() + ')');
                }
            }

            let childs = tree.getChildId(cur);
            for (let i = 0; i < childs.length; ++i) {
                stack.push(childs[i]);
                stack.push(lv + 1);
            }
        }
    }
}

export { Loader as default };
