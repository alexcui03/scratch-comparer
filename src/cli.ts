import SB3Loader from './loader/sb3';
import LcsCodeComparer from './comparer/code_lcs';

import yargs = require('yargs');
import util = require('util');

const argv = yargs
    .usage('Usage: $0 [options]')
    .alias('v', 'version')
    .alias('s', 'src')
    .describe('s', 'Source file path')
    .alias('d', 'dst')
    .describe('d', 'Destination file path')
    .alias('p', 'precision')
    .describe('p', 'Decimal precision')
    .alias('h', 'help')
    .help('h')
    .demandOption(['s', 'd'])
    .epilog('Write by Alex Cui')
    .options({
        src: { type: 'string' },
        dst: { type: 'string' },
        precision: { type: 'number', default: 4 }
    }).argv;

let srcLoader = new SB3Loader(argv.src);
let dstLoader = new SB3Loader(argv.dst);

let comparer = new LcsCodeComparer(srcLoader, dstLoader);

console.log(`Similarity: ${(comparer.compare().similarity * 100).toFixed(argv.precision)}%`);
