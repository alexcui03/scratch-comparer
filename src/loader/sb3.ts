import * as Fs from 'fs';
import * as Path from 'path';
import AdmZip = require('adm-zip');

import Loader from './loader';
import Tree from '../lib/tree';
import Block from '../lib/block';

class SB3Loader extends Loader {
    protected loadFile(): void {
        let zip: any = AdmZip(this.filePath);
        const baseName: string = Path.basename(this.filePath);
        const extName: string = Path.extname(this.filePath);
        const extractPath: string = Path.join(this.tempPath, baseName);
        zip.extractAllTo(extractPath, true);
        this.image = [];
        this.audio = [];
        let project;
        
        for (let file of Fs.readdirSync(extractPath)) {
            if (['.wav', '.mp3'].includes(Path.extname(file))) {
                this.audio.push(file);
            }
            if (['.png', '.svg'].includes(Path.extname(file))) {
                this.image.push(file);
            }
            if (file == 'project.json') {
                const jsonStr = Fs.readFileSync(Path.join(extractPath, file), { encoding: 'utf-8' });
                project = JSON.parse(jsonStr);
            }
        }

        if (project) {
            this.loadProject(project);
        }
        else {
            throw 'Cannot find valid project json.';
        }
    }

    private loadProject(project): void {
        // Load targets
        for (let target of project.targets) {
            if (target.isStage) {
                this.loadStage(target);
            }
            else {
                this.loadSprite(target);
            }
        }
    }

    private loadStage(stage): void {
        this.loadBlocks(stage.blocks);
    }

    private loadSprite(sprite): void {
        this.loadBlocks(sprite.blocks);
    }

    private loadBlocks(blocks): void {
        this.syntaxTrees = [];
        for (let blockId in blocks) {
            if (blocks[blockId].topLevel) {
                let tree = new Tree<Block>();
                this.loadBlock(blocks, tree, blockId, 0);
                this.syntaxTrees.push(tree);
            }
        }
    }

    private loadBlock(blocks, tree: Tree<Block>, blockId, parentId): void {
        while (blocks.hasOwnProperty(blockId)) {
            const block = blocks[blockId];

            // add block itself
            let data = new Block();
            data.opcode = block.opcode;
            let cur = tree.addChild(parentId, data);

            // load fields
            let fields = block.fields;
            for (let fieldId in fields) {
                let field = fields[fieldId];

                let block = new Block();
                block.opcode = '#';
                if (fieldId === 'LIST' || fieldId === 'VARIABLE') {
                    block.data = field[1];
                }
                else {
                    block.data = field[0];
                }
                tree.addChild(cur, block);
            }

            // load inputs
            let inputs = block.inputs;
            for (let inputId in inputs) {
                let input = inputs[inputId];

                if (Array.isArray(input)) {
                    // 1: INPUT_SAME_BLOCK_SHADOW
                    // 2: INPUT_BLOCK_NO_SHADOW
                    // 3: INPUT_DIFF_BLOCK_SHADOW
                    if (Array.isArray(input[1])) {
                        let type = input[1][0];
                        switch (type) {
                        case 4: // MATH_NUM_PRIMITIVE
                        case 5: // POSITIVE_NUM_PRIMITIVE
                        case 6: // WHOLE_NUM_PRIMITIVE
                        case 7: // INTEGER_NUM_PRIMITIVE
                        case 8: // ANGLE_NUM_PRIMITIVE
                        case 9: // COLOR_PICKER_PRIMITIVE
                        case 10: { // TEXT_PRIMITIVE
                            let block = new Block();
                            block.opcode = '%';
                            block.data = input[1][1];
                            tree.addChild(cur, block);
                            break;
                        }
                        case 11: { // BROADCAST_PRIMITIVE
                            let block = new Block();
                            block.opcode = '%';
                            block.data = input[1][2];
                            tree.addChild(cur, block);
                            break;
                        }
                        case 12: // VAR_PRIMITIVE
                        case 13: { // LIST_PRIMITIVE
                            let out = new Block();
                            if (type == 12) {
                                out.opcode = 'data_variable';
                            }
                            else {
                                out.opcode = 'data_listcontents';
                            }
                            let inn = new Block();
                            inn.opcode = '%';
                            inn.data = input[1][2];
                            tree.addChild(tree.addChild(cur, out), inn);
                            break;
                        }
                        default: {
                            console.error('error', input);
                            throw 'Found unknown primitive type.';
                        }
                        }
                    }
                    else {
                        this.loadBlock(blocks, tree, input[1], cur);
                    }
                }
                else {
                    console.log(inputId, input);
                }
            }

            // load fields
            /*let inputs = block.inputs;
            for (let inputId in inputs) {
                console.log(inputId); // DEBUG
                this.loadBlock(blocks, tree, inputId, parent);
            }*/

            blockId = block.next;
        }
    }
}

export { SB3Loader as default };
