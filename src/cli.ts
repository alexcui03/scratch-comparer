import SB3Loader from './loader/sb3';
import LcsCodeComparer from './comparer/code_lcs';

import yargs = require('yargs');
import util = require('util');

const argv = yargs.options({
    src: { type: 'string' },
    dst: { type: 'string' }
}).argv;

let srcLoader = new SB3Loader(argv.src);
let dstLoader = new SB3Loader(argv.dst);

let comparer = new LcsCodeComparer(srcLoader, dstLoader);

console.log(`Similarity: ${(comparer.compare().similarity * 100).toFixed(4)}%`);
